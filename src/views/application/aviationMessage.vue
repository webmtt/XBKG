<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="数据检索下载" name="first">
        <!-- 筛选查询 -->
        <aviation-search
          :list="list"
          :handle-filter="handleFilter"
          @searchTablemeta="searchTablemeta"
          @searchFilter="handleSearchFilter"
        />
        <!-- 数据列表 -->
        <el-form class="dataList" :inline="true">
          <el-form-item>
            <i class="el-icon-edit"></i>
            <span>数据列表</span>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="listQuery.limit"
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
              v-model="listQuery.sort"
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
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            v-if="arr.includes(item.key)"
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
              <el-dropdown :trigger="'click'" type="success" @command="handledCommand">
                <el-button type="success" size="mini" @click="handleDownLoad(row)">
                  下载
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in downloadOptions"
                    :key="item.label"
                    :command="item.label"
                  >{{ item.value }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="warning" size="mini" @click="handleDetails(row)">详情</el-button>
              <el-button
                type="danger"
                style="margin-left: 0"
                size="mini"
                @click="handleDelete(row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form class="operation">
          <el-form-item>
            <el-checkbox v-model="checked" @change="checkAll">全选</el-checkbox>
            <!-- <el-button
              style="margin-left:10px"
              :disabled="!multipleSelection.length"
              @click="bulkOperations"
            >确定</el-button>-->
            <el-dropdown
              style="margin-left:10px"
              :trigger="'click'"
              type="warning"
              @command="handleAllDownload"
            >
              <el-button :disabled="!multipleSelection.length" type="success" size="mini">
                批量下载
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :disabled="!multipleSelection.length" command="grib">grib格式</el-dropdown-item> -->
                <el-dropdown-item :disabled="!multipleSelection.length" command="csv">csv格式</el-dropdown-item>
                <el-dropdown-item :disabled="!multipleSelection.length" command="xls">xls格式</el-dropdown-item>
                <el-dropdown-item :disabled="!multipleSelection.length" command="txt">报文格式</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              :disabled="!multipleSelection.length"
              type="danger"
              @click="batchDelete"
              size="mini"
            >批量删除</el-button>
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
        <el-dialog title="数据详情" :visible.sync="is_details" width="37%">
          <el-table :data="details" border style="width: 100%;height:400px;overflow:auto;">
            <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
            <el-table-column
              v-for="(item, index) in tableDetails"
              :key="index"
              align="center"
              :prop="item.key"
              :label="item.label"
              :width="item.width"
            />
          </el-table>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="曲线绘制" name="second">
        <el-form>
          <el-form-item class="filter-search">
            <i class="el-icon-search" />
            <span>筛选查询</span>
            <div>
              <span @click="handleUnfold">
                <i :class="unfold ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
                <span>{{ word }}</span>
              </span>
              <el-button type="success" @click="handleSearchFilterDraw">
                查询结果
                <i
                  @click="renovate"
                  style="    position: absolute;right:5x;"
                  :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
                ></i>
              </el-button>
            </div>
          </el-form-item>
          <!-- <div ref="searchList" class="search-list" :class="{ active: unfold }"> -->
          <div v-show="unfold" ref="searchList" class="search-list">
            <div>
              <div class="search-line">
                <el-form-item label="数据类型：">
                  <el-select
                    v-model="dataType"
                    style="width: 100px;"
                    placeholder="数据类型"
                    @change="dataTypeChange"
                  >
                    <el-option
                      v-for="item in dataTypeoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="min-width: 269px;" v-if="dataType==='msg'">
                  <el-form-item>
                    <span>起止经度：</span>
                    <el-input style="width:70px;" v-model="leftLon"></el-input>
                    <i class="el-icon-arrow-right"></i>
                    <el-input style="width:70px;" v-model="rightLon"></el-input>
                  </el-form-item>
                </el-form-item>
                <el-form-item style="margin-right:30px;" v-if="dataType==='msg'">
                  <el-form-item>
                    <span>起止纬度：</span>
                    <el-input style="width:70px;" v-model="downLat"></el-input>
                    <i class="el-icon-arrow-right"></i>
                    <el-input style="width:70px;" v-model="upLat"></el-input>
                  </el-form-item>
                </el-form-item>
                <el-form-item style="margin-right:30px;" v-if="dataType==='msg'">
                  <el-form-item>
                    <span>高度：</span>
                    <el-input style="width:70px;" v-model="highDown"></el-input>
                    <i class="el-icon-arrow-right"></i>
                    <el-input style="width:70px;" v-model="highUp"></el-input>
                  </el-form-item>
                </el-form-item>
                <el-form-item style="width:180px;" label="要素：">
                  <el-select
                    v-model="element"
                    style="width: 110px;"
                    placeholder="要素"
                    @change="elementChange"
                  >
                    <el-option
                      v-for="item in elementoptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="dataType==='awos'" style="width:223px;" label="跑道编号：">
                  <el-select
                    v-model="runaway"
                    style="width: 110px;"
                    placeholder="跑道编号"
                    @change="elementChange"
                  >
                    <el-option
                      v-for="item in runwayOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="dataType!=='msg'" class="airportClass" label="机场名称：">
                  <el-select
                    filterable
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
                    filterable
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
                      :value="item.airportName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="search-line">
                <el-form-item label="日期范围：" style="min-width:500px;">
                  <el-date-picker
                    :clearable="false"
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
              </div>
            </div>
          </div>
          <el-form-item class="filter-search">
            <i class="el-icon-search" />
            <span>图表</span>
          </el-form-item>
          <div id="main" style="height:650px;"></div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import GeneralOptions from '@/utils/generalOptions'
import ToolLibrary from '@/utils/toolLibrary'
import FileDownload from '@/utils/fileDownload'
import { getProvince, getAirportList } from '@/api/application'
import moment from 'moment'

import Options from './options'
import OptionsPiece from './3DEcharts'

import Pagination from '@/components/Pagination'
import AviationSearch from './components/aviationSearch'
import {
  getMessageList,
  getMessageDetail,
  getMessageDelete,
  getMessageDownload,
  getReportList,
  getWeatherDraw
} from '@/api/application'
import city from '@/utils/province'
import echarts from 'echarts'
import echartsGL from 'echarts-gl'
import airport from '@/utils/airport'
import OptionsDatas from './components/localConfig'

export default {
  components: { Pagination, AviationSearch },
  props: {
    fatherHeight: {
      type: Number,
      default: 0
    }
  },
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
      runaway: '01',
      highUp: '',
      datavalue: [],
      highDown: '',
      leftLon: '',
      upLat: '',
      rightLon: '',
      downLat: '',
      rotate: false,
      datavalueWeather: [],
      unfold: true,
      activeName: 'first',
      provinceModel: {
        options: city.features.map(item => item.properties),
        checkItem: null,
        value: ''
      },
      airportModel: {
        options: [],
        checkItem: null,
        value: ''
      },
      tableDetails: [
        { key: 'name', label: '名称' },
        { key: 'value', label: '值' }
      ],
      downloadDetailIds: [],
      downloadOptions: [
        //  下载配置项
        {
          label: 'csv',
          value: 'csv格式'
        },
        {
          label: 'xls',
          value: 'xls格式'
        },
        {
          label: 'txt',
          value: '报文格式'
        }
      ],
      timeScope: [],
      selectID: [],
      downloadID: '',
      details: [],
      is_details: false,
      bulkOperation: '下载',
      format: 'xls',
      is_download: false,
      frameShow: false,
      checked: false,
      multipleSelection: [],
      numberOptions: new GeneralOptions().numberOfPerPage(),
      sortOptions: new GeneralOptions().listSorting(),
      options: Options.optionsAirport,
      dataTypeoptions: [
        {
          value: 'FC',
          label: 'FC'
        },
        {
          value: 'FT',
          label: 'FT'
        },
        {
          value: 'SA',
          label: 'SA'
        },
        {
          value: 'SP',
          label: 'SP'
        },
        {
          value: 'WS',
          label: 'WS'
        },
        {
          value: 'msg',
          label: 'UD'
        },
        {
          value: 'awos',
          label: 'awos'
        }
      ],
      datasOptions: [],
      arr: [],
      provinceModelOptions: [],
      element: 'Td',
      elementoptions: [],
      runwayOptions: [
        { name: '01', code: '01' },
        { name: '02', code: '02' },
        { name: '03', code: '03' }
      ],
      provinceValue: '陕西省',
      airportOptions: [],
      value: '',
      value1: '',
      value2: '',
      list: [],
      beginTimeInit: '',
      endTimeInit: '',
      total: 0,
      tableMeta: [],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        area: '',
        startTime: this.beginTimeInit,
        endTime: this.endTimeInit,
        attr: '',
        warning: '',
        dataType: 'awos',
        columns: ''
      },
      chart: null,
      dataType: 'SA',
      columns: [],
      windOption: '',
      echartsTitle: '气温',
      startTime: this.beginTimeInit,
      endTime: this.endTimeInit,
      airport: '西安咸阳国际机场',
      weatherValue: [],
      deleteIds: [],
      piecesValue: [],
      rightLonValue: '',
      highUpValue: '',
      upLatValue: '',
      leftLonValue: '',
      downUpValue: '',
      downLatValue: '',
    }
  },
  computed: {
    word() {
      if (this.unfold === false) {
        return '展开筛选'
      } else if (this.unfold === true) {
        return '收起筛选'
      } else if (this.unfold === '') {
        return null
      }
      return null
    }
  },

  created() {
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
    this.timeScope = [this.beginTimeInit, this.endTimeInit]
    this.listQuery.province = '陕西省'
    this.listQuery.name = '西安咸阳国际机场'
    this.getList()
  },
  methods: {
    //批量下载
    handleAllDownload(d) {
      this.downloadDetailIds = []
      this.multipleSelection.map(item => {
        this.downloadDetailIds.push(item.id)
      })
      this.handledCommand(d)
    },
    // 批量删除
    batchDelete() {
      this.deleteIds = []
      this.multipleSelection.map(item => {
        this.deleteIds.push(item.id)
      })
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            setTimeout(() => {
              getMessageDelete({
                ids: this.deleteIds,
                dataType: this.listQuery.dataType
              })
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
              this.getList()
            }, 3000)
          } else {
            done()
          }
        }
      })
        .then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: 'info',
            message: '已取消删除'
          })
        })
      this.checked = false
    },
    renovate() {
      this.rotate = !this.rotate
    },
    elementChange() {
      this.echartsTitle = this.elementoptions.filter(
        item => item.code === this.element
      )
      if (this.echartsTitle.length) {
        this.echartsTitle = this.echartsTitle[0].name
      }
      if (this.dataType !== 'awos') {
        this.runaway = ''
      }
      if (this.dataType !== 'msg') {
        this.highUp = ''
        this.highDown = ''
        this.leftLon = ''
        this.rightLon = ''
        this.upLat = ''
        this.downLat = ''
      }
      getWeatherDraw({
        attr: this.element,
        startTime: this.startTime,
        endTime: this.endTime,
        type: this.dataType,
        airport: this.airport,
        runaway: this.runaway,
        highUp: this.highUp,
        highDown: this.highDown,
        leftLon: this.leftLon,
        rightLon: this.rightLon,
        upLat: this.upLat,
        downLat: this.downLat
      }).then(res => {
        this.datavalue = []
        this.weatherValue = []
        this.datavalueWeather = []
        this.windOption = {}
        if (res.data && this.dataType !== 'msg') {
          res.data.forEach(item => {
            this.weatherValue.push(item[1])
            this.datavalue.push([
              item[0].substr(0, item[0].length - 1),
              item[1]
            ])
          })
          this.weatherValue = [...new Set(this.weatherValue)]
        }
        if (
          this.echartsTitle.indexOf('风向') != -1 &&
          this.dataType !== 'msg'
        ) {
          this.windOption = {
            title: {
              text: this.echartsTitle,

              textStyle: {
                color: '#000',
                fontSize: 16
              }
            },
            backgroundColor: '#fff',
            xAxis: {
              type: 'time',
              min: this.startTime,
              max: this.endTime
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                symbolSize: 20,
                data: this.datavalue,
                type: 'scatter'
              }
            ]
          }
        } else if (this.element === 'ww') {
          this.windOption = {
            title: {
              text: '天气现象-散点图',
              textStyle: {
                color: '#000',
                fontSize: 16
              }
            },
            backgroundColor: '#fff',
            color: ['#dd4444', '#fec42c', '#80F1BE'],
            legend: {
              top: 10,
              data: this.weatherValue,
              textStyle: {
                color: '#000',
                fontSize: 16
              }
            },
            grid: {
              left: '10%',
              right: 150,
              top: '18%',
              bottom: '10%'
            },
            xAxis: {
              type: 'time',
              name: '日期',
              nameGap: 16,
              nameTextStyle: {
                color: '#000',
                fontSize: 14
              },
              min: this.startTime,
              max: this.endTime,
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#000'
                }
              }
            },
            yAxis: {
              type: 'category',
              name: '天气现象',
              inverse: true,
              data: this.weatherValue,
              nameLocation: 'start',
              nameGap: 20,
              nameTextStyle: {
                color: '#000',
                fontSize: 16
              },
              axisLine: {
                lineStyle: {
                  color: '#000'
                }
              },
              splitLine: {
                show: false
              }
            },
            series: [
              {
                name: 'Sunny',
                type: 'scatter',
                data: this.datavalue
              }
            ]
          }
        } else if (this.dataType === 'msg') {
          var data = res.data
          if (data !== null) {
            data.unshift(['lat', 'lon', 'high', 'colorMax', 'symbolSizeMax'])
            if (this.element === 'ddd') {
              this.piecesValue = OptionsPiece.dddPiecesValue
            } else if (this.element === 'SSTTT') {
              this.piecesValue = OptionsPiece.SSTTTPiecesValue
            } else if(this.element === 'fff'){
              this.piecesValue = OptionsPiece.fffPiecesValue
            }else {
              this.piecesValue = OptionsPiece.otherPiecesValue
            }
            this.rightLon === ''?this.rightLonValue = '180' : this.rightLonValue = this.rightLon
            this.upLat === ''?this.upLatValue = '90' : this.upLatValue = this.upLat
            this.highUp === ''?this.highUpValue = '20000' : this.highUpValue = this.highUp
            this.leftLon === ''?this.leftLonValue = '0' : this.leftLonValue = this.leftLon
            this.downLat === ''?this.downLatValue = '0' : this.downLatValue = this.downLat
            this.highDown === ''?this.downUpValue = '0' : this.downUpValue = this.highDown
            this.windOption = {
              visualMap: [
                {
                  type: 'piecewise',
                  top: 10,
                  calculable: true,
                  dimension: 4,
                  max: 9,
                  textStyle: {
                    color: '#f0f'
                  },
                  pieces: this.piecesValue
                },
                {
                  show: false,
                  bottom: 10,
                  calculable: true,
                  dimension: 4,
                  max: 10 / 2,
                  inRange: {
                    symbolSize: 15
                  },
                  textStyle: {
                    color: '#f0f'
                  }
                }
              ],
              grid3D: {},
              yAxis3D: {
                name: '经度',
                min: this.leftLonValue,
                max: this.rightLonValue
              },
              xAxis3D: {
                name: '纬度',
                min: this.downLatValue,
                max: this.upLatValue
              },
              zAxis3D: {
                name: '高度',
                min: this.downUpValue,
                max: this.highUpValue
              },
              dataset: {
                dimensions: [
                  'Income',
                  'Life Expectancy',
                  'Population',
                  'Country',
                  { name: 'Year', type: 'ordinal' }
                ],
                source: data
              },
              series: [
                {
                  type: 'scatter3D',
                  symbolSize: 2.5,
                  encode: {
                    x: 'lon',
                    y: 'lat',
                    z: 'high',
                    tooltip: [0, 1, 2, 3, 4]
                  }
                }
              ]
            }
          }
        } else {
          this.windOption = {
            title: {
              text: this.echartsTitle,
              textStyle: {
                color: '#000',
                fontSize: 16
              }
            },
            backgroundColor: '#fff',
            xAxis: {
              type: 'time',
              boundaryGap: false,
              name: '日期',
              min: this.startTime,
              max: this.endTime
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: this.datavalue,
                type: 'line'
              }
            ]
          }
        }
        this.$nextTick(() => {
          this.chart = echarts.init(document.getElementById('main'))
          this.chart.clear()
          this.chart.setOption(this.windOption)
        })
      })
    },
    dataTypeChange() {
      this.element = ''
      getReportList({ type: this.dataType }).then(res => {
        this.elementoptions = res.data
      })
    },
    handleClick(tab, event) {
      // 获取要素列表
      getReportList({ type: this.dataType }).then(res => {
        this.elementoptions = res.data
      })
      // 获取机场信息
      getProvince().then(response => {
        this.provinceModelOptions = response
      })
      // 初始默认绘画图表
      this.elementChange()
    },
    // 检索
    handleSearchFilter(obj) {
      this.elementChange()
      this.listQuery = { ...this.listQuery, ...obj }
      if (this.listQuery.dataType === 'msg') {
        this.listQuery.province = ''
        this.listQuery.name = ''
      } else {
        this.listQuery.highDown = ''
        this.listQuery.highUp = ''
        this.listQuery.leftLon = ''
        this.listQuery.rightLon = ''
        this.listQuery.downLat = ''
        this.listQuery.upLat = ''
      }
      this.getList(obj)
    },
    // 检索
    handleSearchFilterDraw(obj) {
      this.rotate = !this.rotate
      this.elementChange()
    },
    // 动态表头
    searchTablemeta(value) {
      this.tableMeta = []
      this.tableMeta = value
      this.tableMeta[0].width = '160px'
      this.tableMeta[1].width = '160px'
    },
    // 清除机场名称选项时触发
    airportClear() {
      this.listQuery.name = ''
    },
    provinceClear() {
      this.listQuery.name = ''
    },
    // 机场名称选项选择
    provinceChange() {
      this.airport = ''
      getAirportList({ province: this.provinceValue }).then(res => {
        this.airportOptions = res
      })
    },
    airportChange(val) {
      this.airport = val
    },
    // 批量下载
    bulkOperations() {
      this.listLoading = true
      this.listLoading = true
      this.format = 'xls'
      getMessageDownload({
        // responseType: 'blob',
        ids: this.selectID,
        type: this.format,
        dataType: this.listQuery.dataType
      }).then(response => {
        if (response.headers['content-disposition']) {
          const filename = ToolLibrary.h_spliceStr(
            response.headers['content-disposition'],
            'filename=',
            1
          )
          new FileDownload().fileBlodDownload(
            decodeURIComponent(escape(filename)),
            response.data
          )
        } else {
          this.$message({
            showClose: true,
            message: '下载失败',
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
    },
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    // 全选
    checkAll() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    // 转换时间格式
    p(s) {
      return s < 10 ? '0' + s : s
    },
    timeChange() {
      this.startTime = this.timeScope ? this.timeScope[0] : null
      this.endTime = this.timeScope ? this.timeScope[1] : null
    },
    handleUnfold() {
      this.unfold = !this.unfold
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectID = this.multipleSelection.map(item => item.id)
    },
    // 点击下载数据获取当前全部详细信息
    handleDownLoad(row) {
      this.downloadDetailIds = []
      this.downloadDetailIds.push(row.id)
    },
    // 选取下载格式并下载
    handledCommand(d) {
      const fileName = moment(new Date().getTime()).format(
        'YYYY-MM-DD hh:mm:ss'
      )
      this.listLoading = true
      getMessageDownload({
        responseType: 'blob',
        ids: this.downloadDetailIds,
        type: d,
        dataType: this.listQuery.dataType
      }).then(response => {
        // if (response.headers['content-disposition']) {
        //   const filename = ToolLibrary.h_spliceStr(
        //     response.headers['content-disposition'],
        //     'filename=',
        //     1
        //   )
        //   console.log(filename)
        //   console.log(decodeURIComponent(escape(filename)))
        new FileDownload().fileBlodDownload(
          // decodeURIComponent(escape(filename)),
          fileName + '.' + d,
          response.data
        )
        // } else {
        //   this.$message({
        //     showClose: true,
        //     message: '下载失败',
        //     type: 'error',
        //     duration: 3 * 1000
        //   })
        // }
        this.listLoading = false
      })
    },
    // 数据详情
    handleDetails(row) {
      this.is_details = !this.is_details
      getMessageDetail({ id: row.id, dataType: this.listQuery.dataType }).then(
        response => {
          this.details = Object.keys(response.data)
            .filter(key => key !== 'id')
            .map(key => ({ name: key, value: response.data[key] }))
          if (this.listQuery.dataType === 'cac') {
            for (let i = 0; i < Options.optionsCac.length; i++) {
              for (let j = 0; j < this.details.length; j++) {
                if (this.details[j].name === Options.optionsCac[i].value) {
                  this.details[j].name = Options.optionsCac[i].label
                }
              }
            }
          } else {
            for (let i = 0; i < Options.optionsMsg.length; i++) {
              for (let j = 0; j < this.details.length; j++) {
                if (this.details[j].name === Options.optionsMsg[i].value) {
                  this.details[j].name = Options.optionsMsg[i].label
                }
              }
            }
          }
        }
      )
    },
    // 删除数据
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            setTimeout(() => {
              getMessageDelete({
                ids: [row.id],
                dataType: this.listQuery.dataType
              })
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
              this.getList()
            }, 3000)
          } else {
            done()
          }
        }
      })
        .then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      getMessageList(ToolLibrary.h_clearObjNull(this.listQuery)).then(
        response => {
          this.list = response.data.list
          if (!this.list.length) {
            this.$Message.info(`返回数据为空`)
          }
          this.arr = []
          if (this.listQuery.dataType === 'msg') {
            this.datasOptions = OptionsDatas.datasmsg
          } else if (this.listQuery.dataType === 'cac') {
            this.list.forEach(
              item =>
                (item.YYGGggZ = moment(this.list[0].YYGGggZ, 'YYYYMMDD').format(
                  'YYYY-MM-DD hh:mm:ss'
                ))
            )
            this.datasOptions = OptionsDatas.datascac
          } else {
            this.datasOptions = OptionsDatas.datasawos
          }
          this.datasOptions.forEach(ix => {
            if (this.list[0]) {
              Object.keys(this.list[0]).forEach(item => {
                this.arr.push(item)
                this.arr = [...new Set(this.arr)]
              })
            }
          })
          this.total = response.data.total
        }
      )
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
form.el-form.searchContent {
  padding: 10px;
}
.searchContent .el-form-item.el-form-item--medium:nth-child(2) {
  margin: 0px 27px;
}
.searchContent div {
  display: inline-block;
}
.active {
  opacity: 1;
  height: 60px;
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
.filter-search {
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
  margin-bottom: 0;
  div > span {
    cursor: pointer;
  }
}
.filter-search div {
  float: right;
}
.search-list {
  width: 100%;
  height: 120px;
  overflow: hidden;
  border: 1px solid #e4e4e4;
  padding: 0;
  transition: all 0.3s;
  border-top: 0px;
  border-bottom: 0px;
  -webkit-transition: all 0.3s; /* Safari */
  // opacity: 0;
  & > div {
    padding: 0 10px;
    width: 100%;
    .search-line {
      height: 60px;
      padding-top: 12px;
      box-sizing: border-box;
      display: flex;
      & > div:nth-child(1) {
        flex: 0.25;
        min-width: 218px;
      }
      & > div:nth-child(2) {
        flex: 0.25;
        min-width: 198px;
      }
    }
  }
}
.filter-search span {
  margin-right: 20px;
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
