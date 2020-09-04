<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span style="color:#666666">数据列表</span>
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
      <!-- <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column> -->
      <el-table-column
        type="index"
        align="center"
        label="序号"
        :index="indexMethod"
        width="70"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
      <el-table-column
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }" class="tableButtom">
          <el-button
            type="success"
            size="mini"
            @click="openModal('details', row)"
            >详情</el-button
          >
          <el-button
            :disabled="
              row.structuraltype === '1' ||
                row.datastorage === '2' ||
                row.datastorage === ''
            "
            type="warning"
            size="mini"
            @click="openModal('update', row)"
            style="margin-left: 0"
            >编辑</el-button
          >
        </template>
      </el-table-column>
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
    <data-collection-submit
      class="inPageModal"
      @handleSucc="getList"
      :modalData="modalOption"
    ></data-collection-submit>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dataCollectionSubmit from './components/addUpdateLifecycleManagement'
import { getCollectionList, getCollectionDetails } from '@/api/collection'

export default {
  name: 'DataCollectionConfig',
  components: { Pagination, dataCollectionSubmit },
  data() {
    return {
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
        { key: 'dataclassification', label: '数据分类' },
        { key: 'datatype', label: '数据类型' },
        { key: 'dataname', label: '数据名称' },
        { key: 'updateway', label: '更新方式' },
        { key: 'lifecycle', label: '存储周期(天)' }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        area: undefined,
        startTime: undefined,
        endTime: undefined,
        attr: undefined,
        warning: undefined,
        dataType: 'msg'
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
      // debugger
      this.listLoading = true
      getCollectionList(this.listQuery).then(response => {
        this.list = response.data.list
        this.list.forEach(item=>{
          item.updateway === "0" ? item.updateway = '手动' : item.updateway = '自动'
        })
        this.total = response.data.total
      })
    }
  }
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
