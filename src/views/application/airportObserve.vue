<template>
  <div class="app-container">
    <!-- 个例查询 -->
    <el-form style="margin-bottom:25px;">
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>个例查询</span>
        <div>
          <i
            :class="is_show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show = !is_show"
          ></i>
          <span>{{ word }}</span>
          <el-button type="success" size="small" @click="handleFilter">
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
          <el-form-item>
            <span>数据类型：</span>
            <el-select
              v-model="listTypeActive"
              class="filter-item"
              placeholder="数据类型"
              @change="handleListTypeFilter"
            >
              <el-option
                v-for="(item,index) in listTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="margin:0px 20px;" label-width="100px" label="目录层级：">
            <el-select @change="pathEvent" style="width: 150px" v-model="path" filterable>
              <el-option
                v-for="(item, index) in pathOptions"
                :key="index"
                :label="item.label"
                :value="item.directory"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="margin:0px 20px 0px 0px;" v-show="ifShow">
            <span>雷达编号：</span>
            <el-select
              filterable
              :filter-method="searchBlur"
              collapse-tags
              multiple
              style="width: 155px;"
              v-model="dataValue"
              ref="select"
              @blur.native.capture="blurEvent()"
            >
              <el-option
                v-for="(item,index) in dataOptions"
                :key="index"
                :label="item.typename"
                :value="item.typecode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin:0px 20px 0px 0px;" v-show="listTypeActive==='kh_8'">
            <span>范围投影：</span>
            <el-select filterable style="width: 150px;" v-model="rangeValue">
              <el-option
                v-for="(item,index) in rangeOptions"
                :key="index"
                :label="item.name"
                :value="item.tag"
              ></el-option>
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
        </el-form>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-form class="data-list" :inline="true">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span>数据列表</span>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.numperpage"
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
          v-model="listQuerySort"
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
      stripe
      v-loading="listLoading"
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        :show-overflow-tooltip="true"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
      <el-table-column
        label="操作"
        align="center"
        :width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }" class="tableButtom">
          <el-button type="success" size="mini" @click="handleDownLoad(row)">下载</el-button>
          <el-button
            style="margin-left: 0"
            v-if="listTypeActive === 'kh_8'"
            type="warning"
            size="mini"
            @click="handleK8listDetails(row)"
          >预览</el-button>
          <el-button
            style="margin-left: 0"
            v-loading.fullscreen="fullscreenLoading"
            v-if="listTypeActive !== 'kh_8'&&listTypeActive !== 'wind_profiling'"
            type="warning"
            size="mini"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.1)"
            @click="handleDetails(row)"
          >预览</el-button>
          <el-button type="danger" @click="handleDelete(row)" style="margin-left: 0" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form class="operation">
      <el-form-item>
        <el-checkbox v-model="checked" @change="checkAll">全选</el-checkbox>
        <el-button
          style="margin-left:10px"
          :disabled="!multipleSelection.length"
          type="success"
          @click="handleAllDownload"
          size="mini"
        >批量下载</el-button>
        <el-button
          :disabled="!multipleSelection.length"
          type="danger"
          @click="handleAllDelete"
          size="mini"
        >批量删除</el-button>
      </el-form-item>

      <el-form-item style="width: 84%;">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.numperpage"
          @pagination="paginationChange"
        />
      </el-form-item>
    </el-form>

    <el-dialog
      class="weatherClass"
      :title="dialogTypeName"
      :visible.sync="dialogImageVisible"
      width="55%"
      top="12vh"
      custom-class="imagePreView"
    >
      <div v-if="listTypeActive === 'FY2G'||listTypeActive === 'oradata'">
        <el-table
          style="width:110px;"
          @row-click="handledCommandfy2G"
          ref="multipleTable"
          v-loading="listLoading"
          :data="listDatatypes"
          border
          fit
          stripe
          highlight-current-row
        >
          <el-table-column prop="name" label="类型"></el-table-column>
        </el-table>
      </div>
      <div v-if="listTypeActive === 'oradata'">
        <el-table
          v-if="outtype==='VEL'||outtype==='REF'"
          style="width:110px;"
          @row-click="handledCommandLevel"
          ref="multipleTable"
          v-loading="listLoading"
          :data="listLeveltypes"
          border
          fit
          stripe
          highlight-current-row
        >
          <el-table-column prop="level" label="层次"></el-table-column>
        </el-table>
      </div>
      <div
        style="width: 100%; height: 70vh;padding: 10px"
        v-loading="!dialogImage"
        element-loading-text="图片加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-image
          v-if="dialogImage"
          style="width: 100%; height: 100%"
          fit="contain"
          :preview-src-list="[dialogImage]"
          :src="dialogImage"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </el-dialog>
    <!-- 图片详情展示 -->
    <el-dialog
      class="weatherClass"
      title="数据详情"
      :visible.sync="dialogImageVisible_"
      width="55%"
      top="12vh"
      custom-class="imagePreView"
    >
      <div>
        <el-table
          style="width:110px;"
          @row-click="openDataTypeDetails"
          ref="multipleTable"
          v-loading="listLoading"
          :data="listDatatype"
          border
          fit
          stripe
          highlight-current-row
        >
          <el-table-column prop="name" label="数据类型"></el-table-column>
        </el-table>
      </div>
      <div>
        <el-table
          @row-click="openAngleDetails"
          ref="multipleTable"
          v-loading="listLoading"
          :data="listAngle"
          border
          fit
          stripe
          highlight-current-row
          style="height: 100%;overflow: auto;width:113px;"
        >
          <el-table-column prop="label" label="仰角"></el-table-column>
        </el-table>
      </div>
      <div
        style="width: 100%;  height: 70vh;padding: 10px"
        v-loading="!dialogImage"
        element-loading-text="图片加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-image
          style="width: 100%; height: 100%"
          fit="contain"
          v-if="dialogImage"
          :preview-src-list="[dialogImage]"
          :src="dialogImage"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import GeneralOptions from '@/utils/generalOptions'
import pagination from '@/components/Pagination'
import FileDownload from '@/utils/fileDownload'
import {
  getAirportObserveList,
  getAirportObserveListWind,
  getListDownload,
  getListDownload_,
  getObserveDelete_,
  getDetail,
  getObserveDelete,
  getDetailk8list,
  cradarjpgfile,
  cradarjpgargs,
  getDetailfy2G,
  colleSatisticsDataType,
  getObserveDeleteAll,
} from '@/api/airportObserve'
import { getDirList } from '@/api/forecastData'
import { getRadarcode } from '@/api/collection'

export default {
  name: 'AirportObserve',
  components: { pagination },
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
      outtype: 'VEL',
      rangeOptions: [],
      rangeValue: '',
      pathOptions: [
        { directory: '/I', label: '红外7通道' },
        { directory: '/V', label: '可见光3通道' },
      ],
      pathRangeOptions: [
        {
          '/I': {
            channel: '红外7通道',
            value: [{ tag: 'IEC', name: '中国等经纬投影' }],
          },
          '/V': {
            channel: '可见光3通道',
            value: [{ tag: 'VEC', name: '中国等经纬投影' }],
          },
        },
      ],
      ifShow: false,
      dataOptions: [],
      dataValue: [],
      path: '/I',
      rotate: false,
      beginTime: '',
      listDatatype: [
        { value: 'DBZ', name: '强度（CorZ）' },
        { value: 'DB', name: '强度（UnZ）' },
        { value: 'V', name: '速度(V)' },
        { value: 'W', name: ' 谱宽(W)' },
      ],
      listDatatypes: [],
      listLeveltypes: [
        { value: 1, level: 1 },
        { value: 3, level: 3 },
        { value: 4, level: 4 },
        { value: 5, level: 5 },
        { value: 6, level: 6 },
        { value: 7, level: 7 },
        { value: 8, level: 8 },
        { value: 9, level: 9 },
        { value: 10, level: 10 },
      ],
      endTime: '',
      listQuerySort: '-id',
      level: '',
      listAngle: [],
      imageCache: {},
      listLoading: false,
      timeScope: [this.beginTime, this.endTime],
      fullscreenLoading: false, // loadding
      dialogImageVisible: false,
      dialogImageVisible_: false,
      dialogImage: '', // 图片路径
      dialogTypeName: '', // 图片类型名称
      activeDetail: {}, // 详情
      checked: false,
      modalOption: {
        show: false,
        data: null,
      },
      numberOptions: new GeneralOptions().numberOfPerPage(),
      sortOptions: new GeneralOptions().listSorting(),
      listTypeOptions: [],
      listTypeActive: 'kh_8', // 'kh_8',
      multipleSelection: [], // 多选
      is_show: true,
      value: '',
      defaultImageType: 'DBZ',
      value1: '',
      value2: '',
      list: [],
      total: 0,
      tableMeta: [],
      metaConfig: {
        kh_8: [
          { key: 'time', label: '时间', width: 180 },
          { key: 'flag', label: '文件标识', width: 150 },
          { key: 'filename', label: '文件名称' },
        ],
        FY2G: [
          { key: 'time', label: '时间', width: 180 },
          { key: 'settlelate', label: '卫星名', width: 100 },
          { key: 'filename', label: '文件名称' },
        ],
        oradata: [
          { key: 'time', label: '时间', width: 180 },
          { key: 'producttype', label: '产品类型', width: 100 },
          { key: 'radartype', label: '雷达类型' },
          { key: 'stationcode', label: '站点编码' },
          { key: 'filename', label: '文件名称', width: 600 },
        ],
        wind_profiling: [
          { key: 'time', label: '时间', width: 150 },
          { key: 'airport', label: '机场', width: 150 },
          { key: 'doctype', label: '文件类型', width: 150 },
          { key: 'filename', label: '文件名称' },
        ],
        weather_radar: [
          { key: 'time', label: '时间', width: 150 },
          { key: 'airport', label: '机场', width: 150 },
          { key: 'doctype', label: '文件类型', width: 150 },
          { key: 'filename', label: '文件名称' },
        ],
      },
      listQuery: {
        page: 1,
        numperpage: 10,
        type: null,
        sort: this.listQuerySort,
        begintime: this.beginTime,
        endtime: this.endTime,
        flag: this.rangeValue,
        lliii: '',
        path: this.path,
      },
      scantype: '',
      angle: '',
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
    },
  },
  created() {
    this.pathEvent()
    this.getList()
  },
  methods: {
    pathEvent() {
      if (this.listTypeActive === 'kh_8') {
        this.rangeOptions = []
        this.pathRangeOptions[0][this.path].value.map((item) => {
          this.rangeOptions.push({ name: item.name, tag: item.tag })
        })
        this.rangeValue = this.rangeOptions[0].tag
      }
    },
    blurEvent() {
      if (this.searchBlurValue) {
        this.dataValue.push(this.searchBlurValue)
      }
    },
    searchBlur(val) {
      this.searchBlurValue = val
    },
    renovate() {
      this.rotate = !this.rotate
    },
    handleK8listDetails(row) {
      this.dialogTypeName = '卫星云图'
      this.dialogImage = ''
      this.dialogImageVisible = true
      getDetailk8list({ id: row.id }).then((res) => {
        // 加载显示
        const blob = new Blob([res], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        })
        this.dialogImage = URL.createObjectURL(blob)
        const key = row.id + row.time + row
        this.imageCache[key] = this.dialogImage
      })
    },
    timeChange() {
      this.listQuery.begintime = this.timeScope ? this.timeScope[0] : null
      this.listQuery.endtime = this.timeScope ? this.timeScope[1] : null
    },
    openDataTypeDetails(val) {
      this.defaultImageType = val.value
      this.dialogImage = null
      cradarjpgfile({
        id: this.activeDetail.id,
        scantype: this.scantype,
        datatype: this.defaultImageType,
        angle: this.angle,
      })
        .then((rec) => {
          // 加载显示
          const blob = new Blob([rec], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
          })
          this.dialogImage = URL.createObjectURL(blob)
          this.imageCache[key] = this.dialogImage
        })
        .catch(() => {})
    },
    openAngleDetails(val) {
      this.angle = val.value
      this.dialogImage = null
      cradarjpgfile({
        id: this.activeDetail.id,
        scantype: this.scantype,
        datatype: this.defaultImageType,
        angle: this.angle,
      })
        .then((rec) => {
          // 加载显示
          const blob = new Blob([rec], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
          })
          this.dialogImage = URL.createObjectURL(blob)
          this.imageCache[key] = this.dialogImage
        })
        .catch(() => {})
    },
    handleDetails(d) {
      this.dialogImage = null
      this.listAngle = []
      this.angle = ''
      this.activeDetail = d
      if (this.listTypeActive === 'FY2G') {
        this.dialogImageVisible = true
        ;(this.listDatatypes = [
          { value: '红外1', name: '红外1' },
          { value: '红外2', name: '红外2' },
          { value: '红外3', name: '红外3' },
          { value: '红外4', name: '红外4' },
          { value: '可见光', name: '可见光' },
        ]),
          (this.dialogTypeName = '红外1')
        getDetailfy2G({ id: this.activeDetail.id, picturetype: '红外1' })
          .then((rec) => {
            // 加载显示
            const blob = new Blob([rec], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
            })
            this.dialogImage = URL.createObjectURL(blob)
            this.imageCache[key] = this.dialogImage
          })
          .catch(() => {})
      } else if (this.listTypeActive === 'oradata') {
        this.dialogImageVisible = true
        ;(this.listDatatypes = [
          { value: 'VEL', name: '径向速度' },
          { value: 'REF', name: '基本反射率' },
          { value: 'VIL', name: '垂直液态水含量' },
          { value: 'CR', name: '组合反射率' },
          { value: 'ET', name: '回波顶高' },
        ]),
          (this.dialogTypeName = '径向速度')
        getDetail(this.activeDetail.id, 'VEL', 1)
          .then((rec) => {
            // 加载显示
            const blob = new Blob([rec], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
            })
            this.dialogImage = URL.createObjectURL(blob)
            this.imageCache[key] = this.dialogImage
          })
          .catch(() => {})
      } else {
        this.dialogImageVisible = false
      }
      if (this.listTypeActive === 'weather_radar') {
        this.dialogImageVisible_ = true
        cradarjpgargs({ id: this.activeDetail.id })
          .then((res) => {
            if (res.data.SwpAngle) {
              res.data.SwpAngle.forEach((ix) => {
                this.listAngle.push({
                  label: ix,
                  value: ix,
                })
              })
              this.scantype = res.data.Type
            }
          })
          .finally((res) => {
            const key = this.activeDetail.id + this.activeDetail.time + d
            if (this.imageCache[key]) {
              this.dialogImage = this.imageCache[key]
              return
            } else {
              this.dialogImage = null
            }
            if (this.listAngle.length) {
              this.angle = this.listAngle[0].value
            }
            cradarjpgfile({
              id: this.activeDetail.id,
              scantype: this.scantype,
              datatype: this.defaultImageType,
              angle: this.angle,
            })
              .then((rec) => {
                // 加载显示
                const blob = new Blob([rec], {
                  type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
                })
                this.dialogImage = URL.createObjectURL(blob)
                this.imageCache[key] = this.dialogImage
              })
              .catch(() => {})
          })
      }
    },
    handledCommandfy2G(d) {
      if (d.value === 'REF') {
        this.level = 0
        this.listLeveltypes = [
          { value: 0, level: 0 },
          { value: 2, level: 2 },
          { value: 4, level: 4 },
          { value: 5, level: 5 },
          { value: 6, level: 6 },
          { value: 7, level: 7 },
          { value: 8, level: 8 },
          { value: 9, level: 9 },
          { value: 10, level: 10 },
        ]
      } else if (d.value === 'VEL') {
        this.level = 1
        this.listLeveltypes = [
          { value: 1, level: 1 },
          { value: 3, level: 3 },
          { value: 4, level: 4 },
          { value: 5, level: 5 },
          { value: 6, level: 6 },
          { value: 7, level: 7 },
          { value: 8, level: 8 },
          { value: 9, level: 9 },
          { value: 10, level: 10 },
        ]
      }
      this.dialogImageVisible = true
      this.dialogImage = null
      this.dialogTypeName = d.name
      if (this.listTypeActive === 'FY2G') {
        getDetailfy2G({ id: this.activeDetail.id, picturetype: d })
          .then((rec) => {
            // 加载显示
            const blob = new Blob([rec], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
            })
            this.dialogImage = URL.createObjectURL(blob)
            this.imageCache[key] = this.dialogImage
          })
          .catch(() => {})
      } else if (this.listTypeActive === 'oradata') {
        this.outtype = d.value
        getDetail(this.activeDetail.id, this.outtype, this.level)
          .then((rec) => {
            // 加载显示
            const blob = new Blob([rec], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
            })
            this.dialogImage = URL.createObjectURL(blob)
            this.imageCache[key] = this.dialogImage
          })
          .catch(() => {})
      }
    },
    handledCommandLevel(d) {
      this.dialogImageVisible = true
      this.dialogImage = null
      this.level = d.level
      getDetail(this.activeDetail.id, this.outtype, this.level)
        .then((rec) => {
          // 加载显示
          const blob = new Blob([rec], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
          })
          this.dialogImage = URL.createObjectURL(blob)
          this.imageCache[key] = this.dialogImage
        })
        .catch(() => {})
    },
    // 切换数据类型
    handleListTypeFilter(val) {
      this.dataValue = []
      this.path = ''
      this.rangeValue = ''
      if (this.listTypeActive === 'kh_8') {
        this.ifShow = false
        this.rangeOptions = []
        ;(this.path = '/I'),
          (this.pathOptions = [
            { directory: '/I', label: '红外7通道' },
            { directory: '/V', label: '可见光3通道' },
          ])
        this.pathRangeOptions[0][this.path].value.map((item) => {
          this.rangeOptions.push({ name: item.name, tag: item.tag })
        })
        this.rangeValue = this.rangeOptions[0].tag
      } else {
        getDirList({ type: this.listTypeActive }).then((res) => {
          this.pathOptions = res.list
          if (this.pathOptions.length) {
            this.path = this.pathOptions[0].directory
          }
        })
      }
      if (this.listTypeActive === 'oradata') {
        this.path = '/bclz'
        this.ifShow = true
        getRadarcode({ dataTypeCode: 'oradata' }).then((res) => {
          res.data.forEach((item) => {
            this.dataOptions.push({
              typecode: item.fieldcode,
              typename: item.fieldname,
            })
          })
        })
      } else {
        this.ifShow = false
      }
      this.listTypeActive = val
      this.listQuery.page = 1
      this.checked = false
      if (this.listQuery.begintime.indexOf('-') === -1) {
        this.listQuery.begintime =
          this.listQuery.begintime.slice(0, 4) +
          '-' +
          this.listQuery.begintime.slice(4, 6) +
          '-' +
          this.listQuery.begintime.slice(6, 8) +
          ' ' +
          this.listQuery.begintime.slice(8, 10) +
          ':' +
          this.listQuery.begintime.slice(10, 12) +
          ':00'
        this.listQuery.endtime =
          this.listQuery.endtime.slice(0, 4) +
          '-' +
          this.listQuery.endtime.slice(4, 6) +
          '-' +
          this.listQuery.endtime.slice(6, 8) +
          ' ' +
          this.listQuery.endtime.slice(8, 10) +
          ':' +
          this.listQuery.endtime.slice(10, 12) +
          ':59'
      }
      this.getList()
    },
    // 单文件下载
    handleDownLoad(d) {
      if (
        this.listTypeActive === 'wind_profiling' ||
        this.listTypeActive === 'weather_radar'
      ) {
        getListDownload_({
          ids: d.id,
          type: this.listTypeOptions.find(
            (item) => item.key === this.listTypeActive
          ).value,
        })
          .then((res) => {
            new FileDownload().zipDownload(res.zipUrl)
          })
          .catch(() => {
            this.$message.error('下载失败！')
          })
      } else {
        getListDownload({
          ids: d.id,
          type: this.listTypeOptions.find(
            (item) => item.key === this.listTypeActive
          ).value,
        })
          .then((res) => {
            new FileDownload().zipDownload(res.zipUrl)
          })
          .catch(() => {
            this.$message.error('下载失败！')
          })
      }
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    checkAll() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    // 批量下载
    handleAllDownload() {
      const ids = this.multipleSelection.map((item) => item.id)
      if (
        this.listTypeActive === 'wind_profiling' ||
        this.listTypeActive === 'weather_radar'
      ) {
        getListDownload_({
          ids: ids.join(','),
          type: this.listTypeOptions.find(
            (item) => item.key === this.listTypeActive
          ).value,
        })
          .then((res) => {
            new FileDownload().zipDownload(res.zipUrl)
          })
          .catch(() => {
            this.$message.error('下载失败')
          })
      } else {
        getListDownload({
          ids: ids.join(','),
          type: this.listTypeOptions.find(
            (item) => item.key === this.listTypeActive
          ).value,
        })
          .then((res) => {
            new FileDownload().zipDownload(res.zipUrl)
          })
          .catch(() => {
            this.$message.error('下载失败')
          })
      }
    },
    // 批量删除
    handleAllDelete() {
      const idS = this.multipleSelection.map((item) => item.id)
      getObserveDeleteAll({
        ids: idS.join(','),
        type: this.listTypeActive,
        db: 'SPECIAL',
      }).finally((res) => {
        this.$Message.success('删除成功')
        setTimeout(() => {
          this.getList()
          this.checked = false
        }, 500)
      })
    },
    paginationChange() {
      this.checked = false
      this.getList()
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.page = 1
      this.checked = false
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePermissions() {
      this.$router.push({
        path: '/backstage/departmentManage/permission-setting',
      })
    },
    handleEdit() {
      this.$router.push({ path: '/backstage/userManage/role-manage' })
    },
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
              if (
                this.listTypeActive === 'wind_profiling' ||
                this.listTypeActive === 'weather_radar'
              ) {
                getObserveDelete_({
                  id: row.id,
                  type: this.listTypeActive,
                }).finally((res) => {
                  this.getList()
                })
              } else {
                getObserveDelete({
                  id: row.id,
                  type: this.listTypeActive,
                }).finally((res) => {
                  this.getList()
                })
              }
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 3000)
          } else {
            done()
          }
        },
      })
        .then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {})
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.numperpage + 1 + index
    },

    beforeGetData() {
      this.list = []
    },
    getList() {
      this.listQuery.sort = this.listQuerySort
      this.listQuery.lliii = ''
      this.listQuery.path = this.path
      this.listLoading = true
      this.listQuery.type = this.listTypeActive
      this.listTypeOptions = []
      this.beforeGetData()
      // 获取数据类型选择列表
      colleSatisticsDataType().then((res) => {
        res.data.forEach((item) => {
          this.listTypeOptions.push({
            value: item.datatypecode,
            label: item.datatypename,
            key: item.datatypecode,
          })
        })
      })
      // 请求列表数据
      if (
        this.listTypeActive === 'wind_profiling' ||
        this.listTypeActive === 'weather_radar'
      ) {
        this.listQuery.begintime = this.listQuery.begintime
          ? this.listQuery.begintime.replace(/-|:|\s*/g, '')
          : ''
        this.listQuery.endtime = this.listQuery.endtime
          ? this.listQuery.endtime.replace(/-|:|\s*/g, '')
          : ''
        getAirportObserveListWind({
          page: 1,
          numperpage: 10,
          index: this.listTypeActive,
          param: {
            range: {
              time: `${this.listQuery.begintime},${this.listQuery.endtime}`,
            },
          },
          flag: this.rangeValue,
        })
          .then((res) => {
            // 重设表头
            this.tableMeta = this.metaConfig[this.listTypeActive]
            this.list = res.data.list.map((item) => {
              item.time =
                item.time.slice(0, 4) +
                '-' +
                item.time.slice(4, 6) +
                '-' +
                item.time.slice(6, 8) +
                ' ' +
                item.time.slice(8, 10) +
                ':' +
                item.time.slice(10, 12)
              return item
            })
            // if (this.listQuerySort === '+id') {
            //   this.list.sort((a, b) => a.time.localeCompare(b.time))
            // } else {
            //   this.list.sort((a, b) => b.time.localeCompare(a.time))
            // }
            this.total = res.data.total
          })
          .finally((res) => (this.listLoading = false))
      } else {
        this.listQuery.flag = this.rangeValue
        if (this.dataValue) {
          this.dataValue.forEach((item) => {
            this.listQuery.lliii += item + ','
          })
          this.listQuery.lliii = this.listQuery.lliii.substring(
            0,
            this.listQuery.lliii.length - 1
          )
        }
        if (this.listQuery.lliii === '') {
          this.listQuery.lliii = undefined
        }
        getAirportObserveList(this.listQuery)
          .then((response) => {
            // 重设表头
            this.tableMeta = this.metaConfig[this.listTypeActive]
            this.list = response.data.list.map((item) => {
              item.time =
                item.time.slice(0, 4) +
                '-' +
                item.time.slice(4, 6) +
                '-' +
                item.time.slice(6, 8) +
                ' ' +
                item.time.slice(8, 10) +
                ':' +
                item.time.slice(10, 12)
              return item
            })
            // if (this.listQuerySort === '+id') {
            //   this.list.sort((a, b) => a.time.localeCompare(b.time))
            // } else {
            //   this.list.sort((a, b) => b.time.localeCompare(a.time))
            // }
            this.total = response.data.total
          })
          .finally((res) => (this.listLoading = false))
      }
    },
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
.data-list {
  padding-left: 15px;
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
  border-bottom: none !important;
  .el-form-item {
    margin-bottom: 0px;
  }
}
.data-list .el-form-item.el-form-item--medium:nth-child(2) {
  float: right;
}
.filter-item {
  width: 150px;
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
.searchContent {
  border: 1px solid #e4e4e4;
}
.searchContent form.el-form {
  display: flex;
  margin: 10px 10px 10px 10px;
}
.searchContent .el-input.el-input--medium {
  width: 200px;
}
.searchContent .el-form-item.el-form-item--medium:nth-child(2) {
  margin-left: 20px;
}
.el-icon-search {
  margin-right: 5px;
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
.operation {
  display: flex;
  padding: 15px;
  border: 1px solid #e4e4e4;
  margin-top: 20px;
}
.operation .el-form-item.el-form-item--medium:nth-child(1) {
  width: 500px;
}
</style>
