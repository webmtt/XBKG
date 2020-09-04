<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span style="color:#666666">数据列表</span>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button @click="openModal('insert')">添加</el-button>
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
      <el-table-column type="selection" align="center" width="55"></el-table-column>
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
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row }" class="tableButtom">
          <el-button
            type="warning"
            size="mini"
            @click="openModal('update', row)"
            style="margin-left: 0"
          >编辑</el-button>
          <el-button type="danger" size="mini" style="margin-left: 0" @click="handleDelete(row)">删除</el-button>
          <el-button
            v-if="row.state===''"
            type="success"
            size="mini"
            style="margin-left: 0"
            @click="addjobEvent(row)"
          >启动</el-button>
          <el-button
            type="success"
            size="mini"
            v-if="row.state==='ACQUIRED'||row.state==='WAITING'"
            style="margin-left: 0"
            @click="resumeEvent(row)"
          >{{'暂停'}}</el-button>
          <el-button
            type="info"
            size="mini"
            v-if="row.state==='PAUSED'"
            style="margin-left: 0"
            @click="resumeEvent(row)"
          >{{'恢复'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form class="operation">
      <el-form-item>
        <el-checkbox v-model="checked" @change="checkAll">全选</el-checkbox>
        <el-button
          :disabled="!multipleSelection.length"
          type="danger"
          @click="batchDelete"
          size="mini"
        >批量删除</el-button>
      </el-form-item>
    </el-form>
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
    <el-dialog title="数据详情" :visible.sync="is_details" width="37%">
      <el-table :data="details" border style="width: 100%;height:400px;overflow:auto;">
        <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
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
import dataCollectionSubmit from './components/addUpdateFlowEngin'
import {
  getFlowTabList,
  deleteFlowTab,
  addjob,
  resume,
  pause,
  remove,
} from '@/api/storage'

export default {
  name: 'DataCollectionConfig',
  components: { Pagination, dataCollectionSubmit },
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
        { key: 'pluginsNames', label: '插件名称', width: 300 },
        { key: 'flowInparam', label: '初始参数', width: 300 },
        { key: 'cycle', label: '执行策略cron表达式' },
      ],
      listQuery: {
        page: 1,
        limit: 10,
        obj: {
          id: '',
          name: '',
          inParam: '',
          outParam: '',
          path: '',
          addtime: '',
          description: '',
        },
      },
      ids: [],
      flowName: []
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
    /**
     * 监听全选操作
     * @method checkAll
     */
    checkAll() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    resumeEvent(row) {
      if (row.state === 'PAUSED') {
        resume({ flowName: row.flowName }).then((res) => {
          this.getList()
          this.$Message.success('恢复成功')
        })
      } else if (row.state === 'ACQUIRED' || row.state === 'WAITING') {
        pause({ flowName: row.flowName }).then((res) => {
          this.getList()
          this.$Message.success('暂停成功')
        })
      }
    },
    addjobEvent(row) {
      addjob({
        taskId: row.id,
        cronExpression: row.cycle,
        flowName: row.flowName,
      }).then((res) => {
        this.$Message.success('启动成功')
        this.getList()
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
      console.log(this.multipleSelection)
    },
    /**
     * 批量删除逻辑;
     * @method batchDelete
     */
    batchDelete() {
      this.ids = []
      this.flowName = []
      this.multipleSelection.map((item) => {
        this.ids.push(item.id)
        this.flowName.push(item.flowName)
      })
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除吗？</p>',
        loading: true,
        onOk: () => {
          deleteFlowTab(this.ids)
            .then((res) => {
              this.$Modal.remove()
              this.$Message.success('删除成功')
              remove(this.flowName).then((res) => {
                this.getList()
              })
            })
            .catch((err) => {
              this.$Modal.remove()
            })
        },
        onCancel: () => {},
      })
      this.checked = false
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除吗？</p>',
        loading: true,
        onOk: () => {
          deleteFlowTab([row.id])
            .then((res) => {
              this.$Modal.remove()
              this.$Message.success('删除成功')
              remove([row.flowName]).then((res) => {
                this.getList()
              })
            })
            .catch((err) => {
              this.$Modal.remove()
            })
        },
        onCancel: () => {},
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    getList() {
      this.listLoading = true
      getFlowTabList(this.listQuery).then((response) => {
        if (response.data.list) {
          response.data.list.map((item) => {
            item.pluginsNames = item.pluginsNames.toString()
          })
          this.list = response.data.list
          this.total = response.data.total
        }else{
          this.list = []
          this.total = 0
        }
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
.operation {
  display: flex;
  padding: 15px;
  border: 1px solid #e4e4e4;
  margin-top: 20px;
}
.operation .el-form-item.el-form-item--medium:nth-child(1) {
  width: 500px;
}
</style>
