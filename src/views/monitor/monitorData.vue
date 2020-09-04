<template>
  <div class="app-container">
    <!-- <el-form style="margin-bottom:10px;">
      <el-button>状态监控</el-button>
      <el-button @click="monitorBtnClick">采集统计</el-button>
      <el-button @click="logBtnClick">日志查看</el-button>
    </el-form>-->
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
    </el-form>
    <el-form class="searchContent" v-show="is_show == true">
      <el-form-item>
        <span>数据类型：</span>
        <el-select
          clearable
          @clear="clearEvent"
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
      <!-- <el-form-item style="margin-left: 6px;">
        <el-select style="width: 200px;" v-model="listQuery.type" placeholder="数据类型">
          <el-option
            v-for="item in dataTypeoptions"
            :key="item.datatypecode"
            :label="item.datatypename"
            :value="item.datatypecode"
          ></el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
    <!-- 数据列表 -->
    <el-form
      style="margin-top:20px;padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span style="color:#666666">数据列表</span>
      </el-form-item>
    </el-form>
    <!-- 数据显示部分 -->
    <el-table
      :cell-style="columnStyle"
      class="tableData"
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
      <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
    </el-table>
    <pagination
      v-show="total > 0"
      style="margin-top: 30px;"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="paginationChange"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getCollectionList, getDataTypeClassify } from '@/api/collection'

export default {
  components: { Pagination },
  data() {
    return {
      rotate: false,
      dataClassify: 1,
      checked: false,
      multipleSelection: [],
      is_show: true,
      dataClassifyoptions: [],
      value: '',
      list: [],
      propsconfigName: '民航报文',
      total: 0,
      tableMeta: [
        { key: 'datatype', label: '数据类型' },
        { key: 'dataname', label: '数据名称' },
        { key: 'sourceftpurl', label: '数据来源' },
        { key: 'status', label: '信息源状态' },
        { key: 'collecttime', label: '最近采集时间' }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        propsconfig: {
          dataclassification: '民航报文'
        }
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
  },
  methods: {
    renovate() {
      this.rotate = !this.rotate
    },
    dataClassifyEvent() {
      this.handleFilter()
      this.dataClassifyoptions.forEach(item => {
        if (this.dataClassify === item.typecode) {
          this.listQuery.propsconfig.dataclassification = item.typename
        }
      })
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.currentPage = 1
      this.getList()
    },
    // 修改列表特殊几行颜色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5 || columnIndex === 6) {
        return 'color:#64bc9c;'
      }
    },
    logBtnClick() {
      this.$router.push({ path: '/collection/monitor/log' })
    },
    monitorBtnClick() {
      this.$router.push({ path: '/collection/monitor/task' })
    },
    paginationChange() {
      this.checked = false
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    clearEvent() {
      this.listQuery.propsconfig.dataclassification = ''
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    getList() {
      this.listLoading = true
      getDataTypeClassify().then(response => {
        this.dataClassifyoptions = response.data
      })
      getCollectionList(this.listQuery).then(response => {
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
.handleLink {
  padding: 0 5px;
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
form.el-form.searchContent {
  padding: 10px;
}
.searchContent .el-form-item.el-form-item--medium:nth-child(2) {
  margin: 0px 27px;
}
.searchContent div {
  display: inline-block;
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
