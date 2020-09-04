<template>
  <div class="search-filter">
    <div style class="header">
      <i class="el-icon-search">
        <span>筛选查询</span>
      </i>
      <div>
        <span style="margin: 0 20px;cursor:pointer" @click="handleUnfold">
          <i :class="unfold ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
          <span>{{ unfold ? '收起筛选' : '展开筛选' }}</span>
        </span>
        <el-button type="success" size="small" @click="handleSearchFilter">
          查询结果
          <i
            @click="renovate"
            style="    position: absolute;right:5x;"
            :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
          ></i>
        </el-button>
      </div>
    </div>
    <div ref="searchList" class="search-list" :class="{ active: unfold }">
      <el-form inline v-if="unfold">
        <el-form-item label-width="100px" style="padding: 10px 0" label="数据类型：">
          <el-select
            style="width:150px"
            @change="typeChanged"
            v-model="searchModel.type"
            placeholder="数据类型"
          >
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" style="padding: 10px 0;" label="预报时效：">
          <el-select
            clearable
            style="width: 150px"
            v-model="searchModel.period"
            placeholder="时效"
            multiple
            collapse-tags
          >
            <el-option
              v-for="(item, index) in timeListOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" style="padding: 10px 0" label="目录层级：">
          <el-select
            clearable
            style="width: 150px"
            @change="pathChanged"
            v-model="searchModel.path"
            placeholder
            filterable
          >
            <el-option
              v-for="(item, index) in pathOptions"
              :key="index"
              :label="item.directory"
              :value="item.directory"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" style="padding: 10px 0" label="要素：">
          <el-select
            clearable
            @change="elementChanged"
            v-model="searchModel.element"
            placeholder="要素"
            filterable
          >
            <el-option
              v-for="(item, index) in elementOptions"
              :key="index"
              :label="item.name_en"
              :value="item.name_en"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" style="padding: 10px 0" label="ENS：">
          <el-select
            style="width: 150px"
            clearable
            v-model="searchModel.ens"
            placeholder="ENS"
            filterable
          >
            <el-option v-for="item in ENSOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" style="padding: 10px 0;" label="层次：">
          <el-select
            clearable
            style="width: 150px"
            v-model="searchModel.level"
            placeholder="层次"
            multiple
            collapse-tags
          >
            <el-option
              v-for="(item, index) in levelOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" style="padding: 10px 0" label="日期范围：">
          <el-date-picker
            style="width: 413px !important;"
            v-model="searchModel.timeArea"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format
            :picker-options="pickerOptions"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Options from './optionsConfig'
import ToolLibrary from '@/utils/toolLibrary'
import forecastConfig from '@/utils/forecast'
import {
  getTypeList,
  getDirList,
  getElementByTypeAndDir,
} from '@/api/forecastData'

export default {
  name: 'ForecastSearch',
  data() {
    const day1 = new Date()
    day1.setTime(day1.getTime())
    if (day1.getMonth() + 1 < 10) {
      if (day1.getDate() < 10) {
        this.beginTime =
          day1.getFullYear() +
          '-0' +
          (day1.getMonth() + 1) +
          '-0' +
          day1.getDate() +
          ' 00:00:00'
        this.endTime =
          day1.getFullYear() +
          '-0' +
          (day1.getMonth() + 1) +
          '-0' +
          day1.getDate() +
          ' 23:59:59'
      } else {
        this.beginTime =
          day1.getFullYear() +
          '-0' +
          (day1.getMonth() + 1) +
          '-' +
          day1.getDate() +
          ' 00:00:00'
        this.endTime =
          day1.getFullYear() +
          '-0' +
          (day1.getMonth() + 1) +
          '-' +
          day1.getDate() +
          ' 23:59:59'
      }
    } else {
      if (day1.getDate() < 10) {
        this.beginTime =
          day1.getFullYear() +
          '-' +
          (day1.getMonth() + 1) +
          '-0' +
          day1.getDate() +
          ' 00:00:00'
        this.endTime =
          day1.getFullYear() +
          '-' +
          (day1.getMonth() + 1) +
          '-0' +
          day1.getDate() +
          ' 23:59:59'
      } else {
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
      }
    }
    return {
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate !== '') {
            const day7 = 7 * 24 * 3600 * 1000
            let maxTime = this.pickerMinDate + day7
            let minTime = this.pickerMinDate - day7
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return (
              time.getTime() > maxTime ||
              time.getTime() < minTime ||
              time.getTime() > Date.now()
            )
          }
          return time.getTime() > Date.now()
        },
      },
      pickerMinDate: '',
      ENSOptions: [],
      rotate: false,
      beginTime: '',
      endTime: '',
      unfold: true,
      typeCode: '-1',
      levelOptions: [],
      pathOptions: [],
      elementOptions: [],
      typeOptions: [],
      timeListOptions: new Options().forecastData('timeList'),
      searchModel: {
        type: null,
        timeArea: [this.beginTime, this.endTime],
        period: [],
        level: [],
        levelType: null,
        element: null,
        path: null,
        ens: null,
      },
    }
  },
  computed: {
    searchModelNew() {
      return JSON.parse(JSON.stringify(this.searchModel))
    },
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    handleUnfold() {
      this.unfold = !this.unfold
    },

    // 查询结果
    handleSearchFilter() {
      this.rotate = !this.rotate
      this.$emit('searchFilter', this.transformData())
    },

    transformData() {
      let obj = {}
      for (let key in this.searchModel) {
        if (this.searchModel[key]) {
          if (
            this.searchModel[key] instanceof Array &&
            this.searchModel[key].length
          ) {
            if (key === 'timeArea') {
              obj[key] = this.searchModel[key]
                .map((item) => item.replace(/[-:\s]/g, ''))
                .join()
              obj[key] = obj[key].substring(0, 14) + obj[key].substring(14, 29)
            } else {
              obj[key] = this.searchModel[key].join()
            }
          } else if (typeof this.searchModel[key] != 'object') {
            obj[key] = this.searchModel[key]
          }
        }
      }
      if (this.searchModel.levelType) {
        obj['levelType'] = this.searchModel.levelType
      }
      if (this.searchModel.ens === 0) {
        obj['ens'] = 0
      }
      return obj
    },

    typeChanged(value) {
      this.searchModel.path = null
      this.searchModel.element = null
      this.searchModel.level = []
      this.typeCode =
        this.searchModel.type == 'EC_HR'
          ? '1'
          : this.searchModel.type == 'ncep'
          ? '2'
          : '-1'

      getDirList({ type: this.searchModel.type }).then((res) => {
        this.pathOptions = res.list
      })
      getElementByTypeAndDir({ type: this.searchModel.type }).then(
        (res) => (this.elementOptions = res.list)
      )
      // 要素选了才能有层次;
      this.levelOptions = []
    },

    pathChanged() {
      this.searchModel.element = null
      this.searchModel.level = []

      const params = { type: this.searchModel.type, dir: this.searchModel.path }

      getElementByTypeAndDir(params).then(
        (res) => (this.elementOptions = res.list)
      )
      // 要素选了才能有层次;
      this.levelOptions = []
      this.typeCode = this.pathOptions.filter(
        (item) => item.directory == this.searchModel.path
      )[0].elementid
    },

    elementChanged() {
      this.searchModel.level = []
      const filterCodeResult = forecastConfig.filter(
        (item) => item.typecode === this.typeCode.toString()
      )
      let levelType = this.getElementType()
      if (
        filterCodeResult.length != 1 ||
        this.typeCode == '-1'
        // levelType == ''
      ) {
        this.levelOptions = []
        return
      }

      const result = filterCodeResult[0].typemark[0]
      // const result = filterCodeResult[0].typemark.filter(
      //   item => item.leveltype == levelType
      // )[0]

      // this.searchModel.levelType = result.unit || null

      this.levelOptions = result.level.map((item) => item / result.factor)
    },
    getElementType() {
      const element = this.elementOptions.filter(
        (item) => item.name_en == this.searchModel.element
      )
      if (element.length) {
        return element[0].type
      }
      return ''
    },
  },
  created() {
    for (let i = -1; i < 51; i++) {
      this.ENSOptions.push(i + 1)
    }
    getTypeList().then((res) => {
      this.typeOptions = res.list
      this.searchModel.type = res.list[0]

      this.typeChanged()

      this.$emit('searchFilter', this.transformData())
    })
  },
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
.header {
  height: 50px;
  background: #f3f3f3;
  border: 1px solid #e4e4e4;
  border-bottom: none;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
  justify-content: space-between;
}
.search-list {
  display: flex;
  background: #fff;
  border: 1px solid #e4e4e4;
}

.active {
  opacity: 1;
}
</style>
