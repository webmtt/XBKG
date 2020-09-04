<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>风向数据曲线图</span>
        <div>
          <i
            style="cursor:pointer
          "
            :class="is_show1 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show1 = !is_show1"
          ></i>
          <span
            style="cursor:pointer
          "
            @click="is_show1 = !is_show1"
            >{{ is_show1 == true ? '收起' : '展开' }}</span
          >
        </div>
      </el-form-item>
    </el-form>

    <div class="charts" v-show="is_show1">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="chart1" id="main"></div>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>筛选查询</span>
        <div>
          <i
            style="cursor:pointer
          "
            :class="is_show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show = !is_show"
          ></i>
          <span
            style="cursor:pointer
          "
            @click="is_show = !is_show"
            >{{ is_show == true ? '收起' : '展开' }}</span
          >
          <el-button @click="search">查询结果</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--搜索操作 -->
    <div class="opt" v-if="is_show">
      <span style="font-size:14px">起始时间：</span>
      <el-date-picker
        v-model="startTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"
      ></el-date-picker>

      <span style="font-size:14px;margin-left:30px">结束时间：</span>
      <el-date-picker
        v-model="endTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择结束时间"
      ></el-date-picker>
      <span style="font-size:14px;margin-left:30px">条件：</span>
      <el-select v-model="type" placeholder="请选择" @change="selType(type)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button style="float:right" @click="check">高级检索</el-button>
    </div>
    <!-- 列表展示 -->
    <div class="dataTable">
      <div class="headTitle">
        <i class="el-icon-edit"></i>
        <span style="font-size:14px;">数据列表</span>
      </div>

      <el-table :data="tableData" height="535" border style="width: 100%">
        <el-table-column
          min-width="150"
          prop="DATA_TIME"
          label="时间"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_10"
          align="center"
          label="风向0-10"
          v-if="headTitle.indexOf('WD_10') > -1 ? true : false"
        ></el-table-column>
        <!-- <el-table-column prop="WS_1" align="center" label="风速0-1m/s" v-if="headTitle.indexOf("WS_1")>-1?true:false"></el-table-column> -->
        <el-table-column
          min-width="150"
          prop="WD_20"
          align="center"
          label="风向10-20"
          v-if="headTitle.indexOf('WD_20') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_30"
          align="center"
          label="风向20-30"
          v-if="headTitle.indexOf('WD_30') > -1 ? true : false"
        ></el-table-column>

        <el-table-column
          min-width="150"
          prop="WD_40"
          align="center"
          label="风向30-40"
          v-if="headTitle.indexOf('WD_40') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_50"
          align="center"
          label="风向40-50"
          v-if="headTitle.indexOf('WD_50') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_60"
          align="center"
          label="风向50-60"
          v-if="headTitle.indexOf('WD_60') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_70"
          align="center"
          label="风向60-70"
          v-if="headTitle.indexOf('WD_70') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_80"
          align="center"
          label="风向70-80"
          v-if="headTitle.indexOf('WD_80') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_90"
          align="center"
          label="风向80-90"
          v-if="headTitle.indexOf('WD_90') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_100"
          align="center"
          label="风向90-100"
          v-if="headTitle.indexOf('WD_100') > -1 ? true : false"
        ></el-table-column>

        <el-table-column
          min-width="150"
          prop="WD_110"
          align="center"
          label="风向100-110"
          v-if="headTitle.indexOf('WD_110') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_120"
          align="center"
          label="风向110-120"
          v-if="headTitle.indexOf('WD_120') > -1 ? true : false"
        ></el-table-column>

        <el-table-column
          min-width="150"
          prop="WD_130"
          align="center"
          label="风向120-130"
          v-if="headTitle.indexOf('WD_130') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_140"
          align="center"
          label="风向130-140"
          v-if="headTitle.indexOf('WD_140') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_150"
          align="center"
          label="风向140-150"
          v-if="headTitle.indexOf('WD_150') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_160"
          align="center"
          label="风向150-160"
          v-if="headTitle.indexOf('WD_160') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_170"
          align="center"
          label="风向160-170"
          v-if="headTitle.indexOf('WD_170') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_180"
          align="center"
          label="风向170-180"
          v-if="headTitle.indexOf('WD_180') > -1 ? true : false"
        ></el-table-column>

        <el-table-column
          min-width="150"
          prop="WD_190"
          align="center"
          label="风向180-190"
          v-if="headTitle.indexOf('WD_190') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_200"
          align="center"
          label="风向190-200"
          v-if="headTitle.indexOf('WD_200') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_210"
          align="center"
          label="风向200-210"
          v-if="headTitle.indexOf('WD_210') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_220"
          align="center"
          label="风向210-220"
          v-if="headTitle.indexOf('WD_220') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_230"
          align="center"
          label="风向220-230"
          v-if="headTitle.indexOf('WD_230') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_240"
          align="center"
          label="风向230-240"
          v-if="headTitle.indexOf('WD_240') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_250"
          align="center"
          label="风向240-250"
          v-if="headTitle.indexOf('WD_250') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_260"
          align="center"
          label="风向250-260"
          v-if="headTitle.indexOf('WD_260') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_270"
          align="center"
          label="风向260-270"
          v-if="headTitle.indexOf('WD_270') > -1 ? true : false"
        ></el-table-column>

        <el-table-column
          min-width="150"
          prop="WD_280"
          align="center"
          label="风向270-280"
          v-if="headTitle.indexOf('WD_280') > -1 ? true : false"
        ></el-table-column>

        <el-table-column
          min-width="150"
          prop="WD_290"
          align="center"
          label="风向280-290"
          v-if="headTitle.indexOf('WD_290') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          prop="WD_300"
          align="center"
          label="风向290-300"
          v-if="headTitle.indexOf('WD_300') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_310"
          align="center"
          label="风向300-310"
          v-if="headTitle.indexOf('WD_310') > -1 ? true : false"
        ></el-table-column>

        <el-table-column
          min-width="150"
          prop="WD_320"
          align="center"
          label="风向310-320"
          v-if="headTitle.indexOf('WD_320') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_330"
          align="center"
          label="风向320-330"
          v-if="headTitle.indexOf('WD_330') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_340"
          align="center"
          label="风向330-340"
          v-if="headTitle.indexOf('WD_340') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_350"
          align="center"
          label="风向340-350"
          v-if="headTitle.indexOf('WD_350') > -1 ? true : false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WD_360"
          align="center"
          label="风向350-360"
          v-if="headTitle.indexOf('WD_360') > -1 ? true : false"
        ></el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="details(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:30px;text-align:right;"></div>
    </div>
    <!-- 检索内容区域 -->
    <el-dialog class="climateClass" title="高级检索" :visible.sync="dialogVisible" width="60%">
      <div>
        <span>起始时间：</span>
        <el-date-picker
          style="margin-right:20px"
          v-model="startTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择开始时间"
        ></el-date-picker>

        <span>结束时间2：</span>
        <el-date-picker
          v-model="endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间"
        ></el-date-picker>
      </div>
      <div style="margin:20px 0px">
        <span style="margin-bottom:30px">风向选择：</span>
        <br />

        <div style="margin-top:10px;margin-left:75px">
          <el-transfer
            :titles="['总字段', '已选字段']"
            v-model="transfervalue"
            :data="transferdata"
          ></el-transfer>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="isdetails" width="40%">
      <div id="detailsChart" style="width:100%;height:30vh"></div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import axios from 'axios'
export default {
  props: ['condition'],
  data() {
    return {
      isdetails: false,
      headTitle: [],
      transferdata: [
        {
          key: 'WD_10',
          label: '风向0-10'
        },
        {
          key: 'WD_20',
          label: '风向10-20'
        },
        {
          key: 'WD_30',
          label: '风向20-30'
        },
        {
          key: 'WD_40',
          label: '风向30-40'
        },
        {
          key: 'WD_50',
          label: '风向40-50'
        },
        {
          key: 'WD_60',
          label: '风向50-60'
        },
        {
          key: 'WD_70',
          label: '风向60-70'
        },
        {
          key: 'WD_80',
          label: '风向70-80'
        },
        {
          key: 'WD_90',
          label: '风向80-90'
        },
        {
          key: 'WD_100',
          label: '风向90-100'
        },

        {
          key: 'WD_110',
          label: '风向100-110'
        },
        {
          key: 'WD_120',
          label: '风向110-120'
        },
        {
          key: 'WD_130',
          label: '风向120-130'
        },
        {
          key: 'WD_140',
          label: '风向130-140'
        },

        {
          key: 'WD_150',
          label: '风向140-150'
        },
        {
          key: 'WD_160',
          label: '风向150-160'
        },
        {
          key: 'WD_170',
          label: '风向160-170'
        },

        {
          key: 'WD_180',
          label: '风向170-180'
        },

        {
          key: 'WD_190',
          label: '风向180-190'
        },

        {
          key: 'WD_200',
          label: '风向190-200'
        },

        {
          key: 'WD_210',
          label: '风向200-210'
        },
        {
          key: 'WD_220',
          label: '风向210-220'
        },
        {
          key: 'WD_230',
          label: '风向220-230'
        },
        {
          key: 'WD_240',
          label: '风向230-240'
        },

        {
          key: 'WD_250',
          label: '风向240-250'
        },
        {
          key: 'WD_260',
          label: '风向250-260'
        },
        {
          key: 'WD_270',
          label: '风向260-270'
        },
        {
          key: 'WD_280',
          label: '风向270-280'
        },

        {
          key: 'WD_290',
          label: '风向280-290'
        },
        {
          key: 'WD_300',
          label: '风向290-300'
        },
        {
          key: 'WD_310',
          label: '风向300-310'
        },
        {
          key: 'WD_320',
          label: '风向310-320'
        },
        {
          key: 'WD_330',
          label: '风向320-330'
        },
        {
          key: 'WD_340',
          label: '风向330-340'
        },
        {
          key: 'WD_350',
          label: '风向340-350'
        },
        {
          key: 'WD_360',
          label: '风向350-360'
        }
      ],

      transfervalue: ['WD_10', 'WD_20', 'WD_30'],
      dialogVisible: false,
      startTime: '2019-04',
      endTime: '2020-03-01',
      type: 1,
      options: [
        {
          value: 1,
          label: '风向'
        },
        {
          value: 2,
          label: '风速'
        },
        {
          value: 3,
          label: '玫瑰图'
        },
        {
          value: 4,
          label: '风力负荷图'
        }
      ],
      value: '',
      is_show: true,
      is_show1: true,

      tableData: []
    }
  },
  computed: {},

  created() {
    const yy = moment(new Date().getTime()).format('YYYY') - 1
    const mm = moment(new Date().getTime()).format('MM')
    const dd = moment(new Date().getTime()).format('DD')
    this.startTime = yy + '-' + mm + '-' + dd
    this.endTime = moment(new Date().getTime()).format('YYYY-MM-DD')
  },
  mounted() {
    this.getInit()
  },
  methods: {
    initdetailchart(legend, data) {
      var myChart = echarts.init(document.getElementById('detailsChart'))
      if (myChart) {
        myChart.clear()
      }
      var option = {
        title: {
          text: '风向占比详情',

          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 'left',
          data: legend
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: data,
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
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        //执行
        myChart.resize()
      })
    },
    details(row) {
      this.isdetails = true
      // 构造lenged
      // var arr = this.tableData
      let legend = [] // 图例
      let serise = [] //  所有项渲染
      let total = 0 //总数值
      let detailsTotal = 0 //  其中渲染项的植

      this.transferdata.map(item => {
        for (var key in row) {
          if (key == item.key) {
            total += row[key]
          }
        }
      })
      this.transfervalue.map(item => {
        for (var key in row) {
          if (key == item) {
            detailsTotal += row[key]
          }
        }
      })

      this.transferdata.map(item => {
        this.transfervalue.map(item1 => {
          if (item.key == item1) {
            legend.push(item.label)
          }
        })
      })
      legend.push('其他')
      legend.map((item, index) => {
        var obj = { value: '', name: '' }

        let val = this.transfervalue[index]
        for (var key in row) {
          if (key == val) {
            obj.value = row[key]
            obj.name = item
            serise.push(obj)
          }
        }
      })
      var objx = { value: total - detailsTotal, name: '其他' }
      serise.push(objx)
      //  计算其他值

      setTimeout(() => {
        this.initdetailchart(legend, serise)
      }, 400)
    },
    //获取列表接口
    async getInit() {
      let params = '?startTime=' + this.startTime + '&endTime=' + this.endTime
      let result = await axios.get(
        'http://121.36.62.243:9453/windDays/getWByTime' + params
      )
      if (result.data.code == 0) {
        let arr = (this.tableData = result.data.data)
        this.headTitle = this.transfervalue
        // 第一步生成lenged数组
        let lenged = []
        let xAxis = []
        let serise = []

        //生成x轴
        arr.map(item => {
          xAxis.push(item.DATA_TIME)
        })
        // xAxis.push(this.endTime)
        // xAxis.unshift(this.startTime)
        xAxis.min = this.transferdata.map(item => {
          this.transfervalue.map(item1 => {
            if (item.key == item1) {
              lenged.push(item.label)
            }
          })
        })
        //生成四个shuzu
        var all = []
        this.transfervalue.map((item, index) => {
          var obj = {
            name: '',
            type: 'line',
            // areaStyle: {},
            smooth: true,
            data: []
          }

          arr.map(item1 => {
            obj.name = lenged[index]
            // obj.data.push(item1[item])
            obj.data.push([item1['DATA_TIME'], item1[item]])
          })
          all.push(obj)
        })
        console.log(all, 'all')
        setTimeout(() => {
          this.initChart(lenged, xAxis, all)
        }, 400)
      }
    },
    // 选择类型
    sure() {
      this.dialogVisible = false
      this.getInit()
    },
    search() {
      this.getInit()
    },
    check() {
      this.dialogVisible = true
    },
    selType(type) {
      this.$emit('update-show', parseInt(type))
    },
    initChart(legendArr, xAxisArr, seriesArr) {
      var myChart = echarts.init(document.getElementById('main'))
      if (myChart) {
        myChart.clear()
      }
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '风向月折线图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: legendArr,
          top: 30
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '35%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'time',
            boundaryGap: false,
            min: this.startTime,
            max: this.endTime
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: seriesArr
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', function() {
        //执行
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .opt {
    height: 50px;
    width: 100%;
    border: 1px solid #e4e4e4;
    padding: 5px 20px;
  }
  .dataTable {
    .headTitle {
      height: 50px;
      line-height: 50px;
      background: #f3f3f3;
      padding-left: 10px;
      border: 1px solid #e4e4e4;
      margin-top: 30px;
    }
  }
  .chart1,
  .chart2 {
    width: 100%;
    height: 40vh;
  }
}
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
