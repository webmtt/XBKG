<template>
  <div class="app-container">
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
          <el-button @click="handleFilter">查询结果
            <i
              @click="renovate"
              style="    position: absolute;right:5x;"
              :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
            ></i>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-form v-show="is_show" class="searchContent">
      <el-form-item>
        <span>数据类型：</span>
        <el-select
          v-model="dataClassify"
          style="width: 150px;"
          placeholder="数据类型"
          @change="dataClassifyEvent"
        >
          <el-option
            v-for="item in dataClassifyoptions"
            :key="item.typecode"
            :label="item.typename"
            :value="item.typecode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left:6px">
        <el-select v-model="listQuery.datatype" style="width: 200px;" placeholder="数据类型">
          <el-option
            v-for="item in dataTypeoptions"
            :key="item.datatypecode"
            :label="item.datatypename"
            :value="item.datatypecode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间：" style="min-width:520px;">
        <el-date-picker
          v-model="timeScope"
          style="width:400px"
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
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row }" class="tableButtom">
          <el-button type="warning" size="mini" @click="handleDetails(row)">详情</el-button>
          <el-button v-if="row.remark === '1'" type="success" size="mini" :disabled="true">已读</el-button>
          <el-button v-else type="danger" size="mini" :disabled="true">未读</el-button>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
import GeneralOptions from '@/utils/generalOptions'

import Options from '@/views/monitor/options'

import Pagination from '@/components/Pagination'
import {
  getCollectionWarningList,
  getWeatherCasesDetail,
  getDataTypes,
  getDataTypeClassify,
  getwarryUpdata
} from '@/api/collection'

export default {
  components: { Pagination },
  props: {
    fatherHeight: {
      type: Number,
      default: 0
    }
  },
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
      rotate: false,
      dataClassify: 5,
      tableDetails: [
        { key: 'name', label: '名称' },
        { key: 'value', label: '值' }
      ],
      timeScope: [],
      details: [],
      is_details: false,
      bulkOperation: '下载',
      format: 'xls',
      checked: false,
      numberOptions: new GeneralOptions().numberOfPerPage(),
      is_show: true,
      dataTypeoptions: [],
      dataClassifyoptions: [],
      value: '',
      list: [],
      total: 0,
      tableMeta: [
        { key: 'datatype', label: '数据类型', width: 180 },
        { key: 'collectiontime', label: '采集时间', width: 180 },
        { key: 'reason', label: '告警原因' }
      ],
      beginTime: '',
      endTime: '',
      listQuery: {
        page: 1,
        limit: 10,
        begintime: this.beginTime,
        endtime: this.endTime,
        datatype: 'VIS'
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
    getDataTypes({ type: 5 }).then(response => {
      this.dataTypeoptions = response.data
    })
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    dataClassifyEvent() {
      this.listQuery.datatype = ''
      getDataTypes({ type: this.dataClassify }).then(response => {
        this.dataTypeoptions = response.data
        this.listQuery.datatype = this.dataTypeoptions[0].datatypecode
      })
    },
    // 点击页码数页面自动跳到首行位置
    paginationChange() {
      this.$refs.multipleTable.bodyWrapper.scrollTop = 0
      this.checked = false
      this.getList()
    },
    timeChange() {
      this.listQuery.begintime = this.timeScope ? this.timeScope[0] : ''
      this.listQuery.endtime = this.timeScope ? this.timeScope[1] : ''
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.page = 1
      this.getList()
    },
    // 数据详情
    handleDetails(row) {
      this.is_details = !this.is_details
      getWeatherCasesDetail(row.id).then(response => {
        this.details = Object.keys(response).map(key => ({
          name: key,
          value: response[key]
        }))
        for (let i = 0; i < Options.optionsWarning.length; i++) {
          for (let j = 0; j < this.details.length; j++) {
            if (this.details[j].name === Options.optionsWarning[i].value) {
              this.details[j].name = Options.optionsWarning[i]['label']
            }
          }
        }
        this.markwarryUpdata(row)
      })
    },
    // 标记为已读
    markwarryUpdata(row) {
      getwarryUpdata([
        {
          id: row.id,
          remark: row.remark
        }
      ]).then(res => {
        const obj = this.list.find(item => item.id === row.id) || null
        obj ? (obj.remark = '1') : ''
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      this.timeScope = [this.listQuery.begintime, this.listQuery.endtime]
      getDataTypeClassify().then(response => {
        this.dataClassifyoptions = response.data
      })
      getCollectionWarningList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
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
.filter-item {
  width: 150px;
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
