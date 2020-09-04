<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <forecast-search @searchFilter="handleSearchFilter" />
    <!-- 数据列表 -->
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <i class="el-icon-edit" />
        <span>数据列表</span>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pagination.pageSize"
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
      :data="listDatas"
      border
      v-loading="listLoading"
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="55" />
      <el-table-column
        :show-overflow-tooltip="true"
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template slot-scope="scope" class="tableButtom">
          <el-dropdown :trigger="'click'" type="warning" @command="handleDownLoad">
            <el-button type="success" size="mini">
              下载
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item :command="{ ...scope.row, filetype: 'grib' }">grib格式</el-dropdown-item> -->
              <el-dropdown-item :command="{ ...scope.row, filetype: 'nc' }">nc格式</el-dropdown-item>
              <el-dropdown-item :command="{ ...scope.row, filetype: 'micaps' }">micaps格式</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="warning" @click="showImage(scope.row)" size="mini">预览</el-button>
          <el-button
            type="danger"
            @click="deleteData(scope.row)"
            style="margin-left: 0"
            size="mini"
          >删除</el-button>
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
          @command="handleAllDownload"
        >
          <el-button :disabled="!multipleSelection.length" type="success" size="mini">
            批量下载
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item :disabled="!multipleSelection.length" command="grib">grib格式</el-dropdown-item> -->
            <el-dropdown-item :disabled="!multipleSelection.length" command="nc">nc格式</el-dropdown-item>
            <el-dropdown-item :disabled="!multipleSelection.length" command="micaps">micaps格式</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          :disabled="!multipleSelection.length"
          type="danger"
          @click="batchDelete"
          size="mini"
        >批量删除</el-button>
      </el-form-item>
      <!-- 分页 -->
      <el-form-item style="width: 84%;">
        <pagination
          v-show="total > 0"
          :total="total"
          :limit.sync="pagination.pageSize"
          :page.sync="pagination.pageIndex"
          @pagination="paginationChange"
        />
      </el-form-item>
    </el-form>

    <!-- 图片详情展示 -->
    <el-dialog
      title="详情展示"
      :visible.sync="dialogImageVisible"
      width="55%"
      top="12vh"
      custom-class="imagePreView"
    >
      <el-tabs
        tab-position="left"
        v-model="defaultImageType"
        style="height: 70vh;width: 100%;"
        type="border-card"
        @tab-click="tabChanged"
      >
        <el-tab-pane
          v-for="(item, index) in imageMenus"
          :key="index"
          :name="item.value"
          :label="item.name"
        ></el-tab-pane>
        <div
          style="width: 100%; height: 100%;overflow: auto;"
          v-loading="!dialogImage"
          element-loading-text="图片加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-image
            style="width: 100%;height:auto;"
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
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { deepClone } from '@/utils/index'
import GeneralOptions from '@/utils/generalOptions'
import ToolLibrary from '@/utils/toolLibrary'
import FileDownload from '@/utils/fileDownload'
import Pagination from '@/components/Pagination'
import ForecastSearch from './components/forecastSearch'
import {
  getForecastList,
  getDetail,
  getDownload,
  getListsDownload,
  deleteRowData
} from '@/api/forecastData'

export default {
  name: 'ForecastData',
  components: { Pagination, ForecastSearch },
  data() {
    return {
      dialogImage: '', // 预览图片】
      imageCache: {},
      dialogImageVisible: false, // 图片 dialog

      checked: false,
      multipleSelection: [],
      numberOptions: new GeneralOptions().numberOfPerPage(),
      sortOptions: new GeneralOptions().listSorting(),

      listDatas: [],
      total: 0,
      tableMeta: [
        // { key: 'id', label: '文件索引' },
        { key: 'type', label: '文件类型', width: 80 },
        { key: 'time', label: '时间', width: 180 },
        { key: 'period', label: '时效', width: 80 },
        { key: 'presure', label: '层次', width: 100 },
        { key: 'ENS', label: '集合预报', width: 100 },
        { key: 'element', label: '要素' }
      ],
      pagination: {
        pageIndex: 1,
        pageSize: 10
      },
      searchMoel: null,
      listLoading: false,
      imageMenus: [],
      defaultImageType: 'contour',
      activeData: null
    }
  },
  methods: {
    /**
     * 获得数据列表
     * @method getList
     */
    getList() {
      // if (!this.searchMoel.type) return
      this.listLoading = true
      const params = {
        ...this.searchMoel,
        ...this.pagination,
        ...{ pageIndex: this.pagination.pageIndex - 1 }
      }
      getForecastList(params)
        .then(res => {
          this.listDatas = res.data
          this.listDatas.forEach(
            item =>
              (item.time = moment(item.time, 'YYYYMMDDhhmmss').format(
                'YYYY-MM-DD HH:mm:ss'
              ))
          )
          this.listDatas.forEach(item => (item.ENS = params.ens))
          this.total = res.TotalElements
        })
        .catch(err => {
          this.listDatas = []
          this.total = []
        })
        .finally(res => {
          this.listLoading = false
        })
    },

    /**
     * 搜索条件改变触发
     * @method handleSearchFilter
     */
    handleSearchFilter(obj) {
      if (obj && obj.levelType) {
        this.tableMeta.forEach(item => {
          if (item.key === 'presure') {
            item.label = `层次(${obj.levelType})`
          }
        })
      } else {
        this.tableMeta.forEach(item => {
          if (item.key === 'presure') {
            item.label = `层次`
          }
        })
      }
      this.pagination.pageIndex = 1
      this.searchMoel = { ...obj }
      this.getList()
    },

    /**
     * 根据要素名称获取要素详情显示菜单类型
     * @method getMenuNum
     */
    getMenuNum(elementName) {
      const pattern1 = /^[vVuU][-_]/
      const pattern2 = /[-_][vVuU]$/
      const pattern3 = /[-_][vVuU][-_]/
      const obj = [
        { value: 'contour', name: '等值线' },
        { value: 'contourf', name: '等值面' },
        { value: 'barb', name: '风羽图' }
      ]
      return [pattern1, pattern2, pattern3].filter(item =>
        item.test(elementName)
      ).length
        ? obj
        : obj.slice(0, 2)
    },

    /**
     * 获取要素显示图片的url
     * @method getImageUrl
     */
    async getImageUrl() {
      let url = ''
      const key =
        this.activeData.id + this.activeData.time + this.defaultImageType

      if (this.imageCache[key]) {
        this.dialogImage = this.imageCache[key]
        return
      } else {
        this.dialogImage = null
      }

      const params = {
        id: this.activeData.id,
        picturetype: this.defaultImageType,
        type: this.activeData.type
      }
      try {
        const result = await getDetail(params)
        const blob = new Blob([result])
        url = URL.createObjectURL(blob)

        if (!this.imageCache[key]) {
          this.imageCache[key] = url
        }
      } catch (err) {
        if (err.response.status == 404) {
          this.$message({ message: '该接口服务端还没有实现', type: 'error' })
        }
      }

      this.dialogImage = url
    },

    /**
     * 点开弹窗显示默认选中图片
     * @method showImage
     */
    async showImage(rowData) {
      this.dialogImageVisible = true
      this.defaultImageType = 'contour'

      this.activeData = rowData
      this.imageMenus = this.getMenuNum(rowData.element)
      this.getImageUrl()
    },

    /**
     * tab切换显示对应图片
     * @method tabChanged
     */
    async tabChanged(tab) {
      this.defaultImageType = tab.name
      this.getImageUrl()
    },

    delete(id) {
      this.listLoading = true
      deleteRowData({ id })
        .then(res => this.getList())
        .catch(err => this.$message({ message: '删除失败', type: 'error' }))
        .finally(res => (this.listLoading = false))
    },

    /**
     * 删除记录;
     * @method deleteData
     */
    deleteData(rowData) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => this.delete(rowData.id))
        .catch(err => {})
    },
    /**
     * 批量删除逻辑;
     * @method batchDelete
     */
    batchDelete() {
      this.$confirm(
        `此操作将删除您选中的${this.multipleSelection.length}记录, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const id = this.multipleSelection.map(item => item.id).join()
          this.delete(id)
          this.checked = false
        })
        .catch(err => {})
    },

    /**
     * 分页条件变化监听
     * @method paginationChange
     */
    paginationChange() {
      this.checked = false
      this.getList()
    },

    /**
     * 排序和页面条数的改变;
     * @method handleFilter
     */
    handleFilter() {
      this.checked = false
      this.pagination.pageIndex = 1
      this.getList()
    },

    /**
     * 监听全选操作
     * @method checkAll
     */
    checkAll() {
      this.$refs.multipleTable.toggleAllSelection()
    },

    /**
     * 记录多选的结果;
     * @method handleSelectionChange
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
     * 计算序号的值
     * @method indexMethod
     */
    indexMethod(index) {
      return (
        (this.pagination.pageIndex - 1) * this.pagination.pageSize + 1 + index
      )
    },

    // 单文件下载
    handleDownLoad(command) {
      const { id, filetype } = command
      const type = this.searchMoel.type || 'wafs'
      // 调用下载接口；
      getDownload({ id, type, filetype })
        .then(res => {
          new FileDownload().zipDownload(res.zipUrl)
        })
        .catch(() => this.$message.error('下载失败！'))
    },

    /**
     * 批量下载
     * @method handleAllDownload
     */
    handleAllDownload(filetype) {
      const ids = this.multipleSelection.map(item => item.id).join()
      getListsDownload({ ids, type: this.searchMoel.type || 'wafs', filetype })
        .then(res => new FileDownload().zipDownload(res.zipUrl))
        .catch(() => this.$message.error('下载失败'))
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
  margin: 10px 10px 10px 10px;
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
.frameTitle {
  background: #f2f2f2;
  width: 100%;
  line-height: 45px;
  text-align: left;
  color: #666666;
  padding-left: 20px;
  border-bottom: 1px solid #dadada;
  margin-bottom: 50px;
}
.closePic {
  position: absolute;
  top: 10px;
  right: 13px;
  color: #999999;
  cursor: pointer;
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
