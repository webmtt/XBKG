<template>
  <div class="search-filter search-filter-page">
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
            <el-form-item label="要素：">
              <el-select
                v-model="attr"
                @change="attrChange"
                style="width:200px;"
                class="filter-item"
                placeholder="要素"
              >
                <el-option
                  v-for="item in attrOptions"
                  :key="item.datatypecode"
                  :label="item.datatypename"
                  :value="item.datatypecode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="传感器位置：">
              <el-select
                v-model="locationId"
                style="width:200px;"
                class="filter-item"
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
              />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <el-dialog
      class="advancedFilters advancedFilters-box"
      title="高级检索"
      width="1000px"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width:800px; margin: 0 auto">
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
        <el-form-item>
          <span>字段选择：</span>
          <el-transfer
            v-model="value5"
            style="text-align: left; display: inline-block"
            filterable
            :titles="['未选字段', '已选字段']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="datas"
            @change="handleChange"
          >
            <span slot-scope="{ option }">{{ option.label }}</span>
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
import moment from 'moment'
import {
  getObservationAttr,
  getObservationFieldInfos,
  getObservationFieldStatus,
  getAutoLocationID
} from '@/api/application'
import Options from './localConfig'
export default {
  name: 'HistorySearch',
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      rotate: false,
      FieldInfos: [],
      attrOptions: [],
      locationIDOptions: [],
      attr: 'CLOUD',
      value5: [],
      beginTimeInit: '',
      locationId: '05L',
      endTimeInit: '',
      valueFalse: [],
      datas: Options.datasCLOUD,
      timeScope: [], // 时间区间
      unfold: true,
      dialogFormVisible: false,
      FieldStatus: [],
      movedKeys: []
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

    getObservationAttr().then(res => {
      this.attrOptions = res.data
    })
    getAutoLocationID().then(res => {
      res.data.map(item => {
        this.locationIDOptions.push({
          value: item,
          label: item
        })
      })
    }).finally(res=>{
      this.handleEmitFilter()
    })
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    attrChange() {
      this.$emit('attrChanges', this.attr)
      if (this.attr === 'HUMITEMP') {
        this.datas = Options.datasHUMITEMP
      } else if (this.attr === 'CLOUD') {
        this.datas = Options.datasCLOUD
      } else if (this.attr === 'PRESS') {
        this.datas = Options.datasPRESS
      } else if (this.attr === 'RAIN') {
        this.datas = Options.datasRAIN
      } else if (this.attr === 'VIS') {
        this.datas = Options.datasVIS
      } else if (this.attr === 'PW') {
        this.datas = Options.datasPW
      } else if (this.attr === 'WIND') {
        this.datas = Options.datasWIND
      } else if (this.attr === 'PV') {
        this.datas = Options.datasPV
      } else if (this.attr === 'RWYLIGHTS') {
        this.datas = Options.datasRWYLIGHTS
      }
      this.handleEmitFilter()
    },
    // 添加字段穿梭框变化
    handleChange(value, direction, movedKeys) {
      this.movedKeys = movedKeys
      this.value5 = value
      this.valueFalse = this.datas.filter(item => {
        return this.value5.indexOf(item.key) < 0
      })
      getObservationFieldInfos({
        classify: 'socket',
        type: this.attr
      }).then(res => {
        this.FieldInfos = res.data
      })
    },
    handleUnfold() {
      this.unfold = !this.unfold
    },
    // 查询结果
    handleSearchFilter() {
      this.rotate = !this.rotate
      if (this.unfold) {
        this.handleEmitFilter()
      } else {
        this.unfold = true
      }
    },
    // 搜索条件emit给父组件
    handleEmitFilter() {
      const obj = {
        attr: this.attr || null,
        timeArea: this.timeScope || null,
        locationId: this.locationId || null
      }
      if (obj.timeArea && obj.timeArea.length) {
        obj.startTime = obj.timeArea[0]
        obj.endTime = obj.timeArea[1]
        delete obj.timeArea
      }
      if (obj.timeArea === null) {
        this.timeScope = [
          moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD HH:mm:ss'),
          moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
        ]
        obj.startTime = moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
        obj.endTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
      }
      if (!obj.timeArea || !obj.timeArea.length) {
        delete obj.timeArea
      }
      this.$emit('searchFilter', obj,this.locationIDOptions)
      this.dialogFormVisible = false
      this.FieldStatus = []
      this.value5.filter(item => {
        this.FieldInfos.forEach(ix => {
          if (item === ix.fieldcode) {
            this.FieldStatus.push({
              id: ix.id,
              ifshow: '1'
            })
          }
        })
      })
      this.valueFalse.filter(item => {
        this.FieldInfos.forEach(ix => {
          if (item.key === ix.fieldcode) {
            this.FieldStatus.push({
              id: ix.id,
              ifshow: '0'
            })
          }
        })
      })
      if (this.movedKeys.length) {
        getObservationFieldStatus(this.FieldStatus).then(res => {
          this.$emit('subConditionChange')
        })
      }
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
<style>
.aa {
  transition: all 1s;
}
.go {
  transform: rotate(360deg);
  transition: all 1s;
}
.advancedFilters-box .el-date-editor--datetimerange.el-input__inner {
  width: 700px;
}
.advancedFilters-box .el-transfer-panel {
  width: 333px;
}
</style>


<style lang="scss" scoped>
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
        min-width: 278px;
      }
      & > div:nth-child(2) {
        flex: 0.25;
        min-width: 317px;
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
}
</style>
