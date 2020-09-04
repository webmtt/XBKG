<template>
  <div class="app-container">
    <!-- 个例查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>个例查询</span>
        <div>
          <i
            :class="is_show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show =! is_show"
          ></i>
          <span>{{word}}</span>
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
      <el-form-item class="searchContent">
        <el-form v-show="is_show == true">
          <el-form-item style="min-width:300px;" label="记录要素：">
            <el-select clearable v-model="listQuery.element" size="small" placeholder="请选择记录要素">
              <el-option
                v-for="(item, index) in elementOptions"
                :key="index"
                :label="item.elementName"
                :value="item.elementName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围：" style="min-width:400px;">
            <el-date-picker
              style="width:310px"
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
          <el-form-item class="airportClass" label="机场名称：">
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
              style="margin: 0 2px;z-index: 1000;width: 130px;"
              size="small"
              placeholder="请选择机场"
              @change="airportChange"
              @clear="airportClear"
            >
              <el-option
                v-for="(item, index) in airportOptions"
                :key="index"
                :label="item.airportName"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span>查询结果</span>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="openModal('insert')">添加</el-button>
        <el-select
          v-model="listQuery.pageSize"
          class="filter-item"
          placeholder="显示条数"
          @change="handleFilter"
        >
          <el-option
            v-for="item in numberOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="listQuery.sortOrder"
          class="filter-item"
          placeholder="排序方式"
          @change="handleFilter"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 数据显示部分 -->
    <el-table
      ref="multipleTable"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        align="center"
        :key="index"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template class="tableButtom" slot-scope="{row}">
          <el-button type="info" size="mini" @click="openModal('update',row)">编辑</el-button>
          <el-button type="danger" size="mini" style="margin-left: 0" @click="handleDelete(row)">删除</el-button>
          <el-button type="warning" size="mini" style="margin-left: 0" @click="handleQuery(row)">查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      style="padding-top:15px;"
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="paginationChange"
    />
    <el-dialog title="数据详情" :visible.sync="is_details" width="50%">
      <el-form style="margin-bottom:16px;">
        <el-form-item style="display:inline-block;">
          <span>数据类型：</span>
          <el-select
            @change="dataClassifyEvent"
            style="width: 150px;"
            v-model="dataClassify"
            placeholder="数据类型"
          >
            <el-option
              v-for="item in dataClassifyoptions"
              :key="item.typecode"
              :label="item.typename"
              :value="item.typecode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="display:inline-block;">
          <el-select
            @change="dataTypeEvent"
            style="width: 200px;"
            v-model="dataType"
            placeholder="数据类型"
          >
            <el-option
              v-for="item in dataTypeoptions"
              :key="item.datatypecode"
              :label="item.datatypename"
              :value="item.datatypecode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        @selection-change="handleSelectionChange"
        ref="multipleTables"
        :data="details"
        border
        style="width: 100%;height:400px;overflow:auto;"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column
          type="index"
          align="center"
          label="序号"
          :index="indexDetailMethod"
          width="70"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in tableDetails"
          :key="index"
          align="center"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="操作" align="center" width="120">
          <template class="tableButtom" slot-scope="{row}">
            <el-button class="handleLink" type="primary" @click="handleDownLoad(row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form class="operation">
        <el-form-item>
          <el-checkbox v-model="checked" @change="checkAll">全选</el-checkbox>
          <el-dropdown
            style="margin-left:10px"
            :trigger="'click'"
            type="warning"
            @command="handleAll"
          >
            <el-button :disabled="!multipleSelection.length" type="success" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="!multipleSelection.length" command="download">下载</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item style="width: 84%;">
          <pagination
            style="padding-top:15px;"
            v-show="detailstotal > 0"
            :total="detailstotal"
            :page.sync="historyQuery.pageNum"
            :limit.sync="historyQuery.pageSize"
            @pagination="paginationDetailsChange"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑/新增重要天气个例的模态框 -->
    <weather-cases-submit class="inPageModal" @handleSucc="getList" :modalData="modalOption"></weather-cases-submit>
  </div>
</template>

<script>
import weatherCasesSubmit from './components/addUpdateWeatherCases'
import generalOptions from '@/utils/generalOptions'
import Pagination from '@/components/Pagination'
import Options from './options'
import AdvancedFilter from './components/aviationMessage'
import { getProvince, getAirportList } from '@/api/application'
import {
  getWeatherCasesList,
  getWeatherCasesDetail,
  getWeatherCasesDelete,
  getWeatherCasesHistoryList
} from '@/api/application'
import {
  getHistoryList,
  getHistoryDownload,
  getHistoryListDownload
} from '@/api/historyData'
import FileDownload from '@/utils/fileDownload'
import { getDataTypes, getDataTypeClassify } from '@/api/collection'

export default {
  components: { Pagination, AdvancedFilter, weatherCasesSubmit },
  data() {
    const day1 = new Date()
    day1.setTime(day1.getTime())
    this.beginTimeInit =
      day1.getFullYear() +
      '-' +
      (day1.getMonth() + 1) +
      '-' +
      day1.getDate() +
      ' 00:00:00'
    this.endTimeInit =
      day1.getFullYear() +
      '-' +
      (day1.getMonth() + 1) +
      '-' +
      day1.getDate() +
      ' 23:59:59'
    return {
      dataType: 'ground_data',
      dataClassifyoptions: [],
      rotate: false,
      beginTimeInit: '',
      endTimeInit: '',
      modalOption: {
        flag: null,
        show: false,
        data: null
      },
      elementOptions: [
        {
          elementName: '连续(强)降雨',
          elementCode: '连续(强)降雨'
        },
        {
          elementName: '连续(强)降雪',
          elementCode: '连续(强)降雪'
        },
        {
          elementName: '冻降水',
          elementCode: '冻降水'
        },
        {
          elementName: '雷暴',
          elementCode: '雷暴'
        },
        {
          elementName: '沙(尘)暴',
          elementCode: '沙(尘)暴'
        },
        {
          elementName: '大风',
          elementCode: '大风'
        },
        {
          elementName: '低能见度',
          elementCode: '低能见度'
        },
        {
          elementName: '风切变',
          elementCode: '风切变'
        },
        {
          elementName: '其他',
          elementCode: '其他'
        }
      ],
      provinceValue: '',
      detailstotal: 0,
      airportOptions: [],
      dataClassify: 2,
      tableDetails: [
        { key: 'name', label: '名称' },
        { key: 'value', label: '值' }
      ],
      timeScope: [this.beginTimeInit, this.endTimeInit],
      airport: '',
      valueInput1: '',
      valueInput2: '',
      options: Options.optionsWeatherCase,
      selectID: [],
      downloadID: '',
      details: [],
      is_details: false,
      startDatePicker: this.beginDate(),
      endDatePicker: this.endDate(),
      format: 'xls',
      is_download: false,
      checked: false,
      multipleSelection: [],
      numberOptions: new generalOptions().numberOfPerPage(),
      sortOptions: new generalOptions().listSorting_(),
      is_show: true,
      value: '',
      value1: '',
      value2: '',
      provinceModelOptions: [],
      list: [],
      total: 0,
      dataTypeoptions: [],
      tableMeta: [
        { key: 'timeBegin', label: '开始时间' },
        { key: 'timeEnd', label: '结束时间' },
        { key: 'airportName', label: '机场名称' },
        { key: 'alias', label: '天气个例' },
        { key: 'element', label: '记录要素' },
        { key: 'remark', label: '备注' }
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        sortOrder: 'asc',
        columnName: 'time_begin',
        element: '',
        timeBegin: this.beginTimeInit,
        timeEnd: this.endTimeInit,
        airportCode: ''
      },
      historyQuery: {
        eventTimeBegin: '',
        eventTimeEnd: '',
        pageNum: 1,
        pageSize: 10,
        dataType: this.dataType
      }
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
    }
  },
  created() {
    this.getList()
    getDataTypeClassify().then(response => {
      this.dataClassifyoptions = response.data
    })
    getDataTypes({ type: 2 }).then(response => {
      this.dataTypeoptions = response.data
    })
    // 获取机场信息
    getProvince().then(response => {
      this.provinceModelOptions = response
    })
  },
  methods: {
    // 批量操作
    handleAll(command) {
      const obj = {
        rowKeys: '',
        fileNames: ''
      }
      const objDelete = {
        ids: '',
        rowKeys: ''
      }
      if (this.multipleSelection.length) {
        this.multipleSelection.forEach(item => {
          obj.rowKeys += item.rowKey + ','
          obj.fileNames += item.fileName + ','
          objDelete.ids += item.id + ','
          objDelete.rowKeys += item.rowKey + ','
        })
        obj.rowKeys = obj.rowKeys.substring(0, obj.rowKeys.length - 1)
        obj.fileNames = obj.fileNames.substring(0, obj.fileNames.length - 1)
        objDelete.ids = objDelete.ids.substring(0, objDelete.ids.length - 1)
        objDelete.rowKeys = objDelete.rowKeys.substring(
          0,
          objDelete.rowKeys.length - 1
        )
        if (command === 'download') {
          getHistoryListDownload(obj)
            .then(res => {
              new FileDownload().zipDownload(res.zipURL)
            })
            .catch(() => {
              this.$message.error('下载失败')
            })
        } else {
          getHistoryListDelete(objDelete).finally(res => {
            this.$Message.success('删除成功')
            this.getList()
          })
        }
      }
    },
    dataTypeEvent() {
      this.historyQuery.dataType = this.dataType
      getWeatherCasesHistoryList(this.historyQuery).then(response => {
        this.details = response.data.list
        this.detailstotal = response.data.total
      })
    },
    dataClassifyEvent() {
      this.dataTypeoptions = []
      this.dataType = ''
      getDataTypes({ type: this.dataClassify }).then(response => {
        this.dataTypeoptions = response.data
      })
    },
    renovate() {
      this.rotate = !this.rotate
    },
    provinceClear() {
      this.listQuery.name = ''
    },
    // 机场名称选项选择
    provinceChange() {
      this.airport = ''
      getAirportList({ province: this.provinceValue }).then(res => {
        this.airportOptions = res
        if (this.airportOptions.length) {
          this.airport = this.airportOptions[0].code
        }
      })
    },
    // 清除机场名称选项时触发
    airportClear() {
      this.listQuery.name = ''
    },
    // 批量下载
    handleAllDownload() {
      const obj = {
        rowKeys: '',
        fileNames: ''
      }
      if (this.multipleSelection.length) {
        this.multipleSelection.forEach(item => {
          obj.rowKeys += item.rowKey + ','
          obj.fileNames += item.fileName + ','
        })
        obj.rowKeys = obj.rowKeys.substring(0, obj.rowKeys.length - 1)
        obj.fileNames = obj.fileNames.substring(0, obj.fileNames.length - 1)
        getHistoryListDownload(obj)
          .then(res => {
            new FileDownload().zipDownload(res.zipURL)
          })
          .catch(() => {
            this.$message.error('下载失败')
          })
      }
    },
    // 单个文件下载
    handleDownLoad(d) {
      getHistoryDownload({ rowKey: d.rowKey, fileName: d.fileName })
        .then(res => {
          new FileDownload().zipDownload(res.fileURL)
        })
        .catch(() => {
          this.$message.error('下载失败！')
        })
    },
    handleQuery(row) {
      this.historyQuery.eventTimeBegin = row.timeBegin
      this.historyQuery.eventTimeEnd = row.timeEnd
      this.is_details = !this.is_details
      ;(this.tableDetails = [
        { key: 'table', label: '数据类型', width: 180 },
        { key: 'fileTime', label: '创建时间', width: 180 },
        { key: 'id', label: 'id', width: 220 },
        { key: 'fileName', label: '文件名称' }
      ]),
        (this.listLoading = true)
      this.historyQuery.dataType = 'ground_data'
      getWeatherCasesHistoryList(this.historyQuery).then(response => {
        this.details = response.data.list
        this.detailstotal = response.data.total
      })
    },
    airportChange(val) {
      this.airport = val
    },
    /**
     * 打开编辑/新增模态框
     * @method opendModal
     * @returns {undefined}
     */
    openModal(flag, rowParam) {
      this.modalOption = { show: true, data: rowParam, flag: flag }
    },
    timeChange() {
      this.listQuery.timeBegin = this.timeScope ? this.timeScope[0] : null
      this.listQuery.timeEnd = this.timeScope ? this.timeScope[1] : null
    },
    beginDate() {
      let self = this
      return {
        disabledDate(time) {
          //开始时间不选时，结束时间必须大于开始时间
          if (self.value2) {
            let endTime = new Date(self.value2).valueOf()
            return time && time.valueOf() > endTime
          }
        }
      }
    },
    endDate() {
      let self = this
      return {
        disabledDate(time) {
          //开始时间选中时，结束时间必须大于开始时间
          if (self.value1) {
            let startTime = new Date(self.value1).valueOf()
            return time && time.valueOf() < startTime
          }
        }
      }
    },
    //高级筛选的传值
    areaReceive(val) {
      this.listQuery.area = val
    },
    nameReceive(val) {
      this.listQuery.name = val
    },
    attrReceive(val) {
      this.listQuery.attr = val.toString()
    },
    startTimeReceive(val) {
      const a = new Date(val)
      const beginDate =
        a.getFullYear() +
        '-' +
        this.p(a.getMonth() + 1) +
        '-' +
        this.p(a.getDate())
      const benginTime =
        this.p(a.getHours()) +
        ':' +
        this.p(a.getMinutes()) +
        ':' +
        this.p(a.getSeconds())
      this.listQuery.startTime = beginDate + ' ' + benginTime
    },
    endTimeReceive(val) {
      const b = new Date(val)
      const endDate =
        b.getFullYear() +
        '-' +
        this.p(b.getMonth() + 1) +
        '-' +
        this.p(b.getDate())
      const endTime =
        this.p(b.getHours()) +
        ':' +
        this.p(b.getMinutes()) +
        ':' +
        this.p(b.getSeconds())
      this.listQuery.endTime = endDate + ' ' + endTime
    },
    warningReceive(val) {
      this.listQuery.warning = val
    },
    paginationChange() {
      this.checked = false
      this.getList()
    },
    paginationDetailsChange() {
      this.checked = false
      this.historyQuery.dataType = this.dataType
      getWeatherCasesHistoryList(this.historyQuery).then(response => {
        this.details = response.data.list
        this.detailstotal = response.data.total
      })
    },
    //全选
    checkAll() {
      this.$refs.multipleTables.toggleAllSelection()
    },
    //转换时间格式
    p(s) {
      return s < 10 ? '0' + s : s
    },
    startTimeChange() {
      const d = new Date(this.value1)
      const startDate =
        d.getFullYear() +
        '-' +
        this.p(d.getMonth() + 1) +
        '-' +
        this.p(d.getDate())
      const startTime =
        this.p(d.getHours()) +
        ':' +
        this.p(d.getMinutes()) +
        ':' +
        this.p(d.getSeconds())
      this.listQuery.startTime = startDate + ' ' + startTime
    },
    endTimeChange() {
      const e = new Date(this.value2)
      const endDate =
        e.getFullYear() +
        '-' +
        this.p(e.getMonth() + 1) +
        '-' +
        this.p(e.getDate())
      const endTime =
        this.p(e.getHours()) +
        ':' +
        this.p(e.getMinutes()) +
        ':' +
        this.p(e.getSeconds())
      this.listQuery.endTime = endDate + ' ' + endTime
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.pageNum = 1
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length === this.details.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    //数据详情
    handleDetails(row) {
      this.is_details = !this.is_details
      getWeatherCasesDetail(row.id).then(response => {
        this.details = Object.keys(response.data)
          .filter(key => key !== 'id')
          .map(key => ({ name: key, value: response.data[key] }))
        for (let i = 0; i < Options.optionsWeather.length; i++) {
          for (let j = 0; j < this.details.length; j++) {
            if (this.details[j].name === Options.optionsWeather[i].value) {
              this.details[j].name = Options.optionsWeather[i]['label']
            }
          }
        }
      })
    },
    //删除数据
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            setTimeout(() => {
              getWeatherCasesDelete(row.id)
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
                this.getList()
              }, 300)
            }, 3000)
          } else {
            done()
          }
        }
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    indexMethod(index) {
      return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + 1 + index
    },
    indexDetailMethod(index) {
      return (
        (this.historyQuery.pageNum - 1) * this.historyQuery.pageSize + 1 + index
      )
    },
    //时间转换
    dateFormat(date, format) {
      date = new Date(date)
      var o = {
        'M+': date.getMonth() + 1, //month
        'd+': date.getDate(), //day
        'H+': date.getHours() + 8, //hour+8小时
        'm+': date.getMinutes(), //minute
        's+': date.getSeconds(), //second
        'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      }
      if (o['H+'] >= 24) {
        o['H+'] = o['H+'] - 24
      }
      if (/(y+)/.test(format))
        format = format.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )

      for (var k in o)
        if (new RegExp('(' + k + ')').test(format))
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )

      return format
    },
    dateFormat_(date, format) {
      date = new Date(date)
      var o = {
        'M+': date.getMonth() + 1, //month
        'd+': date.getDate(), //day
        'H+': date.getHours() - 8, //hour+8小时
        'm+': date.getMinutes(), //minute
        's+': date.getSeconds(), //second
        'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      }
      if (o['H+'] < 0) {
        o['H+'] = o['H+'] + 24
        o['d+'] = o['d+'] - 1
      }
      if(o['d+'] === 0){
        o['M+'] = o['M+'] - 1
        o['d+'] = 30
      }
      if (/(y+)/.test(format))
        format = format.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )

      for (var k in o)
        if (new RegExp('(' + k + ')').test(format))
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )

      return format
    },
    //获取数据列表
    getList() {
      this.listLoading = true
      this.listQuery.airportCode = this.airport
      this.listQuery.timeBegin = this.dateFormat_(this.listQuery.timeBegin, 'yyyy-MM-dd HH:mm:ss')
      this.listQuery.timeEnd = this.dateFormat_(this.listQuery.timeEnd, 'yyyy-MM-dd HH:mm:ss')
      getWeatherCasesList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.list.forEach(item => {
          item.timeBegin = this.dateFormat(
            item.timeBegin,
            'yyyy-MM-dd HH:mm:ss'
          )
          item.timeEnd = this.dateFormat(item.timeEnd, 'yyyy-MM-dd HH:mm:ss')
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
.column {
  font-weight: 600;
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
.mailTable {
  padding: 10px;
}
.searchContent {
  border: 1px solid #e4e4e4;
}
.searchContent form.el-form {
  display: flex;
  margin: 10px 10px 10px 10px;
}
.searchContent .el-form-item.el-form-item--medium:nth-child(2) {
  margin: 0px 50px;
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
  display: inline-block;
  float: right;
}
.filterSearch span {
  margin-right: 20px;
}
.downloadFrame label.el-radio {
  display: block;
  text-align: left;
  padding: 20px 0px;
}
.downloadFrame {
  color: #666666;
}
.downloadFrame button.el-button.el-button--success.el-button--medium {
  display: block;
  text-align: center;
  position: absolute;
  bottom: 2px;
  right: 2px;
}
.frameTitle {
  background: #f2f2f2;
  width: 100%;
  line-height: 45px;
  text-align: left;
  color: #666666;
  padding-left: 20px;
  border-bottom: 1px solid #dadada;
  margin-bottom: 18px;
}
.closePic {
  position: absolute;
  top: 10px;
  right: 13px;
  color: #999999;
  cursor: pointer;
}
.downloadFrame {
  width: 315px;
  height: 400px;
  position: absolute;
  right: 430px;
  top: 140px;
  text-align: center;
  background: #fff;
  z-index: 1000;
  border: 1px solid #dadada;
}
.filter-item {
  width: 150px;
}
.operation {
  display: flex;
  padding: 15px;
  border: 1px solid #e4e4e4;
  margin-top: 20px;
}
.operation .el-form-item.el-form-item--medium:nth-child(1) {
  width: 500px;
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