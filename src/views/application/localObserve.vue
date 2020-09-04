<template>
  <div ref="container" class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="数据检索下载" name="first">
        <!-- 筛选查询 -->
        <local-observe-search
          :list="list"
          @subConditionChange="conditonChange"
          @attrChanges="tableMetaChange"
          @searchFilter="handleSearchFilter"
        />
        <!-- 数据列表 -->
        <el-form ref="dataList" class="dataList" :inline="true">
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
          v-loading="listLoading"
          :data="list"
          border
          fit
          stripe
          highlight-current-row
          style="width: 100%;"
        >
          <!-- <el-table-column fixed type="selection" align="center" width="50"></el-table-column> -->
          <el-table-column
            fixed
            type="index"
            align="center"
            label="序号"
            :index="indexMethod"
            width="50"
          ></el-table-column>
          <el-table-column
            v-if="arr.includes(item.key)"
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
            fixed="right"
            width="80"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }" class="tableButtom">
              <el-button type="warning" size="mini" @click="handleDetails(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          style="margin-top: 20px;"
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="paginationChange"
        />
        <el-dialog class="detailsFrame" title="数据详情" :visible.sync="is_details" width="37%">
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
              <el-button @click="elementChange">
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
                <el-form-item label="类型：">
                  <el-select
                    v-model="dataType"
                    style="width:200px;"
                    placeholder="类型"
                    @change="dataTypeChange"
                  >
                    <el-option
                      v-for="item in dataTypeoptions"
                      :key="item.datatypecode"
                      :label="item.datatypename"
                      :value="item.datatypecode"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="要素：">
                  <el-select
                    v-model="element"
                    style="width: 200px;"
                    placeholder="要素"
                    @change="elementChange"
                  >
                    <el-option
                      v-for="item in elementoptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="传感器位置：">
                  <el-select
                    v-model="locationId"
                    style="width:200px;"
                    class="filter-item"
                    @change="elementChange"
                    placeholder="传感器位置"
                  >
                    <el-option
                      v-for="(item,index) in locationIDOptions"
                      :key="index"
                      :label="item.value"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
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
              </div>
            </div>
          </div>
          <el-form-item class="filter-search">
            <i class="el-icon-search" />
            <span>图表</span>
          </el-form-item>
          <div id="main" style="height:630px;margin-top:20px"></div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import GeneralOptions from '@/utils/generalOptions'
import Options from './options'
import attrOptions from './attrOptions'
import Pagination from '@/components/Pagination'
import LocalObserveSearch from './components/localObserveSearch'
import {
  getObservationList,
  getObservationDetail,
  getObservationAttr,
  getObservationFieldInfos,
  getObservationFieldStatus,
  getGraphData
} from '@/api/application'
import moment from 'moment'
import echarts from 'echarts'

export default {
  components: { Pagination, LocalObserveSearch },
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
      rotate: false,
      FieldStatus: [],
      locationIDOptions: [],
      locationId: '05L',
      listLoading: false,
      element: 'mor2a',
      elementoptions: [],
      unfold: true,
      activeName: 'first',
      dataType: 'VIS',
      timeScope: [],
      selectID: [],
      downloadID: '',
      beginTimeInit: '',
      endTimeInit: '',
      details: [],
      is_details: false,
      bulkOperation: '下载',
      format: 'xls',
      is_download: false,
      checked: false,
      multipleSelection: [],
      operationOptions: [
        {
          value: '选项1',
          label: '下载'
        },
        {
          value: '选项2',
          label: '删除',
          disabled: true
        }
      ],
      dataTypeoptions: [],
      numberOptions: new GeneralOptions().numberOfPerPage(),
      sortOptions: new GeneralOptions().listSortingLocal(),
      attrOptions: [],
      is_show: true,
      options: Options.optionsArea,
      value: '',
      value1: '',
      value2: '',
      list: [],
      ifgraphshowChange: [],
      total: 0,
      tableMeta: attrOptions.tableMetaCloud,
      tableDetails: [
        { key: 'name', label: '名称' },
        { key: 'value', label: '值' }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        sort: 'true',
        startTime: this.beginTimeInit,
        endTime: this.endTimeInit,
        attr: 'CLOUD',
        locationId: '05L'
      },
      arr: [],
      ifgraphshow: [],
      windOption: '',
      datavalue: [],
      echartsTitle: '垂直能见度',
      starttime: this.beginTimeInit,
      endtime: this.endTimeInit
    }
  },

  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
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
    this.getList()
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    timeChange() {
      this.starttime = this.timeScope ? this.timeScope[0] : null
      this.endtime = this.timeScope ? this.timeScope[1] : null
    },
    conditonChange() {
      this.getList()
    },
    tableMetaChange(value) {
      if (value === 'HUMITEMP') {
        this.tableMeta = attrOptions.tableMetaHumitemp
      } else if (value === 'CLOUD') {
        this.tableMeta = attrOptions.tableMetaCloud
      } else if (value === 'PRESS') {
        this.tableMeta = attrOptions.tableMetaPress
      } else if (value === 'RAIN') {
        this.tableMeta = attrOptions.tableMetaRain
      } else if (value === 'VIS') {
        this.tableMeta = attrOptions.tableMetaVis
      } else if (value === 'WIND') {
        this.tableMeta = attrOptions.tableMetaWind
      } else if (value === 'PW') {
        this.tableMeta = attrOptions.tableMetaPw
      } else if (value === 'PV') {
        this.tableMeta = attrOptions.tableMetaPv
      } else if (value === 'RWYLIGHTS') {
        this.tableMeta = attrOptions.tableMetaRwylights
      } else {
        this.tableMeta = attrOptions.tableMetaRosa
      }
    },
    // 曲线绘制图切换
    elementChange() {
      this.rotate = !this.rotate
      this.FieldStatus = []
      // 点击要素选项并修改状态(ifgraphshow)为1
      this.ifgraphshow = this.elementoptions.filter(
        item => item.key === this.element
      )
      if (this.ifgraphshow.length) {
        this.ifgraphshow[0].ifgraphshow = '1'
        this.FieldStatus.push({
          id: this.ifgraphshow[0].id,
          ifgraphshow: this.ifgraphshow[0].ifgraphshow,
          ifshow: this.ifgraphshow[0].ifshow
        })
      }
      // 将同一类型下的其他要素(ifgraphshow)置为0
      this.ifgraphshowChange = this.elementoptions.filter(
        item => item.ifgraphshow === '1'
      )
      this.ifgraphshowChange.forEach(item => {
        if (item.key !== this.element) {
          item.ifgraphshow = '0'
          this.FieldStatus.push({
            id: item.id,
            ifgraphshow: item.ifgraphshow,
            ifshow: item.ifshow
          })
        }
      })
      getObservationFieldStatus(this.FieldStatus).then(res => {})
      // 请求绘制曲线数据
      getGraphData({
        starttime: this.starttime,
        endtime: this.endtime,
        type: this.dataType,
        locationId: this.locationId
      }).then(res => {
        this.datavalue = []
        res.data.datavalue.forEach((item, index) => {
          this.datavalue.push([res.data.datatime[index], item])
        })
        this.echartsTitle = this.elementoptions.filter(
          item => item.key === this.element
        )
        if (this.echartsTitle.length) {
          this.echartsTitle = this.echartsTitle[0].label
        }
        this.windOption = {
          title: {
            text: this.locationId + '  '+ this.echartsTitle,
            left: 'center',
            textStyle: {
              color: '#000',
              fontSize: 16
            }
          },
          backgroundColor: '#fff',
          xAxis: {
            type: 'time',
            name: '日期',
            nameGap: 16,
            min: this.starttime,
            max: this.endtime,
            nameTextStyle: {
              color: '#fff',
              fontSize: 16
            },
            axisLine: {
              lineStyle: {
                color: '#000'
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '值'
          },
          series: [
            {
              data: this.datavalue,
              type: 'scatter',
              smooth: true
            }
          ]
        }
        this.$nextTick(() => {
          this.chart = echarts.init(document.getElementById('main'))
          this.chart.setOption(this.windOption)
        })
      })
    },
    // 曲线绘制切换类型
    dataTypeChange() {
      // debugger
      this.elementoptions = []
      this.element = ''
      // this.handleSearchFilter()
      getObservationFieldInfos({
        classify: 'socket',
        type: this.dataType
      }).then(res => {
        res.data.forEach(ix => {
          if (ix.ifgraph === '1') {
            this.elementoptions.push({
              key: ix.fieldcode,
              label: ix.fieldname,
              id: ix.id,
              ifgraphshow: ix.ifgraphshow,
              ifshow: ix.ifshow
            })
          }
        })
      })
    },
    handleUnfold() {
      this.unfold = !this.unfold
    },
    // tab页面切换
    handleClick(tab, event) {
      getObservationAttr().then(res => {
        this.dataTypeoptions = res.data
      })
      this.elementChange()
    },
    handleSearchFilter(obj, val) {
      this.locationIDOptions = val
      this.listQuery = { ...this.listQuery, ...obj }
      this.getList(obj)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 数据详情
    handleDetails(row) {
      this.is_details = !this.is_details
      getObservationDetail({
        collectionName: this.listQuery.attr,
        id: row.id
      }).then(response => {
        this.details = Object.keys(response.data)
          .filter(key => key !== 'id')
          .map(key => ({ name: key, value: response.data[key] }))
        for (let i = 0; i < attrOptions.optionsCloud.length; i++) {
          for (let j = 0; j < this.details.length; j++) {
            if (this.details[j].name === attrOptions.optionsCloud[i].value) {
              this.details[j].name = attrOptions.optionsCloud[i]['label']
            }
          }
        }
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    // 获取数据列表
    getList() {
      // debugger
      this.listLoading = true
      getObservationList(this.listQuery)
        .then(response => {
          if (response.data) {
            this.list = response.data.list
            this.total = response.data.totalNum
            // 保留字段数据小数点后三位
            this.list.forEach(item => {
              item.vpins ? (item.vpins = item.vpins.toFixed(3)) : ''
              item.qfex ? (item.qfex = item.qfex.toFixed(3)) : ''
              item.qfeins ? (item.qfeins = item.qfeins.toFixed(3)) : ''
              item.qffins ? (item.qffins = item.qffins.toFixed(3)) : ''
              item.ta10m ? (item.ta10m = item.ta10m.toFixed(3)) : ''
              item.tdins ? (item.tdins = item.tdins.toFixed(3)) : ''
              item.rhins ? (item.rhins = item.rhins.toFixed(3)) : ''
              item.tains ? (item.tains = item.tains.toFixed(3)) : ''
              item.ta1ha ? (item.ta1ha = item.ta1ha.toFixed(3)) : ''
              item.qfem ? (item.qfem = item.qfem.toFixed(3)) : ''
              item.qfesynop3h
                ? (item.qfesynop3h = item.qfesynop3h.toFixed(3))
                : ''
              item.pains ? (item.pains = item.pains.toFixed(3)) : ''
              item.qnhins ? (item.qnhins = item.qnhins.toFixed(3)) : ''
              item.sum_ins ? (item.sum_ins = item.sum_ins.toFixed(3)) : ''
              item.vis ? (item.vis = item.vis.toFixed(3)) : ''
              item.vis1a ? (item.vis1a = item.vis1a.toFixed(3)) : ''
              item.ws10a ? (item.ws10a = item.ws10a.toFixed(3)) : ''
              item.cw2a ? (item.cw2a = item.cw2a.toFixed(3)) : ''
              item.hw2a ? (item.hw2a = item.hw2a.toFixed(3)) : ''
              item.wsins ? (item.wsins = item.wsins.toFixed(3)) : ''
              item.ws2x ? (item.ws2x = item.ws2x.toFixed(3)) : ''
              item.wdins ? (item.wdins = item.wdins.toFixed(3)) : ''
              item.ws2a ? (item.ws2a = item.ws2a.toFixed(3)) : ''
              item.rawvis ? (item.rawvis = item.rawvis.toFixed(3)) : ''
            })
          }
          return getObservationFieldInfos({
            classify: 'socket',
            type: this.dataType
          }).then(res => {
            // this.tableMeta = []
            this.arr = []
            res.data.forEach(ix => {
              if (this.list[0]) {
                Object.keys(this.list[0]).forEach(item => {
                  this.arr.push(item)
                  this.arr = [...new Set(this.arr)]
                  if (ix.ifgraph === '1') {
                    this.elementoptions.push({
                      key: ix.fieldcode,
                      label: ix.fieldname,
                      id: ix.id,
                      ifgraphshow: ix.ifgraphshow,
                      ifshow: ix.ifshow
                    })
                  }
                })
              }
            })
            // 数组去重
            let obj = {}
            this.elementoptions = this.elementoptions.reduce((cur, next) => {
              obj[next.key] ? '' : (obj[next.key] = true && cur.push(next))
              return cur
            }, []) // 设置cur默认类型为数组，并且初始值为空的数组
          })
        })
        .finally(res => (this.listLoading = false))
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
.el-icon-search {
  margin-right: 5px;
}
.app-container {
  color: #666666;
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
.filter-search span {
  margin-right: 20px;
}
.search-list {
  width: 100%;
  height: 60px;
  overflow: hidden;
  border: 1px solid #e4e4e4;
  border-top: 0px;
  border-bottom: 0px;
  padding: 0;
  transition: all 0.3s;
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
        min-width: 293px;
      }
      & > div:nth-child(2) {
        flex: 0.25;
        min-width: 280px;
      }
      & > div:nth-child(3) {
        flex: 0.25;
        min-width: 320px;
      }
    }
  }
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
