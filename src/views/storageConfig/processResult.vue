<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span style="color:#666666">数据列表</span>
      </el-form-item>
      <el-form-item style="float: right;">
        <!-- <el-button @click="openModal('insert')">添加</el-button> -->
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
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
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
    <pagination
      v-show="total > 0"
      style="margin-top: 30px;"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="paginationChange"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getFlowStatusTabList, deleteFlowTab } from '@/api/storage'

export default {
  name: 'DataCollectionConfig',
  components: { Pagination},
  data() {
    return {
      details: [],
      is_details: false,
      tableDetails: [
        { key: 'name', label: '名称' },
        { key: 'value', label: '值' },
      ],
      checked: false,
      multipleSelection: [],
      modalOption: {
        flag: null,
        show: false,
        data: null,
      },
      is_show: true,
      value: '',
      value1: '',
      value2: '',
      list: [],
      total: 0,
      tableMeta: [
        { key: 'flowName', label: '流程名称', width: 300 },
        { key: 'beginTime', label: '开始时间', width: 300 },
        { key: 'endTime', label: '结束时间', width: 300 },
        { key: 'status', label: '状态' }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        obj: {
          id: '',
          beginTime: '',
          flowId: '',
          status: '',
          endTime: ''
        }
      },
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
    },
  },
  created() {
    this.getList()
  },
  methods: {
    // 修改列表特殊几行颜色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex == 4 ||
        columnIndex == 6 ||
        columnIndex == 7 ||
        columnIndex == 8
      ) {
        return 'color:#64bc9c;'
      }
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
      this.listQuery.page = 1
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    getList() {
      this.listLoading = true
      getFlowStatusTabList(this.listQuery).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
  },
}
</script>

<style lang="scss" scoped>
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
</style>
