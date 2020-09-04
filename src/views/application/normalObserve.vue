<template>
  <div class="app-container">
    <!-- 个例查询 -->
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
      <el-form-item class="searchContent">
        <el-form v-show="is_show == true">
          <el-form-item>
            <span>数据类型：</span>
            <el-select
              v-model="classification"
              class="filter-item"
              placeholder="类别"
              @change="classificationEvent"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label-width="100px" style="margin:0px 20px;" label="目录层级：">
            <el-select clearable style="width: 150px" v-model="path" placeholder filterable>
              <el-option
                v-for="(item, index) in pathOptions"
                :key="index"
                :label="item.directory"
                :value="item.directory"
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
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
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
          <el-button type="success" size="mini" @click="handleDownLoad(row)">下载</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
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
      :title="dialogTypeName"
      :visible.sync="dialogImageVisible"
      width="70%"
      top="5vh"
      custom-class="custom-class"
    >
      <img :src="dialogImage" style="width:80%; height:auto;margin-left:10%;" />
    </el-dialog>
  </div>
</template>

<script>
import GeneralOptions from '@/utils/generalOptions'
import Pagination from '@/components/Pagination'
import moment from 'moment'
import {
  getNormalGroundList,
  getNormalAutoList,
  getNormalUpperList,
  getNormalDelete,
  getNormalDownload,
  colleSatisticsDataType
} from '@/api/application'
import FileDownload from '@/utils/fileDownload'
import { getObserveDeleteAll } from '@/api/airportObserve'
import { getDirList } from '@/api/forecastData'

export default {
  name: 'ProductObserve',
  components: { Pagination },
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
      pathOptions: [],
      listQuerySort: '-id',
      path: '',
      rotate: false,
      timeScope: [this.beginTimeInit, this.endTimeInit],
      classification: 'ground_data',
      typeOptions: [],
      fullscreenLoading: false, // loadding
      dialogImage: null, // 预览图片】
      dialogTypeName: '', // 预报类型
      dialogImageVisible: false, // 图片 dialog
      checked: false,
      multipleSelection: [],
      modalOption: {
        show: false,
        data: null
      },
      numberOptions: new GeneralOptions().numberOfPerPage(),
      sortOptions: new GeneralOptions().listSorting(),
      is_show: true,
      options: [
        {
          value: '选项1',
          label: '销售部'
        },
        {
          value: '选项2',
          label: '研发部'
        },
        {
          value: '选项3',
          label: '设计部'
        },
        {
          value: '选项4',
          label: '测试部'
        },
        {
          value: '选项5',
          label: '运营部'
        }
      ],
      value: '',
      value1: '',
      value2: '',
      list: [],
      total: 0,
      tableMeta: [
        { key: 'id', label: 'ID', width: 250 },
        { key: 'time', label: '时间', width: 250 },
        { key: 'filename', label: '文件名称' }
      ],
      listQuery: {
        page: 1,
        numperpage: 10,
        begintime: this.beginTimeInit,
        sort: this.listQuerySort,
        endtime: this.endTimeInit,
        path: this.path
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
    getDirList({ type: this.classification }).then(res => {
      this.pathOptions = res.list
      if (this.pathOptions.length) {
        this.path = this.pathOptions[0].directory
      }
    })
  },
  methods: {
    classificationEvent() {
      this.path = ''
      getDirList({ type: this.classification }).then(res => {
        this.pathOptions = res.list
        if (this.pathOptions.length) {
          this.path = this.pathOptions[0].directory
        }
      })
    },
    renovate() {
      this.rotate = !this.rotate
    },
    // 批量删除
    handleAllDelete() {
      this.typeOptions.map(item => {
        if (this.listQuery.filetype === item.value) {
          this.deleteType = item.name
        }
      })
      const idS = this.multipleSelection.map(item => item.id)
      getObserveDeleteAll({
        ids: idS.join(','),
        type: this.classification,
        db: 'NORMAL'
      }).finally(res => {
        this.$Message.success('删除成功')
        setTimeout(() => {
          this.getList()
          this.checked = false
        }, 500)
      })
    },
    timeChange() {
      this.listQuery.begintime = this.timeScope ? this.timeScope[0] : null
      this.listQuery.endtime = this.timeScope ? this.timeScope[1] : null
    },
    checkAll() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    paginationChange() {
      this.checked = false
      this.getList()
    },
    handleFilter() {
      this.rotate = !this.rotate
      this.listQuery.page = 1
      getDirList({ type: this.classification })
        .then(res => {
          this.pathOptions = res.list
          if (this.pathOptions.length) {
            this.path = this.pathOptions[0].directory
          }
        })
        .finally(res => {
          this.getList()
        })
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 单文件下载
    handleDownLoad(d) {
      getNormalDownload({ ids: d.id, type: this.classification })
        .then(res => {
          new FileDownload().zipDownload(res.zipUrl)
        })
        .catch(() => {
          this.$message.error('下载失败！')
        })
    },
    // 批量下载
    handleAllDownload() {
      const id = this.multipleSelection.map(item => item.id)
      getNormalDownload({
        ids: id.join(','),
        type: this.classification
      })
        .then(res => {
          new FileDownload().zipDownload(res.zipUrl)
        })
        .catch(() => {
          this.$message.error('下载失败')
        })
    },
    handleDetails(d) {
      getNormalDownload({
        id: d.id,
        filetype: this.listQuery.filetype
      })
        .then(rec => {
          // 加载显示
          this.fullscreenLoading = false
          const blob = new Blob([rec], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          })
          this.dialogImage = URL.createObjectURL(blob)
          // 图片对话框
          this.dialogImageVisible = true
        })
        .catch(() => {
          // 关闭加载显示
          this.fullscreenLoading = false
          // 关闭图片对话框
          this.dialogImageVisible = false
          this.$message.error('详情打开失败')
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
              getNormalDelete({
                id: row.id,
                type: this.classification
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
        .then(res => {
          console.log('res==', res)
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.numperpage + 1 + index
    },
    getList() {
      this.listQuery.sort = this.listQuerySort
      this.listQuery.path = this.path
      this.listLoading = true
      this.typeOptions = []
      colleSatisticsDataType().then(res => {
        res.data.forEach(item => {
          this.typeOptions.push({
            value: item.datatypecode,
            label: item.datatypename
          })
        })
      })
      if (this.classification === 'ground_data') {
        getNormalGroundList(this.listQuery).then(response => {
          this.list = response.data.list
          this.list.forEach(
            item =>
              (item.time = moment(item.time, 'YYYYMMDDhhmmss').format(
                'YYYY-MM-DD HH:mm:ss'
              ))
          )
          this.total = response.data.total
        })
      } else if (this.classification === 'auto_station') {
        getNormalAutoList(this.listQuery).then(response => {
          this.list = response.data.list
          this.list.forEach(
            item =>
              (item.time = moment(item.time, 'YYYYMMDDhhmmss').format(
                'YYYY-MM-DD HH:mm:ss'
              ))
          )
          this.total = response.data.total
        })
      } else {
        getNormalUpperList(this.listQuery).then(response => {
          this.list = response.data.list
          this.list.forEach(
            item =>
              (item.time = moment(item.time, 'YYYYMMDDhhmmss').format(
                'YYYY-MM-DD HH:mm:ss'
              ))
          )
          this.total = response.data.total
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
form.el-form.data-list.el-form--inline {
  margin-top: 22px;
}
</style>
