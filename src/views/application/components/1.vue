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

    <div class="chartBar" v-show="is_show1" id="main"></div>
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
          <el-button @click="search()">查询结果</el-button>
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
      <el-date-picker v-model="endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
      <span style="font-size:14px;margin-left:30px">要素：</span>
      <el-select @change="typeChange" v-model="type" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <!-- 列表展示 -->
    <div class="dataTable">
      <div class="headTitle">
        <i class="el-icon-edit"></i>
        <span style="font-size:14px;">数据列表</span>
      </div>

      <el-table :data="tableData" height="350" border style="width: 100%">
        <el-table-column prop="DATA_TIME" label="时间" align="center" width="180"></el-table-column>
        <el-table-column prop="MAX" align="center" label="最大值"></el-table-column>
        <el-table-column prop="MIN" align="center" label="最小值"></el-table-column>
        <el-table-column prop="AVG" align="center" label="平均值"></el-table-column>
      </el-table>
      <div style="margin:30px;text-align:right;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'
import axios from 'axios'
export default {
  data() {
    return {
      options: [
        {
          value: 'temp',
          label: '温度'
        },
        {
          value: 'press',
          label: '气压'
        },
        {
          value: 'ws',
          label: '风速'
        },
        {
          value: 'cw',
          label: '侧风'
        },
        {
          value: 'dew',
          label: '相对湿度'
        },
        {
          value: 'rain',
          label: '降水'
        }
      ],

      is_show: true,
      is_show1: true,

      tableData: [],
      startTime: '2019-10',
      endTime: '2020-02',
      type: 'temp',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      mm: '',
      titleName: '温度'
    }
  },
  computed: {},

  created() {
    const yy = moment(new Date().getTime()).format('YYYY') - 1
    this.mm = moment(new Date().getTime()).format('MM')
    this.mm < 10 ? (this.mm = '0' + this.mm) : this.mm
    const dd = moment(new Date().getTime()).format('DD')
    this.startTime = yy + '-' + this.mm
    this.endTime = moment(new Date().getTime()).format('YYYY-MM')
  },
  mounted() {
    setTimeout(() => {
      this.initChart()
    }, 400)
    this.getInit()
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNum = val
      this.getInit()
    },
    search() {
      this.pageNum = 1
      this.getInit()
    },
    //  获取列表数据
    async getInit() {
      let xArr = []
      let minArr = []
      let maxArr = []
      let avgArr = []
      let params =
        '?startTime=' +
        this.startTime +
        '&endTime=' +
        this.endTime +
        '&type=' +
        this.type +
        '&pageNum=' +
        this.pageNum +
        '&pageSize=' +
        this.pageSize
      let result = await axios.get(
        'http://121.36.62.243:9453/extremum/getExtremunDataByPage' + params
      )
      if (result.data.code == 0) {
        let arr = (this.tableData = result.data.data.content)
        this.total = result.data.data.totalSize
        arr.map(item => {
          xArr.push(item.DATA_TIME)
          minArr.push(item.MIN)
          maxArr.push(item.MAX)
          avgArr.push(item.AVG)
        })
        setTimeout(() => {
          this.initChart(xArr, minArr, maxArr, avgArr)
        }, 400)
      }

      //  渲染echarts
    },
    //要素切换
    typeChange() {
      const t = this.options.filter(item => item.value === this.type)
      this.titleName = t[0].label
    },
    initChart(xArr, minArr, maxArr, avgArr) {
      var myChart = echarts.init(document.getElementById('main'))
      if (myChart) {
        myChart.clear()
      }
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: this.titleName + '折线图'
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
          data: ['最大值', '最小值', '平均值']
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
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xArr
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '最大值',
            type: 'line',
            smooth: true,
            // areaStyle: {},
            data: maxArr
          },
          {
            name: '最小值',
            type: 'line',
            smooth: true,
            // areaStyle: {},
            data: minArr
          },
          {
            name: '平均值',
            type: 'line',
            smooth: true,
            // areaStyle: {},
            data: avgArr
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.onresize = function() {
        myChart.resize()
      }
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
  .chartBar {
    width: 100%;
    height: 50vh;
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
