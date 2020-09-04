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
          <el-button @click="handleFilter">查询结果
            <i
              @click="renovate"
              style="    position: absolute;right:5x;"
              :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
            ></i>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-form class="searchContent" v-show="is_show == true">
      <el-form-item>
        <span>数据类型：</span>
        <el-select
          @change="dataClassifyEvent"
          style="width: 150px;"
          v-model="dataClassify"
          placeholder="数据类型"
        >
          <el-option
            v-for="item in dataClassifyoptions"
            :key="item.typecode"
            :label="item.typename"
            :value="item.typecode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 6px;">
        <el-select
          style="width: 200px;"
          v-model="listQuery.type"
          placeholder="数据类型"
        >
          <el-option
            v-for="item in dataTypeoptions"
            :key="item.datatypecode"
            :label="item.datatypename"
            :value="item.datatypecode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间：" style="min-width:490px;">
        <el-date-picker
          style="width:380px"
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
        <span>状态：</span>
        <el-select
          style="width: 150px;"
          v-model="listQuery.status"
          placeholder="状态"
        >
          <el-option
            v-for="item in statusSelections"
            :key="item.typecode"
            :label="item.typename"
            :value="item.typecode"
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
        <el-select
          v-model="listQuery.sort"
          class="filter-item"
          placeholder="排序方式"
          @change="handleFilter"
        >
          <el-option
            v-for="item in sortOptions"
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
      <el-table-column
        type="index"
        align="center"
        label="序号"
        :index="indexMethod"
        width="70"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
    </el-table>
    <el-form class="operation">
      <el-form-item style="width: 100%;">
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
import {
  getCollectLogList,
  getDataTypes,
  getDataTypeClassify
} from '@/api/collection'

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
      dataClassify: 1,
      rotate: false,
      dataTypeoptions: [],
      dataClassifyoptions: [],
      sortOptions: new GeneralOptions().listSorting_(),
      timeScope: [],
      format: 'xls',
      checked: false,
      numberOptions: new GeneralOptions().numberOfPerPage(),
      is_show: true,
      value: '',
      list: [],
      total: 0,
      statusSelections: [
        {
          typecode: 0,
          typename: '已完成'
        },
        {
          typecode: 1,
          typename: '未完成'
        },
      ],
      tableMeta: [
        { key: 'datatype', label: '数据类型' },
        { key: 'collectiontime', label: '采集时间', width: 200 },
        { key: 'ip', label: 'IP', width: 160 },
        { key: 'fileName', label: '文件名称', width: 400 },
        { key: 'formatLength', label: '文件大小' },
        { key: 'steps', label: '步骤' },
        { key: 'statusName', label: '状态' }
      ],
      listQuery: {
        currentPage: 1,
        limit: 10,
        sort: 'desc',
        type: 'cac',
        startTime: this.beginTime,
        endTime: this.endTime,
        status: 0
      }
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
    }
  },

  created() {
    this.getList()
    getDataTypes({ type: 1 }).then(response => {
      this.dataTypeoptions = response.data
    })
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    dataClassifyEvent() {
      this.listQuery.type = ''
      getDataTypes({ type: this.dataClassify }).then(response => {
        this.dataTypeoptions = response.data
        this.listQuery.type = this.dataTypeoptions[0].datatypecode
      })
    },
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    timeChange() {
      if (this.timeScope) {
        this.listQuery.startTime = this.timeScope[0]
        this.listQuery.endTime = this.timeScope[1]
      }
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.currentPage = 1
      this.getList()
    },
    indexMethod(index) {
      return (this.listQuery.currentPage - 1) * this.listQuery.limit + 1 + index
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      getDataTypeClassify().then(response => {
        this.dataClassifyoptions = response.data
      })
      this.timeScope = [this.listQuery.startTime, this.listQuery.endTime]
      getCollectLogList(this.listQuery).then(response => {
        this.list = response.data.list
        // 列表步骤翻译
        if (
          this.dataClassify === 1 ||
          this.dataClassify === 5 ||
          this.dataClassify === 7
        ) {
          this.list.forEach(ix => {
            ix.steps === 1
              ? (ix.steps = '数据采集')
              : ix.steps === 2
              ? (ix.steps = '数据解析')
              : (ix.steps = '数据入库')
          })
        } else {
          this.list.forEach(ix => {
            ix.steps === 1
              ? (ix.steps = '数据采集')
              : ix.steps === 2
              ? (ix.steps = '数据入库MongoDB')
              : (ix.steps = '数据入库HBase')
          })
        }
        this.total = response.data.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aa {
  transition: all 1s;
}
.go {
  transform: rotate(360deg);
  transition: all 1s;
}
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
.operation {
  display: flex;
  padding: 15px;
  border: 1px solid #e4e4e4;
  margin-top: 20px;
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
