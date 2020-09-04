<template>
  <div class="app-container">
    <el-form
      style="margin-top:25px;padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <span style="color:#666666;margin-left:10px;">Hbase监控</span>
      </el-form-item>
    </el-form>
    <div style="border:1px solid #E4E4E4; padding: 10px 10px 5px 15px;">
      <el-row>
        <el-col :span="11">
          <div id="hbaseMain" style="height:400px;"></div>
        </el-col>
        <el-col :span="1">
          <div style="height:400px;"></div>
        </el-col>
        <el-col :span="11">
          <div id="hbaseMainPie" style="height:400px;"></div>
        </el-col>
        <el-col :span="1">
          <el-button type="success" size="mini" @click="goBackHbase">库统计</el-button>
        </el-col>
      </el-row>
    </div>
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;margin-top:20px;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <span style="color:#666666;margin-left:10px;">Hbase监控列表</span>
      </el-form-item>
    </el-form>
    <div style="border:1px solid #E4E4E4;padding:30px;">
      <!--统计表格-->
      <el-table
        ref="multipleTable"
        class="tableData"
        :data="listHbase"
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableMetaHbase"
          :key="index"
          align="center"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }" class="tableButtom">
            <el-button type="info" size="mini" @click="setDiagramHbase(row)">表统计</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getStorageMonitor } from '@/api/storage'

export default {
  data() {
    return {
      listHbase: [],
      database: '',
      searchtime: '',
      bits: '',
      bytesOut: '',
      numRequests: '',
      bytesIn: '',
      deletes: '',
      query: '',
      update: '',
      insert: '',
      virtual: '',
      supported: '',
      resident: '',
      collections: '',
      datasize: '',
      storagesize: '',
      indexSize: '',
      is_details: false,
      storageSize: [],
      dataSize: [],
      HbasePie: '',
      HbaseBar: '',
      nameSpaceStorageSize: [],
      nameSpaceFileSize: [],
      namespace: [],
      barData: [],
      pieData: [],
      barDataHbase: [],
      pieDataHbase: [],
      n: '',
      t: '',
      pieList: '',
      tableMeta: [
        { key: 'database', label: '数据库名称' },
        { key: 'collections', label: '集合数据' },
        { key: 'host', label: 'host' },
        { key: 'supported', label: '支持系统扩展内存' },
        { key: 'dataSize', label: '文档总数' }
      ],
      tableMetaHbase: [
        { key: 'namespace', label: '表空间名称 ' },
        { key: 'nameSpaceFileSize', label: '表空间存储文件大小(GB)' },
        { key: 'nameSpaceStorageSize', label: '表空间存储大小(GB)' },
        { key: 'sonInfoLength', label: '表集合数' }
      ],
      barList: '',
      list: [],
      chart: null,
      chartPie: null,
      HbaseChart: null,
      HbaseChartPie: null,
      checked: false,
      value: '',
      total: 0,
      MongoDBdata: '',
      Hbasedata: '',
      listQuery: {
        page: 4,
        limit: 20,
        type: 1,
        begintime: '2020-02-08',
        endtime: '2390-12-12'
      },
      echartsQuery: {
        begintime: '2020-02-08',
        type: 1
      },
      isDataChange: false,
      MongoDBTitle: '库',
      HbaseTitle: '库',
      MongoDBSubtext: '',
      HbaseSubtext: ''
    }
  },
  computed: {},
  mounted() {
    this.initHbaseBarChart()
  },
  created() {
    this.getList()
  },
  methods: {
    goBackHbase() {
      this.HbaseTitle = '库'
      this.HbaseSubtext = ''
      this.namespace = []
      this.pieData = []
      this.nameSpaceStorageSize = []
      this.nameSpaceFileSize = []
      this.Hbasedata.hbaseData.map(item => {
        // 分库容量大小柱状图数据
        this.namespace.push(item.namespace)
        this.nameSpaceStorageSize.push(parseFloat(item.nameSpaceStorageSize))
        this.nameSpaceFileSize.push(parseFloat(item.nameSpaceFileSize))
        this.pieData.push({
          value: item.namspaceTotal,
          name: item.namespace
        })
        this.pieData.forEach(ix => {
          if (ix.name === 'AUTO') {
            ix.value = ''
            ix.name = ''
          }
        })
        this.initHbaseBarChart()
        this.initPieChart()
      })
    },
    // Hbase 监控集合图表变化
    setDiagramHbase(row) {
      // debugger
      this.HbaseTitle = '表'
      this.HbaseSubtext = '( ' + row.namespace + ' )'
      this.namespace = []
      this.pieData = []
      this.nameSpaceStorageSize = []
      this.nameSpaceFileSize = []
      const m = this.Hbasedata.hbaseData.filter(
        item => row.namespace === item.namespace
      )
      m[0].sonInfo.forEach(item => {
        this.namespace.push(item.tableName)
        this.nameSpaceStorageSize.push(parseFloat(item.storageSize))
        this.nameSpaceFileSize.push(parseFloat(item.fileSize))
        this.pieData.push({
          value: item.fileTotal,
          name: item.tableName
        })
        this.initHbaseBarChart()
        this.initPieChart()
      })
    },
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    // Hbase监控柱状图
    initHbaseBarChart() {
      this.HbaseChart = echarts.init(document.getElementById('hbaseMain'))
      this.HbaseBar = {
        title: {
          text: this.HbaseTitle + '容量大小',
          subtext: this.HbaseSubtext
        },
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['存储大小(GB)', '数据大小(GB)']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.namespace
        },
        series: [
          {
            name: '存储大小(GB)',
            type: 'bar',
            stack: '总量',
            label: {
              position: 'insideRight'
            },
            data: this.nameSpaceStorageSize
          },
          {
            name: '数据大小(GB)',
            type: 'bar',
            stack: '总量',
            label: {
              position: 'insideRight'
            },
            data: this.nameSpaceFileSize
          }
        ]
      }
      this.HbaseChart.setOption(this.HbaseBar)
    },
    initPieChart() {
      this.chartPie = echarts.init(document.getElementById('hbaseMainPie'))
      this.t = {
        title: {
          text: this.HbaseTitle + '数量统计',
          subtext: this.HbaseSubtext,
          left: 'center'
        },
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} 个 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.barData
        },
        series: [
          {
            name: '值',
            type: 'pie',
            radius: '75%',
            center: ['50%', '60%'],
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chartPie.setOption(this.t)
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    // 获取数据列表
    getList() {
      // debugger
      this.listLoading = true
      getStorageMonitor().then(response => {
        const data = JSON.parse(response.data)
        // Hbase 数据
        this.Hbasedata = data[2]
        this.Hbasedata.hbaseData = this.Hbasedata.hbaseData.filter(item=>item.namespace !== "hbase")
        this.Hbasedata.hbaseData.map(item => {
          // 列表数据
          this.listHbase.push({
            nameSpaceStorageSize: item.nameSpaceStorageSize,
            sonInfoLength: item.sonInfo.length,
            namespace: item.namespace,
            nameSpaceFileSize: item.nameSpaceFileSize
          })
          // 分库容量大小柱状图数据
          this.namespace.push(item.namespace)
          this.nameSpaceStorageSize.push(parseFloat(item.nameSpaceStorageSize))
          this.nameSpaceFileSize.push(parseFloat(item.nameSpaceFileSize))
          // 各库总量统计饼状图数据
          this.pieData.push({
            value: item.namspaceTotal,
            name: item.namespace
          })
          this.pieData.forEach(ix => {
            if (ix.name === 'AUTO') {
              ix.value = ''
              ix.name = ''
            }
          })
          this.initHbaseBarChart()
          this.initPieChart()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.elDialog form.el-form {
  width: 250px;
  display: inline-block;
}
.elDialog .el-form-item.el-form-item--medium {
  padding: 5px 0px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
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
</style>
