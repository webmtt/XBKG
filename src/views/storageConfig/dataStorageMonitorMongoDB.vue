<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <span style="color:#666666;margin-left:10px;">MongoDB监控</span>
      </el-form-item>
    </el-form>
    <div style="border:1px solid #E4E4E4; padding: 10px 10px 5px 15px;">
      <el-row>
        <el-col :span="11">
          <div id="main" style="height:400px;"></div>
        </el-col>
        <el-col :span="1">
          <div style="height:400px;"></div>
        </el-col>
        <el-col :span="11">
          <div id="mainPie" style="height:400px;"></div>
        </el-col>
        <el-col :span="1">
          <el-button type="success" size="mini" @click="goBackMogoDB">
            库统计
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;margin-top:20px;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <span style="color:#666666;margin-left:10px;">MongoDB监控列表</span>
      </el-form-item>
    </el-form>
    <div style="border:1px solid #E4E4E4;padding:30px;">
      <!--统计表格-->
      <el-table
        ref="multipleTable"
        class="tableData"
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
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }" class="tableButtom">
            <el-button type="warning" size="mini" @click="handleDetails(row)">
              详情
            </el-button>
            <el-button type="info" size="mini" @click="setDiagram(row)">
              表统计
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="elDialogMongoDB"
      title="详情"
      :visible.sync="is_details"
      width="50%"
    >
      <div>基本信息</div>
      <hr />
      <el-form label-width="124px">
        <el-form-item label="库名：">
          <el-input v-model="database" disabled>{{ database }}</el-input>
        </el-form-item>
        <el-form-item label="所有数据总大小：">
          <el-input v-model="datasize" disabled>{{ datasize }}</el-input>
        </el-form-item>
        <el-form-item label="占用磁盘：">
          <el-input v-model="storagesize" disabled>{{ storagesize }}</el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="124px">
        <el-form-item label="集合数：">
          <el-input v-model="collections" disabled>{{ collections }}</el-input>
        </el-form-item>
        <el-form-item label="数据行数：">
          <el-input v-model="indexSize" disabled>{{ indexSize }}</el-input>
        </el-form-item>
      </el-form>
      <div>内存信息</div>
      <hr />
      <el-form label-width="124px">
        <el-form-item label="实例位数：">
          <el-input v-model="bits" disabled>{{ bits }}</el-input>
        </el-form-item>
        <el-form-item label="虚拟内存：">
          <el-input v-model="virtual" disabled>{{ virtual }}</el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="124px">
        <el-form-item label="物理内存：">
          <el-input v-model="resident" disabled>{{ resident }}</el-input>
        </el-form-item>
        <el-form-item label="可扩展：">
          <el-input v-model="supported" disabled>{{ supported }}</el-input>
        </el-form-item>
      </el-form>
      <div>操作计数</div>
      <hr />
      <el-form label-width="124px">
        <el-form-item label="插入：">
          <el-input v-model="insert" disabled>{{ insert }}</el-input>
        </el-form-item>
        <el-form-item label="更新：">
          <el-input v-model="update" disabled>{{ update }}</el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="124px">
        <el-form-item label="查询：">
          <el-input v-model="query" disabled>{{ query }}</el-input>
        </el-form-item>
        <el-form-item label="删除：">
          <el-input v-model="deletes" disabled>{{ deletes }}</el-input>
        </el-form-item>
      </el-form>
      <div>网络</div>
      <hr />
      <el-form label-width="124px">
        <el-form-item label="输入字节数：">
          <el-input v-model="bytesIn" disabled>{{ bytesIn }}</el-input>
        </el-form-item>
        <el-form-item label="请求次数：">
          <el-input v-model="numRequests" disabled>{{ numRequests }}</el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="124px">
        <el-form-item label="输出字节数：">
          <el-input v-model="bytesOut" disabled>{{ bytesOut }}</el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="is_details = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'
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
        { key: 'nameSpaceFileSize', label: '表空间存储文件大小' },
        { key: 'nameSpaceStorageSize', label: '表空间存储大小' },
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
      MongoDBTitle: '各库',
      MongoDBTitlePie: '各库',
      HbaseTitle: '命名空间',
      MongoDBSubtext: '',
      HbaseSubtext: ''
    }
  },
  computed: {},
  mounted() {
    this.initBarChart()
    this.initPieChart()
  },
  created() {
    this.getList()
  },
  methods: {
    goBackMogoDB() {
      this.MongoDBTitle = '库'
      this.MongoDBTitlePie = '各库'
      this.MongoDBSubtext = ''
      this.barData = []
      this.storageSize = []
      this.dataSize = []
      this.pieData = []
      this.MongoDBdata.mongoData.map(item => {
        // 分库容量大小柱状图数据
        this.barData.push(item.mongoInfo.db)
        this.storageSize.push(parseFloat(item.mongoInfo.storageSize))
        this.dataSize.push(parseFloat(item.mongoInfo.dataSize))
        // 各库总量统计饼状图数据
        this.pieData.push({
          value: item.mongoInfo.objects,
          name: item.mongoInfo.db
        })
        this.pieData.forEach(ix => {
          if (ix.name === 'AUTO') {
            ix.value = ''
            ix.name = ''
          }
        })
        this.initBarChart()
        this.initPieChart()
      })
    },
    // MongoDB 监控集合图表变化
    setDiagram(row) {
      this.MongoDBTitle = '表'
      this.MongoDBTitlePie = '表'
      this.MongoDBSubtext = '( ' + row.database + ' )'
      // debugger
      this.pieData = []
      this.barData = []
      this.dataSize = []
      this.storageSize = []
      var m = this.MongoDBdata.mongoData.filter(
        item => row.database === item.mongoInfo.db
      )
      const w = m[0].baseCollections.filter(ix=>ix.collection !== "msgCountStatisticalVO")
      w.forEach(item => {
        this.barData.push(item.collection)
        this.storageSize.push(parseFloat(item.storageSize))
        this.dataSize.push(parseFloat(item.dataSize))
        this.pieData.push({
          value: item.objects,
          name: item.collection
        })
      })
      this.initBarChart()
      this.initPieChart()
    },
    // MongoDB 监控详情
    handleDetails(row) {
      this.is_details = !this.is_details
      const t = this.MongoDBdata.mongoData.filter(
        item => row.database === item.mongoInfo.db
      )
      this.database = t[0].mongoInfo.db
      this.collections = t[0].mongoInfo.collections
      this.datasize = t[0].mongoInfo.dataSize
      this.storagesize = t[0].mongoInfo.storageSize
      this.indexSize = t[0].mongoInfo.indexSize
      this.searchtime = this.MongoDBdata.searchtime
      // this.searchtime = moment(this.searchtime, 'YYYYMMDD').format(
      //   'YYYY-MM-DD hh:mm:ss'
      // )
      this.bits = t[0].mem.bits
      this.insert = t[0].opcounters.insert
      this.bytesIn = t[0].network.bytesIn + '个'
      this.numRequests = t[0].network.numRequests
      this.bytesOut = t[0].network.bytesOut + '个'
      this.deletes = t[0].opcounters.delete
      this.query = t[0].opcounters.query
      this.update = t[0].opcounters.update
      this.virtual = t[0].mem.virtual
      this.supported = t[0].mem.supported.toString()
      this.resident = t[0].mem.resident + 'MB'
    },
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    // MongoDB监控柱状图
    initBarChart() {
      this.chart = echarts.init(document.getElementById('main'))
      this.barOption = {
        title: {
          text: this.MongoDBTitle + '容量大小',
          subtext: this.MongoDBSubtext
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
          data: this.barData
        },
        series: [
          {
            name: '存储大小(GB)',
            type: 'bar',
            stack: '总量',
            label: {
              position: 'insideRight'
            },
            data: this.storageSize
          },
          {
            name: '数据大小(GB)',
            type: 'bar',
            stack: '总量',
            label: {
              position: 'insideRight'
            },
            data: this.dataSize
          }
        ]
      }
      this.chart.setOption(this.barOption)
    },
    // MongoDB监控饼状图
    initPieChart() {
      this.chartPie = echarts.init(document.getElementById('mainPie'))
      this.t = {
        title: {
          text: this.MongoDBTitlePie + '数量统计',
          subtext: this.MongoDBSubtext,
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
      this.listLoading = true
      getStorageMonitor().then(response => {
        const data = JSON.parse(response.data)

        this.MongoDBdata = data[0]
        this.MongoDBdata.mongoData.map(item => {
          if(item.mongoInfo.db!=='MESSAGE'){
             // 列表数据
          this.list.push({
            database: item.mongoInfo.db,
            collections: item.mongoInfo.collections,
            host: item.mongoInfo.host,
            supported: item.mem.supported.toString(),
            dataSize: item.mongoInfo.objects
          })
          }
          // 清除 msgCountStatisticalVo 类值
          if (item.mongoInfo && item.mongoInfo.db === 'msgCountStatisticalVO') {
            return
          }
          // 分库容量大小柱状图数据
          this.barData.push(item.mongoInfo.db)
          this.storageSize.push(parseFloat(item.mongoInfo.storageSize))
          this.dataSize.push(parseFloat(item.mongoInfo.dataSize))
          // 各库总量统计饼状图数据
          this.pieData.push({
            value: item.mongoInfo.objects,
            name: item.mongoInfo.db
          })
          this.pieData.forEach(ix => {
            if (ix.name === 'AUTO') {
              ix.value = ''
              ix.name = ''
            }
          })
          this.initBarChart()
          this.initPieChart()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.elDialogMongoDB form.el-form {
  width: 270px;
  display: inline-block;
}
.elDialogMongoDB .el-form-item.el-form-item--medium {
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
