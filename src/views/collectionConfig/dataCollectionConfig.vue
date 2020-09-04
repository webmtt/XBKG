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
        :show-overflow-tooltip="true"
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
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }" class="tableButtom">
          <!-- <el-button type="warning" size="mini" @click="handleDetails(row)">详情</el-button> -->
          <el-button
            type="warning"
            size="mini"
            @click="openModal('update', row)"
            >编辑</el-button
          >
          <!-- <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button> -->
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
      :list="list"
      class="inPageModal"
      @handleSucc="getList"
      :modalData="modalOption"
    ></data-collection-submit>
    <el-dialog title="数据详情" :visible.sync="is_details" width="37%">
      <el-table
        :data="details"
        border
        style="width: 100%;height:400px;overflow:auto;"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
          :index="indexMethod"
          width="70"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in tableDetails"
          :key="index"
          align="center"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dataCollectionSubmit from './components/addUpdateDataCollection'
import {
  getCollectionList,
  getCollectionDelete,
  getCollectionDetails
} from '@/api/collection'
import Options from './options'
export default {
  name: 'DataCollectionConfig',
  components: { Pagination, dataCollectionSubmit },
  data() {
    return {
      is_details: false,
      tableDetails: [
        { key: 'name', label: '名称' },
        { key: 'value', label: '值' }
      ],
      details: [],
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
        { key: 'sourceftpurl', label: '数据来源' },
        { key: 'datastorage', label: '目标库' },
        { key: 'filterrules', label: '过滤规则' },
        { key: 'checkrules', label: '校验规则' }
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
    // 数据详情
    handleDetails() {
      this.is_details = !this.is_details
      getCollectionDetails().then(response => {
        this.details = Object.keys(response)
          .filter(key => key !== 'sourcedatabaseurl')
          .map(key => ({
            name: key,
            value: response[key]
          }))
        for (let i = 0; i < Options.optionsCollect.length; i++) {
          for (let j = 0; j < this.details.length; j++) {
            if (this.details[j].name === Options.optionsCollect[i].value) {
              this.details[j].name = Options.optionsCollect[i]['label']
            }
          }
        }
      })
    },
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
      getCollectionList(this.listQuery).then(response => {
        this.list = response.data.list
        this.list.forEach(item => {
          if (item.isFTP === '3') {
            item.sourceftpurl = item.socketip
          }
          item.datastorage === 1
            ? (item.datastorage = 'MongoDB')
            : item.datastorage === 2
            ? (item.datastorage = 'HBase')
            : (item.datastorage = 'MongoDB/HBase')
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
