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
          <el-button @click="handleFilterDetail">高级检索</el-button>
        </div>
      </el-form-item>
      <div ref="searchList" class="search-list" :class="{ active: unfold }">
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
            <el-form-item v-if="dataType!=='msg'" style="width:440px;" label="机场名称：">
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
                class="airport"
                multiple
                v-model="names"
                clearable
                style="margin: 0 2px;z-index: 1000;width: 185px;"
                size="small"
                placeholder="请选择机场"
                collapse-tags
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
            <el-form-item style="min-width: 255px;" v-if="dataType==='msg'">
              <el-form-item>
                <span>起止经度：</span>
                <el-input style="width:70px;" v-model="leftLon"></el-input>
                <i class="el-icon-arrow-right"></i>
                <el-input style="width:70px;" v-model="rightLon"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item style="min-width: 255px;" v-if="dataType==='msg'">
              <el-form-item>
                <span>起止纬度：</span>
                <el-input style="width:70px;" v-model="downLat"></el-input>
                <i class="el-icon-arrow-right"></i>
                <el-input style="width:70px;" v-model="upLat"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item style="min-width: 230px;" v-if="dataType==='msg'">
              <el-form-item>
                <span>高度：</span>
                <el-input style="width:70px;" v-model="highDown"></el-input>
                <i class="el-icon-arrow-right"></i>
                <el-input style="width:70px;" v-model="highUp"></el-input>
              </el-form-item>
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
              />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <el-dialog class="advancedFilter" title="高级检索" :visible.sync="dialogFormVisible">
      <el-form style="width:700px; margin: 0 auto;">
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
        <el-form-item style="margin-left: 80px;">
          <el-radio-group v-model="areaValue" @change="areaSelect">
            <el-radio label="area">区域</el-radio>
            <el-radio label="range">经纬度范围</el-radio>
            <el-radio label="province">省</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="areaValue==='range'">
          <span>起止经度：</span>
          <el-form-item style="margin-left:10px;width:188px">
            <el-input v-model="lonBeginInput"></el-input>
          </el-form-item>
          <i class="el-icon-arrow-right"></i>
          <el-form-item style="width:188px;">
            <el-input v-model="lonEndInput"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="areaValue==='range'">
          <span>起止纬度：</span>
          <el-form-item style="margin-left:10px;width:188px">
            <el-input v-model="latBeginInput"></el-input>
          </el-form-item>
          <i class="el-icon-arrow-right"></i>
          <el-form-item style="width:188px;">
            <el-input v-model="latEndInput"></el-input>
          </el-form-item>
          <el-button @click="lonLatQuery">查询</el-button>
        </el-form-item>
        <el-form-item v-if="areaValue==='area'">
          <span>区域名称：</span>
          <el-select
            style="margin-left:10px"
            @change="areaChange"
            v-model="area"
            placeholder="国家/地区"
          >
            <el-option
              v-for="(item,index) in areaOptions"
              :key="index + '-only'"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="areaValue==='area'||areaValue==='range'">
          <span>机场名称：</span>
          <el-select
            filterable
            multiple
            style="margin-left:10px"
            @change="airportNameChange"
            v-model="names"
            placeholder="机场名称"
          >
            <el-option
              v-for="item in airportNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="areaValue==='province'" label="机场名称：">
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
            multiple
            v-model="names"
            clearable
            style="margin: 0 2px;z-index: 1000;width: 150px;"
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
        <el-form-item>
          <span>天气现象：</span>
          <el-transfer
            v-model="value4"
            style="text-align: left; display: inline-block"
            filterable
            :titles="['未选', '已选']"
            :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
            :data="data"
            @change="attrHandleChange"
          >
            <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
            <el-button slot="left-footer" class="transfer-footer" size="small">操作</el-button>
            <el-button slot="right-footer" class="transfer-footer" size="small">操作</el-button>
          </el-transfer>
        </el-form-item>
        <el-form-item>
          <span>字段选择：</span>
          <el-transfer
            v-model="value5"
            style="text-align: left; display: inline-block"
            filterable
            :titles="['未选', '已选']"
            :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
            :data="datas"
            @change="columnsHandleChange"
          >
            <span slot-scope="{ option }">{{ option.label }}</span>
            <el-button slot="left-footer" class="transfer-footer" size="small">操作</el-button>
            <el-button slot="right-footer" class="transfer-footer" size="small">操作</el-button>
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEmitFilter">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Genneral from '@/utils/generalOptions'
import Options from './optionsConfig'
import city from '@/utils/province'
import airport from '@/utils/airport'
import OptionsDatas from './localConfig'
import {
  getProvince,
  getAirportList,
  getReporttArea,
  getReporttAreaProvince,
  getReporttLonLat,
  getFieldsByTypet
} from '@/api/application'
export default {
  name: 'HistorySearch',
  props: {
    handleFilter: {
      type: Function,
      default: null
    },
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    const generateData = _ => {
      const data = []
      const cities = new Genneral().attrOptions()
      const pinyin = new Genneral().attrOptions()
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        })
      })
      return data
    }
    return {
      highDown:'',
      highUp: '',
      leftLon: '',
      rightLon: '',
      upLat: '',
      downLat: '',
      rotate: false,
      names: ['西安咸阳国际机场'],
      airportNameOptions: [],
      provinceValue: '陕西省',
      airportOptions: [],
      areaValue: 'area',
      attr: '',
      value5: [],
      data: generateData(),
      datas: [],
      datasValue: [],
      provinceModelOptions: [],
      areaOptions: [],
      lonBeginInput: '',
      lonEndInput: '',
      latBeginInput: '',
      latEndInput: '',
      area: '',
      value4: [],
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
      dataType: 'awos',
      name: '',
      typeOptions: new Options().historyData('type'),
      timeScope: [], // 时间区间
      unfold: true,
      dialogFormVisible: false,
      columns: ''
    }
  },
  watch: {
    dialogFormVisible(value) {
      if (value === false) {
        // this.dataType = ''
        this.name = ''
        this.timeScope = []
        this.attr = ''
        this.columns = ''
        this.area = ''
        this.provinceValue = ''
      }
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
  mounted() {
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
    this.timeScope = [this.beginTime, this.endTime]
    this.getFields()
    getProvince().then(response => {
      this.provinceModelOptions = response
    })
    getReporttArea().then(res => {
      res.data.forEach(item => {
        this.areaOptions.push({ label: item, value: item })
      })
    })
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    // 获取高级筛选字段选择
    getFields() {
      this.datas = []
      this.datasValue = []
      getFieldsByTypet({ type: this.dataType }).then(res => {
        res.data.forEach(item => {
          this.datasValue.push({
            label: item.laber,
            key: item.key
          })
        })
        this.$emit('searchTablemeta', this.datasValue)
        this.datasValue = this.datasValue.filter(key => key.label !== '时间')
        this.datasValue = this.datasValue.filter(
          key => key.label !== '机场名称'
        )
        this.datasValue = this.datasValue.filter(
          key => key.label !== '观测时刻'
        )
        this.datasValue = this.datasValue.filter(
          key => key.label !== '观测时间'
        )
        this.datas = this.datasValue
      })
    },
    lonLatQuery() {
      this.airportNameOptions = []
      this.name = ''
      getReporttLonLat({
        leftLon: this.lonBeginInput,
        rightLon: this.lonEndInput,
        upLat: this.latEndInput,
        downLat: this.latBeginInput
      }).then(res => {
        res.data.forEach(item => {
          this.airportNameOptions.push({ label: item, value: item })
        })
      })
    },
    airportNameChange() {},
    areaChange() {
      this.airportNameOptions = []
      this.names = []
      this.name = ''
      getReporttAreaProvince({ area: this.area }).then(res => {
        res.data.forEach(item => {
          this.airportNameOptions.push({ label: item, value: item })
        })
      })
    },
    // 区域、经纬度范围选择
    areaSelect() {
      this.airportNameOptions = []
      this.names = []
      this.area = ''
      this.name = ''
      this.lonBeginInput = ''
      this.lonEndInput = ''
      this.latEndInput = ''
      this.latBeginInput = ''
      if (this.areaValue === 'area') {
        getReporttArea().then(res => {
          res.data.forEach(item => {
            this.areaOptions.push({ label: item, value: item })
          })
        })
      }
    },
    dataTypeChange() {
      this.columns = ''
      this.getFields()
      this.handleSearchFilter()
    },
    attrHandleChange(value, direction, movedKeys) {
      this.attr = value.toString()
    },
    columnsHandleChange(value, direction, movedKeys) {
      this.value5 = value
      this.columns = this.value5.toString()
    },
    handleUnfold() {
      this.unfold = !this.unfold
    },
    // 清除机场名称选项时触发
    airportClear() {
      this.name = ''
    },
    provinceClear() {
      this.name = ''
    },
    // 机场名称选项选择(点击省时)
    provinceChange() {
      this.names = []
      this.name = ''
      getAirportList({ province: this.provinceValue }).then(res => {
        this.airportOptions = res
        if (this.airportOptions.length) {
          this.names = [this.airportOptions[0].airportName]
        }
      })
    },
    airportChange(val) {
      this.name = ''
    },
    // 查询结果
    handleSearchFilter() {
      this.rotate = !this.rotate
      if (this.unfold) {
        this.handleEmitFilter()
        // this.handleFilter()
      } else {
        this.unfold = true
      }
    },
    // 搜索条件emit给父组件
    handleEmitFilter() {
      this.name = ''
      this.names.forEach(item => {
        this.name += item + ','
      })
      this.name = this.name.substring(0, this.name.length - 1)
      const obj = {
        dataType: this.dataType || null,
        name: this.name || null,
        timeArea: this.timeScope || null,
        attr: this.attr || null,
        columns: this.columns || null,
        area: this.area || null,
        province: this.provinceValue || null,
        leftLon: this.leftLon || null,
        rightLon: this.rightLon || null,
        upLat: this.upLat || null,
        downLat: this.downLat || null,
        highDown: this.highDown || null,
        highUp: this.highUp || null,
      }
      if (obj.timeArea && obj.timeArea.length) {
        obj.startTime = obj.timeArea[0]
        obj.endTime = obj.timeArea[1]
        delete obj.timeArea
      }
      if (obj.timeArea === null) {
        obj.startTime = ''
        obj.endTime = ''
        delete obj.timeArea
      }
      this.$emit('searchFilter', obj)
      this.dialogFormVisible = false
      // this.handleFilter()
    },
    // 打开详情搜索
    handleFilterDetail() {
      this.dialogFormVisible = true
      this.value5 = []
      if (this.list[0]) {
        Object.keys(this.list[0]).forEach(item => {
          this.value5.push(item)
        })
      }
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
.advancedFilter .el-form-item.el-form-item--medium {
  text-align: left;
  padding: 10px 0px 10px 80px;
}
.advancedFilter
  .el-form-item.el-form-item--medium
  .el-form-item.el-form-item--medium {
  display: inline-block;
  padding-left: 0px;
}
.advancedFilter .el-form-item.el-form-item--medium:nth-child(1),
.advancedFilter .el-form-item.el-form-item--medium:nth-child(2),
.advancedFilter .el-form-item.el-form-item--medium:nth-child(3) {
  display: flex;
  padding: 0px 0px 0px 80px;
}
.advancedFilter {
  padding: 15px 0px;
  border-bottom: 1px solid #dadada;
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
      & > div:nth-child(1) {
        flex: 0.25;
        min-width: 201px;
      }
      & > div:nth-child(2) {
        flex: 0.25;
        min-width: 435px;
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
  height: 60px;
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
}
</style>
