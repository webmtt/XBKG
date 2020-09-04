<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <history-search @searchFilter="handleSearchFilter" />
    <!-- 数据列表 -->
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <i class="el-icon-edit" />
        <span>数据列表</span>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.pageSize"
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
        <el-select
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
      <el-table-column type="selection" align="center" width="55" />
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
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }" class="tableButtom">
          <el-button type="success" size="mini" @click="handleDownLoad(row)"
            >下载</el-button
          >
          <el-button type="danger" v-if="deleteShow === true" size="mini" @click="handleDelete(row)">删除</el-button>
          <el-button
            v-if="analysisShow"
            style="margin-left:10px"
            type="warning"
            size="mini"
            @click="handleAnalysis(row)"
            >解析</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-form class="operation">
      <el-form-item>
        <el-checkbox v-model="checked" @change="checkAll">全选</el-checkbox>
        <el-dropdown
          style="margin-left:10px"
          :trigger="'click'"
          type="warning"
          @command="handleAll"
        >
          <el-button
            :disabled="!multipleSelection.length"
            type="success"
            size="mini"
          >
            操作
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item :disabled="!multipleSelection.length" command="grib">grib格式</el-dropdown-item> -->
            <el-dropdown-item
              :disabled="!multipleSelection.length"
              command="download"
              >下载</el-dropdown-item
            >
            <el-dropdown-item
              v-if="deleteShow === true"
              :disabled="!multipleSelection.length"
              command="delete"
              >删除</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item style="width: 84%;">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="paginationChange"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import GeneralOptions from '@/utils/generalOptions'
import FileDownload from '@/utils/fileDownload'
import Pagination from '@/components/Pagination'
import HistorySearch from './components/HistorySearch'
import {
  getHistoryList,
  getHistoryDownload,
  getHistoryListDownload,
  getHistoryListDelete,
  getAnalysisHistory
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
        { key: 'fileext', label: '文件类型', width: 200 },
        { key: 'fileTime', label: '数据时间', width: 200 },
        { key: 'storeDate', label: '入库时间', width: 200 },
        { key: 'fileName', label: '文件名称' }
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        sortOrder: 'asc',
        columnName: 'time',
        eventTimeBegin: null,
        eventTimeEnd: null,
        dataType: 'ground_data',
        radarcode: '',
        typepath: '',
        path: '',
        airportcode: ''
      },
      checkAllText: null,
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
    handleAnalysis(row) {
      getAnalysisHistory({
        rowKey: row.rowKey,
        fileName: row.fileName,
        typepath: row.typepath,
        table: row.table,
        namespace: row.namespace
      }).then(res => {})
    },
    paginationChange(e) {
      this.checked = false
      this.getList()
    },
    checkAll() {
      this.$refs.multipleTable.toggleAllSelection()
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
    handleDownLoad(d) {
      getHistoryDownload({ rowKey: d.rowKey, fileName: d.fileName })
        .then(res => {
          new FileDownload().zipDownload(res.fileURL)
        })
        .catch(() => {
          this.$message.error('下载失败！')
        })
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
              getHistoryListDelete({
                ids: row.id,
                rowKeys: row.rowKey
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
        .catch(() => {})
    },
    indexMethod(index) {
      return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + 1 + index
    },
    getList() {
      this.listLoading = true
      const postObj = {}
      Object.keys(this.listQuery).forEach(key => {
        if (this.listQuery[key]) {
          postObj[key] = this.listQuery[key]
        }
      })
      getHistoryList(postObj)
        .then(response => {
          if (response.code >= 0) {
            if (response.data === '') {
              this.$Message.info(`返回数据为空`)
            }
            // 请求成功
            this.listLoading = false
            this.list = response.data.list
            this.total = response.data ? response.data.total : 0
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
    // 批量操作
    handleAll(command) {
      const obj = {
        rowKeys: '',
        fileNames: ''
      }
      const objDelete = {
        ids: '',
        rowKeys: ''
      }
      if (this.multipleSelection.length) {
        this.multipleSelection.forEach(item => {
          obj.rowKeys += item.rowKey + ','
          obj.fileNames += item.fileName + ','
          objDelete.ids += item.id + ','
          objDelete.rowKeys += item.rowKey + ','
        })
        obj.rowKeys = obj.rowKeys.substring(0, obj.rowKeys.length - 1)
        obj.fileNames = obj.fileNames.substring(0, obj.fileNames.length - 1)
        objDelete.ids = objDelete.ids.substring(0, objDelete.ids.length - 1)
        objDelete.rowKeys = objDelete.rowKeys.substring(
          0,
          objDelete.rowKeys.length - 1
        )
        if (command === 'download') {
          getHistoryListDownload(obj)
            .then(res => {
              new FileDownload().zipDownload(res.zipURL)
            })
            .catch(() => {
              this.$message.error('下载失败')
            })
        } else {
          getHistoryListDelete(objDelete).finally(res=>{
            this.$Message.success('删除成功')
            this.getList()
          })
        }
      }
    },
    // 检索
    handleSearchFilter(obj, objValue) {
      this.listQuery.typepath = ''
      this.listQuery.radarcode = ''
      this.listQuery.airportcode = ''
      this.listQuery = { ...this.listQuery, ...obj }
      this.listQuery.path = obj.path
      if (objValue.dataClassify === 4) {
        this.analysisShow = true
      } else {
        this.analysisShow = false
      }
      if (objValue.dataClassify === 4) {
        this.listQuery.typepath = objValue.dataPathValue
      } else if (objValue.dataClassify === 3) {
        objValue.dataValue.forEach(item => {
          this.listQuery.radarcode += item + ','
        })
        this.listQuery.radarcode = this.listQuery.radarcode.substring(
          0,
          this.listQuery.radarcode.length - 1
        )
      } else if (objValue.dataClassify === 6) {
        objValue.dataValue.forEach(item => {
          this.listQuery.airportcode += item + ','
        })
        this.listQuery.airportcode = this.listQuery.airportcode.substring(
          0,
          this.listQuery.airportcode.length - 1
        )
      }
      this.getList(obj)
    }
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
.searchContent {
  border: 1px solid #e4e4e4;
}
.searchContent form.el-form {
  display: flex;
  margin: 10px 10px 10px 30px;
}
.searchContent .el-form-item.el-form-item--medium:nth-child(2) {
  margin-left: 200px;
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
  display: inline-block;
  float: right;
}
.filterSearch span {
  margin-right: 20px;
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
