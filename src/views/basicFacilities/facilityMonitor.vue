<template>
  <div class="app-container">
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <span style="color:#666666;margin-left:10px;">图表显示</span>
      </el-form-item>
    </el-form>
    <div style="padding: 10px;height: 400px;border:1px solid #E4E4E4;">
      <div
        class="monitorDetailClass"
        ref="monitorDetail"
        style="height: 100%;width:49%;display:inline-block;"
      />
      <div ref="monitorDetail_" style="height: 100%;width:49%;display:inline-block;" />
    </div>
    <!-- 数据列表 -->
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span style="color:#666666">数据列表</span>
      </el-form-item>
    </el-form>
    <!-- 数据显示部分 -->
    <el-table
      @row-click="openDetails"
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
      <el-table-column type="index" align="center" fixed label="序号" :index="indexMethod" width="70"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        :show-overflow-tooltip="true"
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
import echarts from 'echarts'
import liquidfill from 'echarts-liquidfill'
import GeneralOptions from '@/utils/generalOptions'

// import FacilityMonitorForm from './components/facilityMonitorForm.vue'
import facilityMonitorDetail from './components/facilityMonitorDetail.vue'
import monitorDetailOptions from './components/monitorDetail.js'
import monitorDetailOptions_ from './components/monitorDetail_.js'

import Pagination from '@/components/Pagination'
import { getBasicFacilitiesList } from '@/api/backstage.js'
import wsRequest from '@/utils/wsRequest'
import { getStorageMonitor } from '@/api/storage'

export default {
  name: 'FacilityMonitor',
  components: { Pagination, facilityMonitorDetail },
  data() {
    return {
      tableData: [
        { key: '主机名', value: '8447466' },
        { key: 'IP地址', value: '192.168.1.11' },
        { key: '主机上线运行时长', value: '1小时' },
        { key: '操作系统', value: 'Windir' },
        { key: '磁盘', value: '1000Gb' },
        { key: '进程数', value: '无' },
        { key: '内存', value: '1815524kb' },
        { key: 'MAC地址', value: 'FA-16-3E-B0-76-6C' },
        { key: 'IP地址', value: '10.36.28.146' }
      ],
      s_showByRow: true,
      styleObject: {},
      sortOptions: new GeneralOptions().listSorting(),
      dialogVisible: false, // 模态框
      checked: false,
      multipleSelection: [],
      modalOption: {
        show: false,
        data: null
      },
      is_show: true,
      options: [
        {
          value: '选项1',
          label: '鸡西市'
        },
        {
          value: '选项2',
          label: '伊春市'
        },
        {
          value: '选项3',
          label: '上海市'
        },
        {
          value: '选项4',
          label: '铜仁市'
        },
        {
          value: '选项5',
          label: '贺州市'
        },
        {
          value: '选项6',
          label: '北京市'
        },
        {
          value: '选项7',
          label: '西安市'
        },
        {
          value: '选项8',
          label: '长沙市'
        }
      ],
      value: '',
      value1: '',
      value2: '',
      list: [],
      total: 0,
      tableMeta: [
        { key: 'hostname', label: '主机名', width: 70 },
        { key: 'ip', label: '地址', width: 115 },
        { key: 'cpurate', label: 'cpu使用率(%)', width: 113 },
        { key: 'memoryrate', label: '内存使用率(%)' },
        { key: 'mac', label: '服务的mac地址' },
        { key: 'totalmemory', label: '总内存大小(GB)' },
        { key: 'freememory', label: '可用内存(GB)' },
        { key: 'ostype', label: '操作系统类型' },
        { key: 'totaldisk', label: '总磁盘空间(GB)' },
        { key: 'freedisk', label: '可用磁盘空间(GB)' }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        area: undefined,
        startTime: undefined,
        endTime: undefined,
        attr: undefined,
        warning: undefined
      },
      dataValue: []
    }
  },
  computed: {},
  created() {
    this.getList()
    this.styleObject = this.tableStyle
    if (this.showByRow !== undefined) {
      this.s_showByRow = this.showByRow
    }
  },
  methods: {
    openDetails(row) {
      // monitorDetailOptions.series[0].data[0] = (
      //   row.totalmemory - row.freememory
      // ).toFixed(3)
      monitorDetailOptions.series[0].data[0] = (row.totaldisk - row.freedisk).toFixed(3)
      // monitorDetailOptions.series[1].data[0] = row.freememory
      monitorDetailOptions.series[1].data[0] = row.freedisk
      monitorDetailOptions_.series[0].data[0] = row.cpurate / 100
      monitorDetailOptions_.series[1].data[0] = row.memoryrate / 100
      this.$nextTick(() => {
        const monitorDetail = echarts.init(this.$refs.monitorDetail)
        monitorDetail.setOption(monitorDetailOptions)
      })
      this.$nextTick(() => {
        const monitorDetail_ = echarts.init(this.$refs.monitorDetail_)
        monitorDetail_.setOption(monitorDetailOptions_)
      })
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
    handleDownLoad() {},
    handleDetails() {
      this.dialogVisible = true
    },
    handleDelete() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getList()
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    getList() {
      this.listLoading = true
      // 数据列表
      getStorageMonitor().then(response => {
        this.dataValue = JSON.parse(response.data)
        this.dataValue[1].serverData.forEach(item => {
          this.list.push({
            hostname: item.hostname,
            ip: item.ipAddress,
            cpurate: item.cpuUsageRate,
            memoryrate: item.memUsageRate,
            mac: item.mac,
            totalmemory: item.totalmemory,
            freememory: item.freememory,
            ostype: item.ostype,
            totaldisk: item.totaldisk,
            freedisk: item.freedisk
          })
        })
        // monitorDetailOptions.series[0].data[0] = (
        //   this.dataValue[1].serverData[0].totalmemory -
        //   this.dataValue[1].serverData[0].freememory
        // ).toFixed(3)
        monitorDetailOptions.series[0].data[0] = (
          this.dataValue[1].serverData[0].totaldisk -
          this.dataValue[1].serverData[0].freedisk
        ).toFixed(3)
        // monitorDetailOptions.series[1].data[0] = this.dataValue[1].serverData[0].freememory
        monitorDetailOptions.series[1].data[0] = this.dataValue[1].serverData[0].freedisk
        monitorDetailOptions_.series[0].data[0] =
          this.dataValue[1].serverData[0].cpuUsageRate / 100
        monitorDetailOptions_.series[1].data[0] =
          this.dataValue[1].serverData[0].memUsageRate / 100
        this.$nextTick(() => {
          const monitorDetail_ = echarts.init(this.$refs.monitorDetail_)
          monitorDetail_.setOption(monitorDetailOptions_)
        })
        this.$nextTick(() => {
          const monitorDetail = echarts.init(this.$refs.monitorDetail)
          monitorDetail.setOption(monitorDetailOptions)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mailTable {
  width: 100%;
  padding-bottom: 40px;
}
tr td {
  border: 1px solid #e6eaee;
  width: 150px;
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
  color: #666666;
  font-size: 14px;
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
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
