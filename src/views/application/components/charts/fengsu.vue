<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>数据曲线图</span>
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
          >{{is_show1==true? '收起':'展开'}}</span>
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
          >{{is_show==true? '收起':'展开'}}</span>
          <el-button @click="search">查询结果</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--搜索操作 -->
    <div class="opt" v-if="is_show">
      <span style="font-size:14px">起始时间:</span>
      <el-date-picker v-model="startTime" type="month" value-format="yyyy-MM" placeholder="选择开始时间"></el-date-picker>

      <span style="font-size:14px">结束时间:</span>
      <el-date-picker v-model="endTime" type="month" value-format="yyyy-MM" placeholder="选择结束时间"></el-date-picker>
      <span style="margin-left:20%;">条件:</span>
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
        <el-table-column min-width="150" prop="DATA_TIME" label="时间" align="center"></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_1"
          align="center"
          label="风速0-1m/s"
          v-if="headTitle.indexOf('WS_1')>-1?true:false"
        ></el-table-column>
        <!-- <el-table-column prop="WS_1" align="center" label="风速0-1m/s" v-if="headTitle.indexOf("WS_1")>-1?true:false"></el-table-column> -->
        <el-table-column
          min-width="150"
          prop="WS_2"
          align="center"
          label="风速1-2m/s"
          v-if="headTitle.indexOf('WS_2')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_3"
          align="center"
          label="风速2-3m/s"
          v-if="headTitle.indexOf('WS_3')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_4"
          align="center"
          label="风速3-4m/s"
          v-if="headTitle.indexOf('WS_4')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_5"
          align="center"
          label="风速4-5m/s"
          v-if="headTitle.indexOf('WS_5')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_6"
          align="center"
          label="风速5-6m/s"
          v-if="headTitle.indexOf('WS_6')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_7"
          align="center"
          label="风速6-7m/s"
          v-if="headTitle.indexOf('WS_7')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_8"
          align="center"
          label="风速7-8m/s"
          v-if="headTitle.indexOf('WS_8')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_9"
          align="center"
          label="风速8-9m/s"
          v-if="headTitle.indexOf('WS_9')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_10"
          align="center"
          label="风速9-10m/s"
          v-if="headTitle.indexOf('WS_10')>-1?true:false"
        ></el-table-column>

        <el-table-column
          min-width="150"
          prop="WS_11"
          align="center"
          label="风速10-11m/s"
          v-if="headTitle.indexOf('WS_11')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_12"
          align="center"
          label="风速11-12m/s"
          v-if="headTitle.indexOf('WS_12')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_13"
          align="center"
          label="风速12-13m/s"
          v-if="headTitle.indexOf('WS_13')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_14"
          align="center"
          label="风速13-14m/s"
          v-if="headTitle.indexOf('WS_14')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_15"
          align="center"
          label="风速14-15/s"
          v-if="headTitle.indexOf('WS_15')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_16"
          align="center"
          label="风速15-16m/s"
          v-if="headTitle.indexOf('WS_16')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_17"
          align="center"
          label="风速16-17m/s"
          v-if="headTitle.indexOf('WS_17')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_18"
          align="center"
          label="风速17-18m/s"
          v-if="headTitle.indexOf('WS_18')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_19"
          align="center"
          label="风速18-19m/s"
          v-if="headTitle.indexOf('WS_19')>-1?true:false"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="WS_20"
          align="center"
          label="风速19-20m/s"
          v-if="headTitle.indexOf('WS_20')>-1?true:false"
        ></el-table-column>

        <el-table-column align="center"  fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="details(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:30px;text-align:right;"></div>
    </div>
    <!-- 检索内容区域 -->
    <el-dialog class="climateClass" title="高级检索" :visible.sync="dialogVisible" width="50%">
      <div>
        <span style="font-size:14px">起始时间:</span>
        <el-date-picker
          v-model="startTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择开始时间"
        ></el-date-picker>

        <span>结束时间:</span>
        <el-date-picker v-model="endTime" type="month" value-format="yyyy-MM" placeholder="选择结束时间"></el-date-picker>
      </div>
      <div>
        <span style="margin-bottom:30px">风向选择:</span>
        <br />

        <div>
          <el-transfer :titles="['总字段', '已选字段']" v-model="transfervalue" :data="transferdata"></el-transfer>
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
          key: 'WS_1',
          label: '风速0-1m/s'
        },
        {
          key: 'WS_2',
          label: '风速1-2m/s'
        },
        {
          key: 'WS_3',
          label: '风速2-3m/s'
        },
        {
          key: 'WS_4',
          label: '风速3-4m/s'
        },
        {
          key: 'WS_5',
          label: '风速4-5m/s'
        },
        {
          key: 'WS_6',
          label: '风速5-6m/s'
        },
        {
          key: 'WS_7',
          label: '风速6-7m/s'
        },
        {
          key: 'WS_8',
          label: '风速7-8m/s'
        },
        {
          key: 'WS_9',
          label: '风速8-9m/s'
        },
        {
          key: 'WS_10',
          label: '风速9-10m/s'
        },
        {
          key: 'WS_11',
          label: '风速10-11m/s'
        },
        {
          key: 'WS_12',
          label: '风速11-12m/s'
        },
        {
          key: 'WS_13',
          label: '风速12-13m/s'
        },
        {
          key: 'WS_14',
          label: '风速13-14m/s'
        },
        {
          key: 'WS_15',
          label: '风速14-15m/s'
        },
        {
          key: 'WS_16',
          label: '风速15-16m/s'
        },
        {
          key: 'WS_17',
          label: '风速16-17m/s'
        },
        {
          key: 'WS_18',
          label: '风速17-18m/s'
        },
        {
          key: 'WS_19',
          label: '风速18-19m/s'
        },
        {
          key: 'WS_20',
          label: '风速19-20m/s'
        }
      ],

      transfervalue: ['WS_1', 'WS_2', 'WS_3'],
      dialogVisible: false,
      startTime: '2019-04',
      endTime: '2020-3',
      type: 2,
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
    const yy = moment(new Date().getTime()).format('YYYY')-1
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
          text: '风速占比详情',

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
        xAxis.push(this.endTime)
        xAxis.unshift(this.startTime)
        this.transferdata.map(item => {
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
            smooth: true,
            // areaStyle: {},
            data: []
          }

          arr.map(item1 => {
            obj.name = lenged[index]
            // obj.data.push(item1[item])
            obj.data.push([item1['DATA_TIME'], item1[item]])
          })
          all.push(obj)
        })

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
          text: '风速月折线图'
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
          top:'35%',
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
      padding: 7px;
      border: 1px solid #e4e4e4;
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
