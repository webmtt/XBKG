<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <el-form ref="filter">
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
      <el-form-item class="searchContent">
        <el-form v-show="is_show == true">
          <el-form-item>
            <span>用户名：</span>
            <el-input style="width:170px;" placeholder="用户名" v-model="listQuery.userName" @keyup.enter.native="handleFilter"></el-input>
          </el-form-item>
          <el-form-item>
            <span>时间：</span>
              <el-date-picker
                v-model="listQuery.startTime"
                type="datetime"
                placeholder="选择开始日期"
                @change="ensureStartTime"
                :picker-options="starttime"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
              -
              <el-date-picker
                v-model="listQuery.endTime"
                type="datetime"
                placeholder="选择结束日期"
                @change="ensureEndTime"
                :picker-options="endTime"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
          </el-form-item>
        </el-form>
      </el-form-item>
      
    </el-form>
    <!-- 数据列表 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span style="color:#666666">日志列表</span>
      </el-form-item>
      <el-form-item style="float: right;">
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
        <!-- <el-select
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
        </el-select> -->
      </el-form-item>
    </el-form>
    <!-- 数据显示部分 -->
    <el-table
      :cell-style="columnStyle"
      ref="multipleTable"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
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
    <pagination
      v-show="total > 0"
      style="margin-top: 30px;"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="paginationChange"
    />
    <!-- 编辑/新增数据采集的模态框 -->
    <data-collection-submit class="inPageModal" @handleSucc="getList" :modalData="modalOption"></data-collection-submit>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import generalOptions from '@/utils/generalOptions'
import userManagementSubmit from './components/addUpdateUserManagement'
import dataCollectionSubmit from '../storageConfig/components/addUpdateLifecycleManagement'
import { getlogList } from '@/api/userManage'

export default {
  name: 'DataCollectionConfig',
  components: { Pagination,dataCollectionSubmit },
  data() {
    const day1 = new Date()
    day1.setTime(day1.getTime())
    this.beginTimeInit =
      day1.getFullYear() +
      '-' +
      (day1.getMonth() + 1) +
      '-' +
      day1.getDate() +
      ' 00:00:00'
    this.endTimeInit =
      day1.getFullYear() +
      '-' +
      (day1.getMonth() + 1) +
      '-' +
      day1.getDate() +
      ' 23:59:59'
    return {
      rotate: false,
      beginTimeInit: '',
      endTimeInit: '',
      numberOptions: new generalOptions().numberOfPerPage(),
      sortOptions: new generalOptions().listSorting(),
      userName: '',
      checked: false,
      multipleSelection: [],
      modalOption: {
        flag: null,
        show: false,
        data: null
      },
      is_show: true,
      value: '',
      value1: '',
      value2: '',
      list: [],
      total: 0,
      tableMeta: [
        { key: 'username', label: '用户名' },
        { key: 'ip', label: 'IP' },
        {key: 'operate', label: '登录状态'},
        { key: 'operatetime', label: '创建时间' }
      ],
      listQuery: {
        limit: 10,
        sort: '+id',
        pageSize:10,
        ip:'',
        userName:'',
        name:'',
        requestMethod:'',
        requestParams:'',
        uri:'',
        description:'',
        createTime:'',
        updateTime:'',
        startTime:this.beginTimeInit,
        endTime:this.endTimeInit,
        pageNum:1
      },
      starttime: {
        disabledDate: time => {
          if (this.listQuery.endTime) {
            return (
              time.getTime() > new Date(this.listQuery.endTime).getTime()
            )
          } else {
            // 不能大于当前日期
            return time.getTime() > Date.now()
          }
        }
      }, 
      endTime: {
        disabledDate: time => {
          if (this.listQuery.startTime) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() < new Date(this.listQuery.startTime).getTime() - 8.64e7 // 加- 8.64e7则表示包当天
            )
          } else {
            return time.getTime() < Date.now()
          }
        }
      },
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
    // 修改列表特殊几行颜色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      // if (
      //   columnIndex == 4 ||
      //   columnIndex == 6 ||
      //   columnIndex == 7 ||
      //   columnIndex == 8
      // ) {
      //   return 'color:#64bc9c;'
      // }
    },
    // 数据详情
    handleDetails(row) {
      getCollectionDetails().then(response => {})
    },
    /**
     * 打开编辑/新增模态框
     * @method opendModal
     * @returns {undefined}
     */
    openModal(flag, rowParam) {
      this.modalOption = { show: true, data: rowParam, flag: flag }
    },
    paginationChange() {
      this.checked = false
      this.getList()
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.page = 1
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    ensureStartTime(val){
      this.listQuery.startTime = val +' 00:00:00'
    },
    ensureEndTime(val){
      this.listQuery.endTime = val +' 23:59:59'
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除吗？</p>',
        loading: true,
        onOk: () => {
          getCollectionDelete({ id: row.id })
            .then(res => {
              this.$Modal.remove()
              this.$Message.success('删除成功')
              this.getList()
            })
            .catch(err => {
              this.$Modal.remove()
            })
        },
        onCancel: () => {}
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    getList() {
      this.listLoading = true
      getlogList(this.listQuery).then(response => {
        this.list = response.data.list
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
.searchContent {
  border: 1px solid #e4e4e4;
}
.searchContent form.el-form {
  display: flex;
  margin: 10px 10px 10px 30px;
}
.searchContent .el-form-item.el-form-item--medium:nth-child(2) {
  margin-left: 30px;
}
.searchContent div {
  display: inline-block;
}
.handleLink {
  padding: 0 5px;
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
.demo-form-inline {
  padding-left: 15px;
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
  border-bottom: none !important;
}
.filter-item {
  width: 150px;
}
</style>
