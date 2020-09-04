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
        <span>调用者：</span>
        <el-select clearable style="width: 100px;" v-model="listQuery.userName" placeholder="调用者">
          <el-option
            v-for="item in operatorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <span>接口名称：</span>
        <el-select clearable style="width: 100px;" v-model="listQuery.description" placeholder="接口名称">
          <el-option
            v-for="item in interfaceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间：" style="min-width:437px;">
        <el-date-picker
          style="width:355px"
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
    </el-form>
    <!-- 数据列表 -->
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span>数据列表</span>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.pageSize"
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
      <el-form-item style="width: 100%;">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
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
import { getServerList, getInterface,getUsername } from '@/api/userManage'

export default {
  components: { Pagination },
  props: {
    fatherHeight: {
      type: Number,
      default: ''
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
      rotate: false,
      operatorOptions: [],
      interfaceOptions: [],
      timeScope: [this.beginTime,this.endTime],
      format: 'xls',
      checked: false,
      numberOptions: new GeneralOptions().numberOfPerPage(),
      is_show: true,
      value: '',
      list: [],
      total: 0,
      tableMeta: [
        { key: 'description', label: '服务接口名称' },
        { key: 'userName', label: '操作者' },
        { key: 'updateTime', label: '调用日期' },
        // { key: 'downloadSize', label: '下载量' }
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        startTime: this.beginTime,
        endTime: this.endTime,
        description: '',
        userName: ''
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
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    timeChange() {
      this.listQuery.startTime = this.timeScope ? this.timeScope[0] : null
      this.listQuery.endTime = this.timeScope ? this.timeScope[1] : null
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.pageNum = 1
      this.getList()
    },
    indexMethod(index) {
      return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + 1 + index
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      getServerList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      })
      this.interfaceOptions = []
      this.operatorOptions = []
      getInterface().then(response => {
        response.data.forEach(item=>{
          this.interfaceOptions.push({
            value:item,
            label:item
          })
        })
      })
      getUsername().then(response => {
        response.data.forEach(item=>{
          this.operatorOptions.push({
            value:item,
            label:item
          })
        })
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
.operation {
  display: flex;
  padding: 15px;
  border: 1px solid #e4e4e4;
  margin-top: 20px;
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
.aa {
  transition: all 1s;
}
.go {
  transform: rotate(360deg);
  transition: all 1s;
}
</style>
