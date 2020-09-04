<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>筛选查询</span>
        <div>
          <i
            :class="is_show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show = !is_show"
          ></i>
          <span>{{ word }}</span>
          <el-button @click="handleFilter">查询结果</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-form class="searchContent" v-show="is_show == true">
      <el-form-item label="起止时间：" style="min-width:382px;">
        <el-date-picker
          style="width:300px"
          v-model="timeScope"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item>
        <span>补采类型:</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in bucaiTypeoptions"
            :key="item.datatypecode"
            :label="item.datatypename"
            :value="item.datatypecode"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span>数据列表</span>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.limit"
          class="filter-item"
          placeholder="显示条数"
          @change="handleFilter"
        >
          <el-option
            v-for="item in numberOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 数据显示部分 -->
    <el-table
      ref="multipleTable"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
    </el-table>
    <el-form class="operation">
      <el-form-item style="width: 84%;">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.limit"
          @pagination="paginationChange"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import GeneralOptions from '@/utils/generalOptions'
import ToolLibrary from '@/utils/toolLibrary'

import Pagination from '@/components/Pagination'
import { getCollectLogList, getDataType } from '@/api/collection'

export default {
  components: { Pagination },
  props: {
    fatherHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    const day1 = new Date()
    day1.setTime(day1.getTime())
    this.beginTime =
      day1.getFullYear() +
      '-' +
      (day1.getMonth() + 1) +
      '-' +
      day1.getDate() +
      ' 00:00:00'
    this.endTime =
      day1.getFullYear() +
      '-' +
      (day1.getMonth() + 1) +
      '-' +
      day1.getDate() +
      ' 23:59:59'
    return {
      bucaiTypeoptions: [],
      dataTypeoptions: [
        {
          value: 'msg',
          label: 'msg'
        },
        {
          value: 'cac',
          label: 'cac'
        },
        {
          value: 'VIS',
          label: 'VIS'
        }
      ],
      timeScope: [],
      format: 'xls',
      checked: false,
      numberOptions: new GeneralOptions().numberOfPerPage(),
      is_show: true,
      value: '',
      list: [],
      total: 0,
      tableMeta: [
        { key: 'collectiontime', label: '数据类型' },
        { key: 'datatype', label: '文件名称' },
        { key: 'ip', label: '文件类型' },
        { key: 'fileName', label: '补采时间' }
      ],
      listQuery: {
        currentPage: 1,
        limit: 20,
        sort: 'asc',
        type: 'cac',
        startTime: this.beginTime,
        endTime: this.endTime
      }
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
    }
  },

  created() {
    // this.getList()
  },
  methods: {
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    timeChange() {
      this.listQuery.startTime = this.timeScope[0]
      this.listQuery.endTime = this.timeScope[1]
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    indexMethod(index) {
      return (this.listQuery.currentPage - 1) * this.listQuery.limit + 1 + index
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      getDataType().then(response => {
        this.bucaiTypeoptions = response.data
      })
      getCollectLogList(this.listQuery).then(response => {
        this.list = response.data
        // this.total = response.data.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dataList {
  padding-left: 15px;
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
  border-bottom: none !important;
}
.dataList .el-form-item.el-form-item--medium:nth-child(2) {
  float: right;
}
.searchContent {
  border: 1px solid #e4e4e4;
}
form.el-form.searchContent {
  padding: 10px;
}
.searchContent .el-form-item.el-form-item--medium:nth-child(2) {
  margin: 0px 27px;
}
.searchContent div {
  display: inline-block;
}
.el-icon-search {
  margin-right: 5px;
}
.app-container {
  color: #666666;
}
.filterSearch {
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
}
.filterSearch div {
  float: right;
}
.filterSearch span {
  margin-right: 20px;
}
.filter-item {
  width: 150px;
}
.operation .el-form-item.el-form-item--medium:nth-child(1) {
  width: 500px;
}
.tableButtom .el-button--primary,
.el-button--primary:hover,
.el-button--primary:focus {
  color: #64bc9c;
  background-color: transparent;
  border-color: transparent;
}
.tableButtom .el-button--primary,
.el-button--primary {
  color: #64bc9c;
  background-color: transparent;
  border-color: transparent;
}
</style>
