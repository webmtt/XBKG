<template>
  <div class="search-filter">
    <el-form>
      <el-form-item class="filter-search">
        <i class="el-icon-search" />
        <span>筛选查询</span>
        <div>
          <span @click="handleUnfold">
            <i :class="unfold ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
            <span>{{ word }}</span>
          </span>
          <el-button @click="handleSearchFilter">
            查询结果
            <i
              @click="renovate"
              style="    position: absolute;right:5x;"
              :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
            ></i>
          </el-button>
          <!-- <el-button @click="handleFilterDetail">高级检索</el-button> -->
        </div>
      </el-form-item>
      <div ref="searchList" class="search-list" :class="{ active: unfold }">
        <div>
          <div class="search-line">
            <el-form-item>
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
            <el-form-item>
              <el-select
                @change="dataTypeEvent"
                style="width: 200px;"
                v-model="type"
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
            <el-form-item label="日期范围：" style="min-width:482px;">
              <el-date-picker
                style="width:360px;"
                v-model="timeScope"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format
              />
            </el-form-item>
          </div>
          <div class="search-line">
            <el-form-item v-show="ifShow">
              <span>{{showName}}</span>
              <el-select
                collapse-tags
                filterable
                :filter-method="searchBlur"
                multiple
                style="width: 160px;"
                v-model="dataValue"
                ref="select"
                @blur.native.capture="blurEvent()"
              >
                <el-option
                  v-for="item in dataOptions"
                  :key="item.typename"
                  :label="item.typename"
                  :value="item.typecode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="ifPathShow">
              <span>路径属性：</span>
              <el-select style="width: 150px;" v-model="dataPathValue">
                <el-option
                  v-for="(item,index) in dataPathOptions"
                  :key="index"
                  :label="item.typename"
                  :value="item.typecode"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <el-dialog title="高级检索" :visible.sync="dialogFormVisible">
      <el-form style="width:700px; margin: 0 auto">
        <div class="serarch-inline-detail"></div>
        <div class="serarch-inline-detail">
          <el-form-item label="选择类型：">
            <el-select v-model="type" placeholder="类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="serarch-inline-detail">
          <el-form-item label="日期范围：">
            <el-date-picker
              v-model="timeScope"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEmitFilter">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Options from './optionsConfig'
import {
  getDataTypes,
  getDataTypeClassify,
  getTypepath,
  getAirportCode,
  getRadarcode
} from '@/api/collection'
import { getDirList } from '@/api/forecastData'
export default {
  name: 'HistorySearch',
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
      beginTimeInit: '',
      endTimeInit: '',
      ifShow: false,
      dataPathOptions: [],
      ifPathShow: false,
      showName: '',
      dataPathValue: '',
      dataOptions: [],
      dataTypeoptions: [],
      dataClassifyoptions: [],
      dataValue: '',
      dataClassify: 2,
      type: 'ground_data', // 文件类型
      typeOptions: new Options().historyData('type'),
      timeScope: [this.beginTimeInit, this.endTimeInit], // 时间区间
      unfold: true,
      dialogFormVisible: false,
      pathOptions: [],
      searchBlurValue: ''
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
    getDataTypeClassify().then(response => {
      this.dataClassifyoptions = response.data.filter(
        item => item.typename !== '咸阳机场自观'
      )
    })
    getDataTypes({ type: 2 }).then(response => {
      this.dataTypeoptions = response.data
    })
    this.handleEmitFilter()
  },
  methods: {
    blurEvent(){
      if(this.searchBlurValue){
        this.dataValue.push(this.searchBlurValue)
      }
    },
    searchBlur(val) {
      this.searchBlurValue = val
    },
    renovate() {
      this.rotate = !this.rotate
    },
    dataClassifyEvent() {
      // debugger
      this.ifPathShow = false
      this.type = ''
      this.dataOptions = []
      this.dataPathOptions = []
      if (this.dataClassify === 4) {
        this.type = 'wafs'
        this.ifShow = false
        this.ifPathShow = true
        getTypepath({ dataTypeCode: this.type }).then(res => {
          res.data.forEach(item => {
            this.dataPathOptions.push({
              typecode: item.directory,
              typename: item.directory
            })
          })
        })
      } else if (this.dataClassify === 3) {
        this.type = 'oradata'
        this.ifPathShow = false
        this.ifShow = true
        this.showName = '雷达编号：'
        getRadarcode({ dataTypeCode: 'oradata' }).then(res => {
          res.data.forEach(item => {
            this.dataOptions.push({
              typecode: item.fieldcode,
              typename: item.fieldname
            })
          })
        })
      } else if (this.dataClassify === 6) {
        this.ifShow = true
        this.type = 'FB'
        this.showName = '机场名称：'
        getAirportCode().then(res => {
          res.data.forEach(item => {
            this.dataOptions.push({
              typecode: item.code,
              typename: item.airportName
            })
          })
        })
      } else {
        this.ifShow = false
      }
      // 初始化类型选择默认值
      if (this.dataClassify === 1) {
        this.type = 'cac'
      } else if (this.dataClassify === 2) {
        this.type = 'upper_data'
      } else if (this.dataClassify === 5) {
        this.type = 'CLOUD'
      } else if (this.dataClassify === 7) {
        this.type = 'ANY'
      }
      getDataTypes({ type: this.dataClassify }).then(response => {
        this.dataTypeoptions = response.data
      })
    },
    dataTypeEvent() {
      this.dataOptions = []
      this.dataPathOptions = []
      if (this.dataClassify === 4) {
        this.ifShow = false
        this.ifPathShow = true
        this.dataPathValue = ''
        getTypepath({ dataTypeCode: this.type }).then(res => {
          res.data.forEach(item => {
            this.dataPathOptions.push({
              typecode: item.directory,
              typename: item.directory
            })
          })
        })
      } else if (this.dataClassify === 3) {
        this.dataValue = []
        this.ifPathShow = false
        this.ifShow = true
        this.showName = '雷达编号：'
        getRadarcode({ dataTypeCode: this.type }).then(res => {
          res.data.forEach(item => {
            this.dataOptions.push({
              typecode: item.fieldcode,
              typename: item.fieldname
            })
          })
        })
      } else if (this.dataClassify === 6) {
        this.dataValue = []
        this.ifShow = true
        this.showName = '机场名称：'
        getAirportCode().then(res => {
          res.data.forEach(item => {
            this.dataOptions.push({
              typecode: item.code,
              typename: item.airportName
            })
          })
        })
      }
    },
    handleUnfold() {
      this.unfold = !this.unfold
    },
    // 查询结果
    handleSearchFilter() {
      this.rotate = !this.rotate
      this.handleEmitFilter()
    },
    // 搜索条件emit给父组件
    handleEmitFilter() {
      const obj = {
        dataType: this.type || null,
        timeArea: this.timeScope || null
      }
      const objValue = {
        dataClassify: this.dataClassify || null,
        dataValue: this.dataValue || null,
        dataPathValue: this.dataPathValue || null
      }
      if (obj.timeArea && obj.timeArea.length) {
        obj.eventTimeBegin = obj.timeArea[0]
        obj.eventTimeEnd = obj.timeArea[1]
        delete obj.timeArea
      }
      if (obj.timeArea === null) {
        obj.eventTimeBegin = ''
        obj.eventTimeEnd = ''
        delete obj.timeArea
      }
      this.$emit('searchFilter', obj, objValue)
      this.dialogFormVisible = false
    },
    // 打开详情搜索
    handleFilterDetail() {
      this.dialogFormVisible = true
    },
    // 新增气压值
    addNewpressure() {
      if (this.pressure) {
        const index = this.metadata.findIndex(
          item => item.label === this.pressure
        )
        if (index === -1) {
          this.metadata.unshift({
            key: this.metadata[0].key + 50,
            label: this.pressure,
            disabled: false
          })
        }
      }
    }
  },
  mounted() {
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
.filter-search {
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
  margin-bottom: 0;
  div > span {
    cursor: pointer;
  }
}
.search-list {
  width: 100%;
  height: 0;
  overflow: hidden;
  border: 1px solid #e4e4e4;

  padding: 0;
  transition: all 0.3s;
  -webkit-transition: all 0.3s; /* Safari */
  opacity: 0;
  & > div {
    padding: 0 10px;
    width: 100%;
    .search-line {
      height: 60px;
      padding-top: 12px;
      box-sizing: border-box;
      display: flex;
      & > div:nth-child(1),
      & > div:nth-child(2) {
        // flex: 0.2;
        min-width: 240px;
      }
    }
  }
}
.search-filter {
  ::v-deep .el-dialog__header {
    background-color: #f3f3f3;
  }
}
.active {
  opacity: 1;
  height: 120px;
}
.filter-search div {
  float: right;
}
.filter-search span {
  margin-right: 20px;
}
.serarch-inline-detail {
  height: 50px;
  padding: 10px 0;

  ::v-deep .el-input__inner {
    width: 580px;
  }
  .pressure-line {
    ::v-deep .el-input__inner {
      width: 522px;
    }
  }
}
</style>
