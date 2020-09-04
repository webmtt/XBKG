<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>数据玫瑰图</span>
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
          <el-button @click="init()">查询结果</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--搜索操作 -->
    <div class="opt" v-if="is_show">
      <span>起始时间:</span>
      <el-date-picker
        v-model="startTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"
      ></el-date-picker>

      <span>结束时间:</span>
      <el-date-picker v-model="endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
      <span style="margin-left:20%;">条件:</span>
      <el-select v-model="type" placeholder="请选择" @change="selType(type)">
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
        <span class="el-icon-s-operation" style="font-size:18px"></span>
        <span style="font-size:16px">数据列表</span>
      </div>

      <!-- <el-table :data="tableData" height="250" border style="width: 100%"  @cell-click="cellclick">
       
       
      </el-table-column>-->
      <!-- </el-table> -->

      <el-table :data="data_list" height="250" border style="width: 100%" @cell-click="cellclick">
        <el-table-column
          :label="date"
          v-for="(date, key) in header"
          :prop="date"
          align="center"
          :width="key==0?150:'auto'"
        >
          <template scope="scope">{{data_list[scope.$index][key]}}</template>
        </el-table-column>
      </el-table>
      <div style="margin:30px;text-align:right;"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import moment from 'moment'
export default {
  props: ['condition'],

  data() {
    return {
      header: [],
      data_list: [],
      startTime: '2020-02-14',
      endTime: '2020-02-16',
      type: 3,
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
      arrs: [],
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
    this.init()
  },
  methods: {
    // 选择类型
    cellclick(row, column, cell, event) {
      //  取到表头根据表头第几个字段确定row  字段的值
      let arr = this.header
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == column.property && i != 0) {
          break
        }
      }
    },
    async init() {
      // debugger
      let title = ['0-5m/s', '5-6.5m/s', '6-10m/s', '大于10m/s']
      let params = '?startTime=' + this.startTime + '&endTime=' + this.endTime
      let result = await axios.get(
        'http://121.36.62.243:9453/windSpeed/getRoseData' + params
      )
      if (result.data.code == 0) {
        let category = result.data.data[0]
        category.forEach((item, index) => {
          category[index] = item + '(%)'
        })

        this.arrs = result.data.data[1]
        this.data_list = []
        this.header = []
        //  构建动态列表
        this.header = ['名称/属性', ...category]

        let series = []
        this.arrs.map((item, index) => {
          item.forEach((ix, indexIx) => {
            item[indexIx] = parseFloat(Number(ix * 100).toFixed(2) + '%')
          })
          let itemArr = [title[index], ...item]
          this.data_list.push(itemArr)
          let obj = {
            type: 'bar',
            data: item,
            coordinateSystem: 'polar',
            name: '<0.5m/s',
            stack: 'a'
          }

          series.push(obj)
        })
        setTimeout(() => {
          this.initChart(category, series)
        }, 400)
      }
    },
    selType(type) {
      this.$emit('update-show', parseInt(type))
    },
    initChart(category, series) {
      var myChart = echarts.init(document.getElementById('main'))
      if (myChart) {
        myChart.clear()
      }
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '风玫瑰图'
          // left: 'center'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '35%',
          containLabel: true
        },
        angleAxis: {
          type: 'category',
          data: category,
          z: 0,
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ddd',
              type: 'solid'
            }
          },
          axisLine: {
            show: false
          }
        },
        radiusAxis: {},
        polar: {},
        series: series
        // legend: {
        //     show: true,
        //     top:'bottom',
        //     right:'right',
        //     data: ['<5m/s', '5-6.6m/s', '6-10m/s','>10m/s'],
        //    orient:'vertical'
        // }
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
