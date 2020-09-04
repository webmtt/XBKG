<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <span style="color:#666666;margin-left:10px;">采集数据统计</span>
      </el-form-item>
      <el-form-item style="float: right;">
        <i
          @click="renovate"
          style="position: absolute;right:5x;top:12px"
          :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
        ></i>
      </el-form-item>
      <el-form-item style="float: right;">
        <span>时间：</span>
        <el-date-picker
          :clearable="false"
          v-model="echartsQuery.begintime"
          type="date"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
          @change="paramsChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="float: right; margin-right: 30px;" v-if="dataTypeoptions.length">
        <span>数据类型：</span>
        <el-select
          v-model="echartsQuery.type"
          style="width: 150px;"
          placeholder="数据类型"
          @change="paramsChange"
        >
          <el-option
            v-for="item in dataTypeoptions"
            :key="item.typename"
            :label="item.typename"
            :value="item.typecode"
          >{{ item.typename }}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="border:1px solid #E4E4E4; padding: 10px 10px 5px 15px;">
      <el-row>
        <el-col :span="11">
          <div id="main" style="height:400px;"></div>
        </el-col>
        <el-col :span="2">
          <div id="main-2" style="height:400px;"></div>
        </el-col>
        <el-col :span="11">
          <div id="mainPie" style="height:400px;"></div>
        </el-col>
      </el-row>
    </div>
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;margin-top:20px;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <span style="color:#666666;margin-left:10px;">采集任务运行列表</span>
      </el-form-item>
      <el-form-item style="float: right;">
        <i
          @click="renovate"
          style="position: absolute;right:5x;top:12px;"
          :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
        ></i>
      </el-form-item>
      <el-form-item style="float: right;">
        <span>起止时间：</span>
        <el-date-picker
          :clearable="false"
          v-model="timeScope"
          style="width:400px"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item style="float: right;margin-right: 30px;" v-if="dataTypeoptions.length">
        <span>数据类型：</span>
        <el-select
          v-model="listQuery.type"
          style="width: 150px;"
          placeholder="数据类型"
          @change="listParamsChange"
        >
          <el-option
            v-for="item in dataTypeoptions"
            :key="item.typename"
            :label="item.typename"
            :value="item.typecode"
          >{{ item.typename }}</el-option>
        </el-select>
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
        <el-table-column type="index" align="center" label="序号" :index="indexMethod()" width="70"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableMeta"
          :key="index"
          align="center"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
        />
      </el-table>
      <el-form>
        <el-form-item style="margin-top:10px;">
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="paginationChange"
            :autoScroll="false"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getCollectTaskList,
  getCollectTaskBarList,
  getCollectTaskPieList,
  getDataTypeClassify
} from '@/api/collection'
import echarts from 'echarts'

export default {
  components: { Pagination },
  data() {
    // 获取当天时间
    const day1 = new Date()
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
      rotate: '',
      m: '',
      n: '',
      t: '',
      filecount: [],
      msgcount: [],
      echartsTitle: '民航报文',
      timeScope: [],
      dataTypeoptions: [],
      pieList: '',
      tableMeta: [
        { key: 'datatype', label: '数据类型' },
        { key: 'fileormsg', label: '统计类型' },
        { key: 'begintime', label: '开始时间' },
        { key: 'endtime', label: '结束时间' },
        { key: 'fileormsgcount', label: '文件个数' }
      ],
      barList: '',
      list: [],
      chart: null,
      checked: false,
      value: '',
      total: 0,
      pielegendmsg: [],
      pielegendfile: [],
      beginTime: '',
      titles: [],
      legends: [],
      barLegends: ['文件个数', '报文个数'],
      barSeries: [
        {
          name: '文件个数',
          type: 'bar',
          data: this.filecount
        },
        {
          name: '报文个数',
          type: 'bar',
          data: this.msgcount
        }
      ],
      option: '',
      datas: [],
      listQuery: {
        page: 1,
        limit: 10,
        type: 1,
        begintime: this.beginTime,
        endtime: this.endTime
      },
      echartsQuery: {
        begintime: this.beginTime,
        type: 1
      }
    }
  },
  computed: {},
  mounted() {
    this.initEcharts()
  },
  created() {
    this.getList()
    this.getListTable()
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    initEcharts() {
      this.chart = echarts.init(document.getElementById('main'))
      this.barOption = {
        title: {
          text: this.echartsTitle
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.barLegends
        },
        xAxis: [
          {
            type: 'category',
            data: ['天', '周', '月', '年'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: this.barSeries
      }
      this.chart.setOption(this.barOption)
    },
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop =0
      this.checked = false
      this.getListTable()
     
    },
    timeChange() {
      this.listQuery.begintime = this.timeScope ? this.timeScope[0] : ''
      this.listQuery.endtime = this.timeScope ? this.timeScope[1] : ''
      this.listParamsChange()
    },
    paramsChange() {
      this.renovate()
      const l = this.dataTypeoptions.filter(
        item => item.typecode === this.echartsQuery.type
      )
      this.echartsTitle = l[0].typename
      this.getList()
    },
    listParamsChange() {
      this.renovate()
      this.listQuery.page = 1
      if (this.listQuery.type === 5) {
        this.tableMeta[4] = { key: 'fileormsgcount', label: '数据条数' }
      } else {
        this.tableMeta[4] = { key: 'fileormsgcount', label: '文件个数' }
      }
      this.getListTable()
    },
    initBarChart() {
      this.barSeries = []
      this.barLegends = []
      this.chart.clear()
      this.filecount[0] = this.barList.day.filecount
      this.filecount[1] = this.barList.week.filecount
      this.filecount[2] = this.barList.month.filecount
      this.filecount[3] = this.barList.year.filecount
      this.filecount[3] = this.barList.year.filecount
      this.msgcount[0] = this.barList.day.msgcount
      this.msgcount[1] = this.barList.week.msgcount
      this.msgcount[2] = this.barList.month.msgcount
      this.msgcount[3] = this.barList.year.msgcount
      if (this.echartsQuery.type === 1) {
        this.barSeries = [
          {
            name: '文件个数',
            type: 'bar',
            data: this.filecount
          },
          {
            name: '报文个数',
            type: 'bar',
            data: this.msgcount
          }
        ]
        this.barLegends = ['文件个数', '报文个数']
      } else if (this.echartsQuery.type === 5) {
        this.barSeries = [
          {
            name: '报文个数',
            type: 'bar',
            data: this.msgcount
          }
        ]
        this.barLegends = ['报文个数']
      } else if (
        this.echartsQuery.type === 2 ||
        this.echartsQuery.type === 3 ||
        this.echartsQuery.type === 4 ||
        this.echartsQuery.type === 6 ||
        this.echartsQuery.type === 7
      ) {
        this.barSeries = [
          {
            name: '文件个数',
            type: 'bar',
            data: this.filecount
          }
        ]
        this.barLegends = ['文件个数']
      }
      this.initEcharts()
    },
    initPieChart() {
      this.chartPie = echarts.init(document.getElementById('mainPie'))
      this.m = []
      this.n = []
      if (this.pieList.length) {
        if (this.echartsQuery.type === 1) {
          this.pieList[0].msgColleSatisticsHourVOS.map(item => {
            this.m.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
          this.pieList[0].fileColleSatisticsHourVOS.map(item => {
            this.n.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
        } else if (this.echartsQuery.type === 2) {
          this.pieList[1].msgColleSatisticsHourVOS.map(item => {
            this.m.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
          this.pieList[1].fileColleSatisticsHourVOS.map(item => {
            this.n.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
        } else if (this.echartsQuery.type === 3) {
          this.pieList[2].msgColleSatisticsHourVOS.map(item => {
            this.m.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
          this.pieList[2].fileColleSatisticsHourVOS.map(item => {
            this.n.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
        } else if (this.echartsQuery.type === 4) {
          this.pieList[3].msgColleSatisticsHourVOS.map(item => {
            this.m.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
          this.pieList[3].fileColleSatisticsHourVOS.map(item => {
            this.n.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
        } else if (this.echartsQuery.type === 5) {
          this.pieList[4].msgColleSatisticsHourVOS.map(item => {
            this.m.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
          this.pieList[4].fileColleSatisticsHourVOS.map(item => {
            this.n.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
        } else if (this.echartsQuery.type === 6) {
          this.pieList[5].msgColleSatisticsHourVOS.map(item => {
            this.m.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
          this.pieList[5].fileColleSatisticsHourVOS.map(item => {
            this.n.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
        } else if (this.echartsQuery.type === 7) {
          this.pieList[6].msgColleSatisticsHourVOS.map(item => {
            this.m.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
          this.pieList[6].fileColleSatisticsHourVOS.map(item => {
            this.n.push({
              value: item.fileormsgcount,
              name: item.datatype
            })
          })
        }
      }
      // 动态变换饼状图legend
      this.pielegendmsg = []
      this.m.forEach(ix => {
        this.pielegendmsg.push(ix.name)
      })
      this.pielegendfile = []
      this.n.forEach(ix => {
        this.pielegendfile.push(ix.name)
      })
      this.titles = [
        {
          text: '报文统计',
          subtext: '日统计',
          left: 'left'
        },
        {
          text: '文件统计',
          subtext: '日统计',
          left: 'right'
        }
      ]
      this.legends = [
        {
          top: '14%',
          orient: 'vertical',
          left: -15,
          data: this.pielegendmsg
        },
        {
          top: '14%',
          orient: 'vertical',
          right: 0,
          data: this.pielegendfile
        }
      ]
      this.datas = [
        {
          type: 'pie',
          radius: '40%',
          center: ['25%', '50%'],

          data: this.m
        },
        {
          type: 'pie',
          radius: '40%',
          center: ['75%', '50%'],
          data: this.n
        }
      ]
      this.option = {
        title: this.titles,
        legend: this.legends,
        tooltip: {},
        series: this.datas
      }
      // 动态变换饼状图位置
      if (this.echartsQuery.type === 5) {
        this.chartPie.clear()
        this.datas[0].center[0] = '50%'
        this.datas[0].radius = '65%'
        this.option.title = this.titles[0]
      } else if (
        this.echartsQuery.type === 2 ||
        this.echartsQuery.type === 3 ||
        this.echartsQuery.type === 4 ||
        this.echartsQuery.type === 6 ||
        this.echartsQuery.type === 7
      ) {
        this.datas[1].center[0] = '50%'
        this.datas[1].radius = '65%'
        this.option.title = this.titles[1]
      }
      this.chartPie.setOption(this.option)
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1
    },
    // 获取数据列表
    getListTable() {
      getCollectTaskList(this.listQuery).then(response => {
        this.list = response.data.list
        this.list.forEach(item => {
          item.fileormsg === 'm'
            ? (item.fileormsg = '报文')
            : (item.fileormsg = '文件')
        })
        this.total = response.data.total
      })
      
    },
    // 获取统计图数据
    getList() {
      this.timeScope = [this.listQuery.begintime, this.listQuery.endtime]
      this.listLoading = true
      getCollectTaskBarList(this.echartsQuery).then(response => {
        this.barList = response.data
        this.initBarChart()
      })
      getCollectTaskPieList({ begintime: this.echartsQuery.begintime }).then(
        response => {
          this.pieList = response.data
          this.initPieChart()
        }
      )
      getDataTypeClassify().then(response => {
        this.dataTypeoptions = response.data
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
