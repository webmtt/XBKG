<template>
  <div class="app-container">
    <!-- 个例查询 -->
    <el-form>
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
              v-model="listQuery.filetype"
              placeholder="数据类型"
              class="filter-item"
              style="width: 178px;"
              @change="handleListTypeFilter"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.label"
                :label="item.label"
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
      <el-table-column
        label="操作"
        align="center"
        :width="210"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }" class="tableButtom">
          <el-button size="mini" type="success" @click="handleDownLoad(row)">下载</el-button>
          <el-button
            size="mini"
            style="margin-left: 0"
            type="warning"
            @click="handleDetails(row)"
          >预览</el-button>
          <el-button size="mini" style="margin-left: 0" type="danger" @click="handleDelete(row)">删除</el-button>
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
      width="55%"
      top="12vh"
      custom-class="imagePreView"
    >
      <div
        v-loading="!dialogImage"
        style="width: 100%; height: 70vh;padding: 10px"
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <iframe
          v-if="isFrame && dialogImage"
          style="border: 1px solid #ccc"
          :src="dialogImage"
          width="100%"
          height="100%"
        ></iframe>

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
  </div>
</template>

<script>
import GeneralOptions from '@/utils/generalOptions'
import Pagination from '@/components/Pagination'
import moment from 'moment'
import {
  getforecastProductList,
  getforecastProductDownload,
  getforecastListDownload,
  getForecasDelete,
  getforecastProductDocUrl
} from '@/api/forecastData'
import { getObserveDeleteAll } from '@/api/airportObserve'
import FileDownload from '@/utils/fileDownload'

export default {
  name: 'ProductObserve',
  components: { Pagination },
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
      isFrame: false,
      imageCache: {},
      timeScope: [this.beginTime, this.endTime],
      typeOptions: [
        {
          value: 1,
          label: '高空风温预告图',
          name: 'FB'
        },
        {
          value: 2,
          label: '重要天气预告图',
          name: 'FN'
        },
        {
          value: 3,
          label: '区域预警',
          name: 'YJ'
        },
        {
          value: 4,
          label: '区域天气概率通报表',
          name: 'MR1'
        },
        {
          value: 5,
          label: '终端区预警',
          name: 'ZD'
        },
        {
          value: 6,
          label: '机场警报',
          name: 'JJ'
        },
        {
          value: 7,
          label: '机场天气概率通报表',
          name: 'MR2'
        },
        {
          value: 8,
          label: '航空器空中报告',
          name: 'AR'
        },
        {
          value: 9,
          label: '天气通报',
          name: 'WT'
        },
        {
          value: 10,
          label: '地区天气趋势',
          name: 'WZ'
        },
        {
          value: 11,
          label: '民航重要天气快报',
          name: 'KB'
        }
      ],
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
      listQuerySort: '-id',
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
        { key: 'time', label: '时间', width: 250 },
        { key: 'filetype', label: '产品类别', width: 250 },
        { key: 'filename', label: '文件名称' }
      ],
      listQuery: {
        page: 1,
        numperpage: 10,
        filetype: 2,
        begintime: this.beginTime,
        sort: this.listQuerySort,
        endtime: this.endTime
      },
      beginTime: '',
      endTime: '',
      deleteType: ''
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
        type: this.deleteType,
        db: 'PROG'
      }).finally(res => {
        this.$Message.success('删除成功')
        setTimeout(() => {
          this.getList()
          this.checked = false
        }, 500)
      })
    },
    handleListTypeFilter() {
      this.listQuery.page = 1
      this.checked = false
      this.getList()
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
      this.checked = false
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 单文件下载
    handleDownLoad(d) {
      getforecastListDownload({ ids: d.id, filetype: this.listQuery.filetype })
        .then(res => {
          new FileDownload().zipDownload(res.zipUrl)
        })
        .catch(() => {
          this.$message.error('下载失败！')
        })
    },
    // 批量下载
    handleAllDownload() {
      const ids = this.multipleSelection.map(item => item.id)
      getforecastListDownload({
        ids: ids.join(','),
        filetype: this.listQuery.filetype
      })
        .then(res => {
          new FileDownload().zipDownload(res.zipUrl)
        })
        .catch(() => {
          this.$message.error('下载失败')
        })
    },
    showImage(d) {
      const key = d.id + d.time
      if (this.imageCache[key]) {
        this.dialogImage = this.imageCache[key]
        return
      } else {
        this.dialogImage = null
      }

      getforecastProductDownload({
        id: d.id,
        filetype: this.listQuery.filetype
      })
        .then(rec => {
          // 加载显示
          const blob = new Blob([rec], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          })
          this.dialogImage = URL.createObjectURL(blob)

          this.imageCache[key] = this.dialogImage
          // 图片对话框
        })
        .catch(() => this.$message.error('详情打开失败'))
    },
    showDoc(d) {
      this.dialogImage = null
      getforecastProductDocUrl({
        id: d.id,
        filetype: this.listQuery.filetype
      }).then(res => {
        this.dialogImage = res.zipUrl // `http://view.xdocin.com/xdoc?_xdoc=${res.zipUrl}`
      })
    },
    handleDetails(d) {
      this.isFrame = d.form !== 'J'
      this.dialogImageVisible = true
      this.dialogTypeName = d.filetype
      if (d.form === 'J') {
        this.showImage(d)
      } else {
        this.showDoc(d)
      }
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
              getForecasDelete({
                id: row.id,
                filetype: this.listQuery.filetype
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
      return (this.listQuery.page - 1) * this.listQuery.numperpage + 1 + index
    },
    getList() {
      this.listQuery.sort = this.listQuerySort
      this.listLoading = true
      if (!this.listQuery.begintime) {
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
      }
      getforecastProductList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.list.forEach(
          item =>
            (item.time = moment(item.time, 'YYYYMMDDhhmmss').format(
              'YYYY-MM-DD HH:mm:ss'
            ))
        )
        this.list.map(item => {
          if (item.filetype === '2') {
            item.filetype = '重要天气预告图'
          } else if (item.filetype === '1') {
            item.filetype = '高空风温预告图'
          } else if (item.filetype === '3') {
            item.filetype = '区域预警'
          } else if (item.filetype === '4') {
            item.filetype = '区域天气概率通报表'
          } else if (item.filetype === '5') {
            item.filetype = '终端区预警'
          } else if (item.filetype === '6') {
            item.filetype = '机场警报'
          } else if (item.filetype === '7') {
            item.filetype = '机场天气概率通报表'
          } else if (item.filetype === '8') {
            item.filetype = '航空器空中报告'
          } else if (item.filetype === '9') {
            item.filetype = '天气通报'
          } else if (item.filetype === '10') {
            item.filetype = '地区天气趋势'
          } else {
            item.filetype = '民航重要天气快报'
          }
        })
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
  margin-left: 35px;
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
