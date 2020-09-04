<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <span style="color:#666666;margin-left:10px;">统计图表</span>
      </el-form-item>
    </el-form>
    <div style="border:1px solid #E4E4E4;    padding: 30px 30px 5px 30px;">
      <!-- 柱状统计图 -->
      <div id="main" style="height:300px;"></div>
    </div>
    <!-- 筛选查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>筛选查询</span>
        <div>
          <i
            :class="is_show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show = !is_show"
          ></i>
          <span>{{ word }}</span>
          <el-button @click="handleFilter">
            查询结果
            <i
              @click="renovate"
              style="    position: absolute;right:5x;"
              :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
            ></i>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-form class="searchContent" v-show="is_show == true">
      <el-form-item label="日期范围：" style="min-width:500px;">
        <el-date-picker
          v-model="timeScope"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item>
        <span>统计内容：</span>
        <el-select
          @change="filterEvent"
          multiple
          collapse-tags
          style="width: 220px;"
          v-model="dataTypes"
          placeholder="统计内容"
        >
          <el-option
            v-for="item in dataTypeoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span style="color:#666666;margin-left:10px;">数据列表</span>
      </el-form-item>
      <!-- <el-form-item>
        <el-select
          @change="handleFilter"
          v-model="listQuery.sort"
          class="filter-item"
          placeholder="排序方式"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item> -->
    </el-form>
    <div style="border:1px solid #E4E4E4;padding:30px;">
      <!--统计表格-->
      <el-table
        class="tableData"
        ref="multipleTable"
        :data="list"
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
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
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import GeneralOptions from '@/utils/generalOptions'
import Pagination from '@/components/Pagination'
import moment from 'moment'
import { getProductEchartsList,getProductEchartsList_ } from '@/api/application'
import echarts from 'echarts'

export default {
  components: { Pagination },
  data() {
    const day1 = new Date()
    day1.setTime(day1.getTime())
    this.beginTime =
      day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate()
    this.beginTimeInit =
      moment(new Date().getTime()).format('YYYY-MM-DD') + ' 00:00:00'
    this.endTimeInit =
      moment(new Date().getTime()).format('YYYY-MM-DD') + ' 23:59:59'
    return {
      beginTimeInit: '',
      endTimeInit: '',
      rotate: false,
      echartsTitle: '',
      timeTypeSelect: 'year',
      gz: [],
      num: [],
      dataTypes: ['specil'],
      xd: [],
      valueFormat: 'yyyy',
      statisticalContent: false,
      tableMeta: [],
      dataTypeoptions: [
        {
          value: 'taf',
          label: '机场预报'
        },
        {
          value: 'metar',
          label: '机场例行天气报告'
        },
        {
          value: 'specil',
          label: '机场特殊天气报告'
        },
        {
          value: 'prog',
          label: '重要天气预告图'
        },
        {
          value: 'JJ',
          label: '机场警报'
        },
        {
          value: 'ZD',
          label: '终端区预警'
        },
        {
          value: 'YJ',
          label: '区域预警'
        },
        {
          value: 'AR',
          label: '航空器空中报告'
        }
      ],
      is_show: true,
      pickerOptions: {},
      numberOptions: new GeneralOptions().numberOfPerPage(),
      sortOptions: new GeneralOptions().listSorting_(),
      timeScope: [this.beginTimeInit, this.endTimeInit],
      pieList: '',
      barList: '',
      barListNum: '',
      list: [],
      chart: null,
      checked: false,
      value: '',
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        // sort: 'desc',
        startTime: this.beginTimeInit,
        endTime: this.endTimeInit,
        // type: 'xd',
        // isreversion: '1',
        dataType: 'specil'
      },
      EchartsQuery: { year: '' },
      echartsData: '',
      seriesData: [],
      seriesName: [],
      seriesDataXD: [],
      xAxisData: ['机场特殊天气报告']
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
    }
  },
  mounted() {},
  created() {
    this.getList()
  },
  methods: {
    // 选择统计内容选项
    filterEvent() {
      this.listQuery.dataType = this.dataTypes.join(',')
      this.xAxisData = []
      this.dataTypeoptions.forEach(item=>{
        this.dataTypes.forEach(ix=>{
          if(item.value === ix){
            this.xAxisData.push(item.label)
          }
        })
      })
    },
    timeChange() {
      this.listQuery.startTime = this.timeScope ? this.timeScope[0] : null
      this.listQuery.endTime = this.timeScope ? this.timeScope[1] : null
    },
    renovate() {
      this.rotate = !this.rotate
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.page = 1
      this.getList()
    },
    handleDetails() {},
    handleDelete() {},
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    paramsChange() {
      this.getList()
    },
    initBarChart() {
      this.chart = echarts.init(document.getElementById('main'))
      this.gz = []
      this.xd = []
      if (this.barList) {
        this.gz.push(
          this.barList.taf.gz,
          this.barList.metar.gz,
          this.barList.specil.gz,
          this.barList.prog.porgNum
        )
        this.xd.push(
          this.barList.taf.xd,
          this.barList.metar.xd,
          this.barList.specil.xd
        )
      }
      console.log(this.barListNum)
      console.log(this.barList)
      console.log(this.xAxisData)
      this.barListNum.forEach(item=>{
        this.xAxisData.forEach((it,ix)=>{
          if(item.name === it){
            this.num[ix] = item.num
          }
        })
      })
      console.log(this.num)
      this.xAxisData = [...new Set(this.xAxisData)]
      this.echartsData = {
        title: {
          text: '产品生成数据量统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['修订', '更正','数量']
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxisData,
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
        series: [
          {
            name: '修订',
            type: 'bar',
            data: this.xd
          },
          {
            name: '更正',
            type: 'bar',
            data: this.gz
          },
          {
            name: '数量',
            type: 'bar',
            data: this.num
          }
        ]
      }
      this.chart.setOption(this.echartsData)
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    // 获取数据列表
    getList() {
      this.num = []
      this.listLoading = true
      getProductEchartsList(this.listQuery).then(response => {
        this.barList = response.data.tongji
        this.tableMeta = [
          { key: 'type', label: '类型', width: 220 },
          // { key: 'date', label: '日期', width: 220 },
          { key: 'name', label: '产品名称' },
          { key: 'num', label: '数量' }
        ]
        this.list = response.data.list
        getProductEchartsList_({dataTypes:this.listQuery.dataType,eventTimeBegin:this.listQuery.startTime,eventTimeEnd:this.listQuery.endTime}).then(response => {
          this.list = this.list.concat(response.data)
          this.barListNum = response.data
          this.initBarChart()
        })
        this.list.forEach(item => {
          item.collect_date = moment(this.list[0].collect_date).format(
            'YYYY-MM-DD hh:mm:ss'
          )
        })
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
.filter-item {
  width: 150px;
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
</style>
