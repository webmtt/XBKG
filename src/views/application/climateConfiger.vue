<template>
  <div class="climateConfiger">
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>配置</span>
        <div>
          <i
            @click="is_show =! is_show"
            :class="is_show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          ></i>
          <span>{{ word }}</span>
        </div>
      </el-form-item>
      <el-form-item class="searchContent">
        <el-form v-show="is_show == true">
          <el-form-item class="airportClass" label="添加机场：">
            <el-select
              v-model="provinceValue"
              clearable
              style="margin: 0 2px;z-index: 1000;width: 130px;"
              size="small"
              placeholder="请选择省/市"
              @change="provinceChange"
              @clear="provinceClear"
            >
              <el-option
                v-for="(item, index) in provinceModelOptions"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="airport"
              clearable
              style="margin: 0 2px;z-index: 1000;width: 160px;"
              size="small"
              placeholder="请选择机场"
              @change="airportChange"
              @clear="airportClear"
            >
              <el-option
                v-for="(item, index) in airportOptions"
                :key="index"
                :label="item.airportName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item style="border-top:none;" class="searchContent">
        <el-form v-show="is_show == true">
          <el-form-item style="min-width:180px;">
            <el-radio-group :disabled="isStatistics === '停止统计'" v-model="isAuto">
              <el-radio label="手动">手动</el-radio>
              <el-radio label="自动">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="isAuto==='自动'" label="统计周期（天）：" style="min-width:270px;">
            <el-input style="width:100px" :disabled="isStatistics === '停止统计'" v-model="cycleDay"></el-input>
          </el-form-item>
          <el-form-item v-if="isAuto==='自动'" label="起始时间：" style="min-width:340px;">
            <el-date-picker
              disabled
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="startTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-if="isAuto==='手动'" label="起止时间：" style="min-width:500px;">
            <el-date-picker
              :clearable="false"
              style="width:380px"
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
          <el-form-item style="min-width:180px;">
            <el-button v-if="isAuto==='自动'" type="primary" @click="effectConfiger">{{isStatistics}}</el-button>
          </el-form-item>
          <el-form-item style="min-width:180px;">
            <el-button
              v-if="isAuto==='手动'"
              type="primary"
              @click="effectConfiger"
            >{{isnotAuotStatistics}}</el-button>
          </el-form-item>
          <el-form-item
            v-if="isAuto==='自动'"
            label="状态信息："
            style="min-width:130px;color:rgb(36, 210, 240)"
          >
            <span v-show="isStatistics === '停止统计'">{{ qqContext }}</span>
            <span v-show="isStatistics === '开始统计'">●</span>
          </el-form-item>
          <el-form-item
            v-if="isAuto==='手动'"
            label="状态信息："
            style="min-width:130px;color:rgb(36, 210, 240)"
          >
            <span v-show="isAutoShow===true">{{ qqContext }}</span>
            <span v-show="isAutoShow===false">●</span>
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <el-form class="data-list" :inline="true">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span>数据列表</span>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        align="center"
        :key="index"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
      <el-table-column
        label="是否统计"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template class="tableButtom" slot-scope="{row}">
          <el-checkbox v-model="row.iscount" true-label="1" @change="isCountEvent(row)"></el-checkbox>
          <!-- <el-checkbox :checked="Boolean(parseInt(row.iscount))" @change="isCountEvent(row)"></el-checkbox> -->
        </template>
        <!-- :checked="Boolean(parseInt(row.iscount))" -->
      </el-table-column>
    </el-table>
    <el-form class="operation">
      <el-form-item>
        <el-checkbox v-model="checked" @change="checkAll">全选</el-checkbox>
      </el-form-item>
      <el-form-item style="width: 84%;">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="paginationChange"
        />
      </el-form-item>
    </el-form>
    <!-- 配置生效的弹框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{dialogContent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="climatestatisticsTask">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GeneralOptions from '@/utils/generalOptions'
import {
  selectProvinceName,
  selectCodeAndAirportName,
  airportLocations,
  airportLocationsUpdate,
  startClimatestatisticsTask,
  stopClimatestatisticsTask,
  onceClimatestatisticsTask,
  getClimatestatisticsTaskState
} from '@/api/application'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    const day1 = new Date()
    day1.setTime(day1.getTime())
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
      taskState: '',
      timer: null,
      isAutoShow: false,
      isnotAuotStatistics: '开始统计',
      timeScope: [this.beginTime, this.endTime],
      endTime: '',
      dialogContent: '确定气候统计配置生效?',
      isAuto: '自动',
      qqContext: '',
      isStatistics: '开始统计',
      beginTime: '',
      startTime: this.beginTime,
      is_show: true,
      cycleDay: '',
      provinceModelOptions: [],
      provinceValue: '陕西省',
      airportOptions: [],
      tableMeta: [
        { key: 'region', label: '区域' },
        { key: 'areaName', label: '行政区' },
        { key: 'airportName', label: '机场名称' },
        { key: 'lat', label: '经度' },
        { key: 'lon', label: '纬度' }
      ],
      list: [],
      startDate: this.beginTime,
      endDate: this.endTime,
      i: '',
      listQuery: {
        page: 1,
        limit: 10
      },
      numberOptions: new GeneralOptions().numberOfPerPage(),
      multipleSelection: [],
      checked: false,
      total: 2,
      dialogVisible: false,
      airport: '西安咸阳国际机场',
      airportLocationsValue: []
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开配置' : '收起配置'
    }
  },
  methods: {
    //  状态显示三个点闪烁效果
    Mchange() {
      var tmp = ''
      for (var j = 0; j < this.i; j++) {
        tmp += '●'
      }
      this.qqContext = tmp
      this.i++
      if (this.i > 3) this.i = 1
    },
    breakDots() {
      setInterval(() => {
        this.Mchange()
      }, 500)
    },
    timeChange() {
      if (this.timeScope) {
        this.startDate = this.timeScope[0]
        this.endDate = this.timeScope[1]
      }
    },
    // 配置生效
    climatestatisticsTask() {
      if (this.isAuto === '自动') {
        if (this.isStatistics === '开始统计') {
          startClimatestatisticsTask({
            cycleDay: this.cycleDay,
            startTime: this.startTime
          }).then(res => {
            // 获取定时任务的状态
            getClimatestatisticsTaskState().then(res => {
              res.data.state === null
                ? (this.isStatistics = '开始统计')
                : (this.isStatistics = '停止统计')
              res.data.lifecycle === null
                ? (this.cycleDay = '3')
                : (this.cycleDay = res.data.lifecycle)
            })
          })
        } else if (this.isStatistics === '停止统计') {
          stopClimatestatisticsTask().then(res => {
            // 获取定时任务的状态
            getClimatestatisticsTaskState().then(res => {
              res.data.state === null
                ? (this.isStatistics = '开始统计')
                : (this.isStatistics = '停止统计')
              res.data.lifecycle === null
                ? (this.cycleDay = '3')
                : (this.cycleDay = res.data.lifecycle)
            })
          })
        }
      } else {
        this.isAutoShow = true
        onceClimatestatisticsTask({
          startDate: this.startDate,
          endDate: this.endDate
        }).then(res => {
          if (res.msg) {
            setTimeout(() => {
              this.isAutoShow = false
            }, 2000)
          }
        })
      }
      this.dialogVisible = false
    },
    isCountEvent(row) {
      this.airportLocationsValue = []
      this.airportLocationsValue.push({
        id: row.id,
        iscount:
          row.iscount === '' || row.iscount === '0'
            ? (row.iscount = '1')
            : (row.iscount = '0')
      })
      airportLocationsUpdate(this.airportLocationsValue).then(res => {
        this.getList()
      })
    },
    provinceClear() {
      this.listQuery.name = ''
    },
    // 机场名称选项选择
    provinceChange() {
      this.airport = ''
      this.airportOptions = []
      selectCodeAndAirportName({ provinceName: this.provinceValue }).then(
        res => {
          res.data.forEach(item => {
            this.airportOptions.push({
              airportName: item.airportName,
              id: item.id,
              code: item.code
            })
          })
        }
      )
    },
    airportChange(val) {
      this.airport = val
      this.airportLocationsValue = []
      this.airportLocationsValue.push({
        id: val,
        iscount: '1'
      })
      airportLocationsUpdate(this.airportLocationsValue).then(res => {
        this.getList()
      })
    },

    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    // 清除机场名称选项时触发
    airportClear() {
      this.listQuery.name = ''
    },
    checkAll() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    paginationChange() {
      this.checked = false
      this.getList()
    },
    effectConfiger() {
      if (this.isAuto === '手动') {
        this.dialogContent = '确定气候统计配置生效?'
      } else {
        this.isStatistics === '停止统计'
          ? (this.dialogContent = '确定停止气候统计配置?')
          : (this.dialogContent = '确定气候统计配置生效?')
      }
      this.dialogVisible = true
    },
    //获取数据列表
    getList() {
      this.listLoading = true
      airportLocations(this.listQuery).then(response => {
        this.list = response.data.list.filter(item => item.iscount === '1')
        this.total = response.data.total
      })
      // 获取机场信息
      selectProvinceName().then(response => {
        this.provinceModelOptions = response.data
      })
    }
  },
  mounted() {
    this.getList()
    // 获取机场信息
    selectProvinceName().then(response => {
      this.provinceModelOptions = response.data
    })
    this.provinceValue = '陕西省'
    selectCodeAndAirportName({ provinceName: this.provinceValue }).then(res => {
      res.data.forEach(item => {
        this.airportOptions.push({
          airportName: item.airportName,
          id: item.id,
          code: item.code
        })
      })
    })
    this.breakDots()
  },
  created() {
    // 获取定时任务的状态
    getClimatestatisticsTaskState().then(res => {
      res.data.lifecycle === null
        ? (this.cycleDay = '3')
        : (this.cycleDay = res.data.lifecycle)
      res.data.state === null
        ? (this.isStatistics = '开始统计')
        : (this.isStatistics = '停止统计')
    })
    this.timer = setInterval(() => {
      getClimatestatisticsTaskState().then(res => {
        res.data.lifecycle === null
          ? (this.cycleDay = '3')
          : (this.cycleDay = res.data.lifecycle)
        res.data.state === null
          ? (this.isStatistics = '开始统计')
          : (this.isStatistics = '停止统计')
      })
    }, 300000)
  },
  destroyed() {
    this.timer && window.clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.climateConfiger {
  padding: 20px;
  .filterSearch {
    background: #f3f3f3;
    padding: 7px;
    border: 1px solid #e4e4e4;
    border-bottom: none;
    div {
      float: right;
      span {
        cursor: pointer;
      }
    }
    span {
      margin-right: 20px;
    }
  }
  .searchContent {
    border: 1px solid #e4e4e4;
    form.el-form {
      display: flex;
      margin: 10px 10px 10px 10px;
      .el-form-item {
        // min-width: 363px !important;
      }
    }
    .el-input.el-input--medium {
      width: 200px;
    }
  }
  .data-list {
    padding-left: 15px;
    background: #f3f3f3;
    padding: 7px;
    border: 1px solid #e4e4e4;
    border-bottom: none !important;
    margin-top: 30px;
    .el-form-item {
      margin-bottom: 0px;
    }
    .el-form-item.el-form-item--medium:nth-child(2) {
      float: right;
    }
  }
  .operation {
    display: flex;
    padding: 15px;
    border: 1px solid #e4e4e4;
    margin-top: 20px;
    .el-form-item.el-form-item--medium:nth-child(1) {
      width: 500px;
    }
  }
}
</style>