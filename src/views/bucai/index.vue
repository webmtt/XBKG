<template>
  <div class="app-container">
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>数据补录</span>
        <div>
          <i
            style="cursor:pointer
          "
            :class="is_show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show = !is_show"
          ></i>
          <span
            style="cursor:pointer
          "
            @click="is_show = !is_show"
          >{{is_show==true? '收起':'展开'}}</span>
        </div>
      </el-form-item>
    </el-form>

    <!--搜索操作 -->
    <div class="opt" v-if="is_show">
      <span style="font-size:14px;">数据类型:</span>
      <el-select
        @change="dataClassifyEvent"
        style="width: 150px;"
        v-model="dataClassify"
        placeholder="数据分类"
      >
        <el-option
          v-for="item in dataClassifyoptions"
          :key="item.typecode"
          :label="item.typename"
          :value="item.typecode"
        ></el-option>
      </el-select>
      <el-select
        style="width: 200px;"
        @change="dataTypeEvent"
        v-model="beginBucai.dataType"
        placeholder="数据类型"
      >
        <el-option
          v-for="item in dataTypeoptions"
          :key="item.datatypecode"
          :label="item.datatypename"
          :value="item.datatypecode"
        ></el-option>
      </el-select>
      <span v-if="dataPathOptions.length">
        <span style="font-size:14px;margin-left: 25px;">目录层级:</span>
        <el-select style="width: 150px;" v-model="beginBucai.scanPath" placeholder="目录层级">
          <el-option
            v-for="(item,index) in dataPathOptions"
            :key="index"
            :label="item.typename"
            :value="item.typecode"
          ></el-option>
        </el-select>
      </span>
      <span style="margin-left:25px;font-size:14px">历史时间:</span>
      <el-date-picker
        :clearable="false"
        :editable="false"
        v-model="beginBucai.date"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择结束时间"
      ></el-date-picker>
      <el-form ref="ruleForm" :model="ruleForm" style="float:right;">
        <el-form-item style="display:inline-block;" v-model="ruleForm.file" prop="file">
          <el-upload
            ref="upload"
            class="uploadClass"
            :headers="myHeaders"
            multiple
            :on-success="handleAvatarSuccess"
            :action="uploadUrl()"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上传数据</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item style="display:inline-block;">
          <el-button @click="beginBucaiEvent()">开始补录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表展示 -->
    <div class="dataTable">
      <div class="headTitle">
        <span class="el-icon-s-operation" style="font-size:18px"></span>
        <span style="font-size:16px">补采列表</span>
        <div style="float:right">
          <el-button style="margin-right:10px;" :loading="ifReload" @click="reLoad">刷新</el-button>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
        <el-table-column prop="datatype" label="数据类型" align="center" width="180" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="filePath" align="center" label="上传路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="fileName" align="center" label="文件名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="history" label="历史时间" align="center" width="180" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="collectiontime" align="center" label="补采时间" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column prop="state" align="center" label="补录状态"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }" class="tableButtom">
            <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:30px;text-align:right;">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="page"
          :limit.sync="limit"
          @pagination="paginationChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
const token = Cookies.get('token')
import {
  getBucaiList,
  getDataTypes,
  getBucaiData,
  getDataTypeClassify,
  getTypepath,
  getReportDelete
} from '@/api/collection'
export default {
  components: { Pagination },
  data() {
    const day1 = new Date()
    this.beginTime =
      day1.getFullYear() +
      '-' +
      (day1.getMonth() + 1) +
      '-' +
      day1.getDate() +
      ' 00:00:00'
    return {
      myHeaders: { token: token },
      dataClassify: 1,
      dataTypeoptions: [],
      dataClassifyoptions: [],
      ruleForm: { file: '' },
      beginBucai: {
        dataType: 'msg',
        date: this.beginTime,
        scanPath: ''
      },
      beginTime: '',
      fileList: [],
      value: '',
      sort: 'desc', //  排序字段
      limit: 10,
      page: 0, // 页容量
      dataTypeoptions: [],
      is_show: true,
      is_show1: true,
      tableData: [],
      startTime: '2019-10',
      endTime: '2020-02',
      type: 'temp',
      total: 0,
      dataPathOptions: [],
      upLoadFileNums: 0,
      ifReload: false
    }
  },
  computed: {},

  created() {},
  mounted() {
    this.getInit()
  },
  methods: {
    reLoad() {
      this.ifReload = true
      setTimeout(() => {
        this.ifReload = false
      }, 1000)
      // this.dataClassify = 1
      // const day1 = new Date()
      // this.beginTime =
      //   day1.getFullYear() +
      //   '-' +
      //   (day1.getMonth() + 1) +
      //   '-' +
      //   day1.getDate() +
      //   ' 00:00:00'
      // this.beginBucai = {
      //   dataType: 'msg',
      //   date: this.beginTime,
      //   scanPath: ''
      // }
      this.page = 1
      this.getInit()
    },
    // 上传文件
    uploadUrl() {
      // console.log(this.beginBucai.date)
      return `http://121.36.62.243:8084/server/report/upload?scanPath=${this.beginBucai.scanPath}&date=${this.beginBucai.date}&dataType=${this.beginBucai.dataType}`
    },
    // 上传文件成功后
    handleAvatarSuccess(res, file, fileList) {
      this.upLoadFileNums++
      if (this.upLoadFileNums === fileList.length) {
        this.$refs['upload'].clearFiles()
        this.getInit()
        this.upLoadFileNums = 0
      }
    },
    indexMethod(index) {
      return (this.page - 1) * this.limit + 1 + index
    },
    paginationChange() {
      this.checked = false
      this.getInit()
    },
    dataTypeEvent() {
      // 请求目录层级下拉选择列表
      this.dataPathOptions = []
      this.beginBucai.scanPath = ''
      getTypepath({ dataTypeCode: this.beginBucai.dataType }).then(res => {
        res.data.forEach(item => {
          if (item.directory !== '') {
            this.dataPathOptions.push({
              typecode: item.directory,
              typename: item.directory
            })
          }
        })
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
              getReportDelete([row.id])
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
                this.getInit()
              }, 300)
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
    dataClassifyEvent() {
      this.beginBucai.dataType = ''
      this.beginBucai.scanPath = ''
      this.dataPathOptions = []
      getDataTypes({ type: this.dataClassify }).then(response => {
        this.dataTypeoptions = response.data
        this.beginBucai.dataType = this.dataTypeoptions[0]
      })
    },
    handleChange(file, fileList) {
      // if (fileList.length && fileList.length >= 1) {
      //   setTimeout(() => {
      //     this.$refs['upload'].clearFiles()
      //   }, 10000)
      // }
    },
    handleRemove() {},
    search() {
      this.page = 1
      this.getInit()
    },
    //  获取列表数据
    getInit() {
      // 请求目录层级下拉选择列表
      this.dataPathOptions = []
      getTypepath({ dataTypeCode: this.beginBucai.dataType }).then(res => {
        res.data.forEach(item => {
          if (item.directory !== '') {
            this.dataPathOptions.push({
              typecode: item.directory,
              typename: item.directory
            })
          }
        })
      })
      // 数据类型
      getDataTypes({ type: this.dataClassify  }).then(response => {
        this.dataTypeoptions = response.data
      })
      getDataTypeClassify().then(response => {
        this.dataClassifyoptions = response.data.filter(
          ix => ix.typename !== '咸阳机场自观'
        )
      })
      // 请求数据列表
      getBucaiList({
        sort: this.sort,
        pageNum: this.page,
        limit: this.limit
      }).then(res => {
        this.tableData = res.data.list
        this.tableData.forEach(item => {
          item.state === 1
            ? (item.state = '完成')
            : item.state === 0
            ? (item.state = '未完成')
            : (item.state = '异常')
        })
        this.tableData.forEach(ix => {})
        this.total = res.data.total
      })
    },
    // 开始补录
    beginBucaiEvent() {
      getBucaiData()
        .then(res => {
          this.getInit()
        })
        .finally(res => {
          this.$Message.success('补录成功')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadClass {
  display: inline-block;
}
.uploadClass .tableButtom .el-button--primary[data-v-66c0361e],
.el-button--primary[data-v-66c0361e] {
  color: #606266;
  border: 1px solid #dcdfe6;
  padding: 10px;
  font-size: 14px;
  background: white;
  width: 102px;
}
.app-container {
  .opt {
    height: 50px;
    width: 100%;
    border: 1px solid #e4e4e4;
    padding: 5px 20px;
  }
  .dataTable {
    .headTitle {
      line-height: 50px;
      background: #f3f3f3;
      padding: 7px;
      border: 1px solid #e4e4e4;
      margin-top: 25px;
      border-bottom: 0px;
    }
  }
  .chartBar {
    width: 100%;
    height: 50vh;
  }
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
