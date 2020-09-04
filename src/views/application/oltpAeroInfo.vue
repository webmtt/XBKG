<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <i class="el-icon-edit" />
        <span>数据列表</span>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.limit"
          class="filter-item"
          placeholder="显示条数"
          @change="getList"
        >
          <el-option
            v-for="item in numberOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <!-- <el-select
          v-model="listQuery.sortOrder"
          class="filter-item"
          placeholder="排序方式"
          @change="getList"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select> -->
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
      style="width: 100%;margin-bottom:20px;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- <el-table-column type="selection" align="center" width="55" /> -->
      <el-table-column
        type="index"
        align="center"
        label="序号"
        :index="indexMethod"
        width="70"
      />
      <el-table-column
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
    </el-table>
    <!-- <el-form-item style="width: 84%;"> -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="paginationChange"
        />
      <!-- </el-form-item> -->
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import GeneralOptions from '@/utils/generalOptions'
import FileDownload from '@/utils/fileDownload'
import Pagination from '@/components/Pagination'
import HistorySearch from './components/HistorySearch'
import {
  getOltpAeroInfos
} from '@/api/historyData'

export default {
  name: 'HistoryData',
  components: { Pagination, HistorySearch },
  data() {
    return {
      currRoleID: Cookies.get('roleId'),//当前用户角色id
      analysisShow: false,
      format: 1,
      frameShow: false,
      checked: false,
      multipleSelection: [],
      modalOption: {
        show: false,
        data: null
      },
      numberOptions: new GeneralOptions().numberOfPerPage(),
      sortOptions: new GeneralOptions().listSorting_(),
      list: [],
      total: 0,
      tableMeta: [
        { key: 'AIRCRAFT_TYPE', label: '航空器机型', width: 200 },
        { key: 'bureau', label: '组织单位', width: 200 },
        { key: 'PBN_CAPACITY', label: 'PBN描述', width: 200 },
        { key: 'RVSM_CAPACITY', label: 'RVSM能力' }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        bool: true
      },
      deleteShow: false
    }
  },
  created() {
    this.getList()
    if(this.currRoleID.includes(1)){
      this.deleteShow = true
    }else {
      this.deleteShow = false
    }
  },
  methods: {
    paginationChange(e) {
      this.checked = false
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length === this.list.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    getList() {
      this.listLoading = true
      const postObj = {}
      Object.keys(this.listQuery).forEach(key => {
        if (this.listQuery[key]) {
          postObj[key] = this.listQuery[key]
        }
      })
      getOltpAeroInfos(postObj)
        .then(response => {
          if (response.code >= 0) {
            if (response.data === '') {
              this.$Message.info(`返回数据为空`)
            }
            // 请求成功
            this.listLoading = false
            this.list = response.data.list
            console.log(this.list)
            this.total = response.data ? response.data.totalNum : 0
          } else {
            // 请求失败
            this.$message.error(response.message)
          }
        })
        .catch(() => {
          this.$message.error('请求失败，请刷新！')
        })
    },
    // 控制每页显示条数
    handleShowListNum() {},
  }
}
</script>

<style lang="scss" scoped>
.dataList {
  padding-left: 15px;
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
  border-bottom: none !important;
  ::v-deep .el-form-item {
    margin-bottom: 0px !important;
  }
}
.dataList .el-form-item.el-form-item--medium:nth-child(2) {
  float: right;
}
.el-icon-search {
  margin-right: 5px;
}
.app-container {
  color: #666666;
}
.filter-item {
  width: 150px;
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
