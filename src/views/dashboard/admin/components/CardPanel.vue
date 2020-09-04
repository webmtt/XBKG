<template>
  <el-row :gutter="20" class="panel-group">
    <el-col
      v-for="(item, index) in fileLists"
      :key="index"
      :xs="8"
      :sm="8"
      :lg="8"
      :class="[index < 3 ? 'card-panel-col' : '']"
    >
      <div :class="{ activeStatus: item.status == 1 }" class="card-panel">
        <div class="header">
          <div
            @click="routerLink(item)"
            :style="{ backgroundImage: 'url(' + headerImage + ')' }"
            class="card-head"
          >
            <i class="el-icon-caret-right"></i>
            {{ item.name }}
          </div>
          <div style="color: #324f9d">共{{ item.subClass }}类</div>
          <img
            :src="require('@/assets/sys_images/more.png')"
            @click="showDetail(item)"
          />
        </div>
        <div class="content">
          <div class="content-img" style>
            <img class="card-img" :src="item.img" />
          </div>
          <div style="flex: 3;height: 80%;">
            <ul>
              <li :style="{ color: item.status == 1 ? '#24d2f0' : '#666' }">
                采集状态：
                <span
                  v-show="!breakStatus"
                  :class="{
                    'ar-animated': true,
                    greenDot: item.status == 2,
                    greyDot: breakStatus
                  }"
                ></span>
                <span v-show="item.status == 1">{{ qqContext }}</span>
              </li>
              <li style="letter-spacing: 1px" v-if="item.type !== 5">
                吞 吐 量：
                <span>{{ item.capacity }}</span>
              </li>
              <li>
                {{ item.type == '5' ? '数据条数' : '文件个数' }}：
                <span>{{ item.total }}</span>
              </li>
              <li>
                更新时间：
                <span>{{ item.updateTime ? item.updateTime : '--' }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-col>
    <el-dialog
      center
      class="fileDetails"
      :title="tableData.name + '详情'"
      :show-close="true"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-table class="tableClass" :data="tableData.data" style="width: 90%;margin: 0 auto;">
        <el-table-column
          prop="key"
          label="类型"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="cName"
          align="center"
          label="名称"
        ></el-table-column>
        <el-table-column
          prop="value"
          align="center"
          label="文件个数"
        ></el-table-column>
      </el-table>
      <!-- <hr /> -->
      <!-- :header-cell-style="tableHeaderColor" -->
      <el-table
        v-if="tableData.reportList.length"
        :data="tableData.reportList"
        style="width: 90%;margin:0px auto;margin-top: 20px;"
      >
        <el-table-column
          prop="key"
          label="类型"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="cName"
          align="center"
          label="名称"
        ></el-table-column>
        <el-table-column
          prop="value"
          align="center"
          label="报文个数"
        ></el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import options from '../../options.js'
export default {
  components: {},
  props: {
    cardData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      qqContext: '',
      i: 1,
      breakStatus: false,
      dialogVisible: false,
      tableData: { name: '', data: [], reportList: [] },
      fileLists: options.fileLists,
      typeFileLists: [],
      headerImage: require('@/assets/sys_images/icon.png')
    }
  },
  watch: {
    cardData(newValue) {
      let updataTime = new Date()
      let n = null
      if (newValue.socketStatus || newValue.status === false) {
        this.breakStatus = true
      } else {
        this.breakStatus = false
      }
      if (newValue.type === '5') {
        n = newValue.singleMsgCountStatisticalVOS
          ? Object.keys(newValue.singleMsgCountStatisticalVOS).length
          : 0
      } else {
        let n1 = 0
        let n2 = 0
        if (
          newValue.singleMsgCountStatisticalVOS &&
          newValue.singleMsgCountStatisticalVOS.file
        ) {
          n1 = Object.keys(newValue.singleMsgCountStatisticalVOS.file).length
        }
        if (
          newValue.singleMsgCountStatisticalVOS &&
          newValue.singleMsgCountStatisticalVOS.report
        ) {
          n2 = Object.keys(newValue.singleMsgCountStatisticalVOS.report).length
        }
        n = n1 + n2
      }
      const h =
        updataTime.getHours() <= 9
          ? '0' + updataTime.getHours()
          : updataTime.getHours()
      const m =
        updataTime.getMinutes() <= 9
          ? '0' + updataTime.getMinutes()
          : updataTime.getMinutes()
      const s =
        updataTime.getSeconds() <= 9
          ? '0' + updataTime.getSeconds()
          : updataTime.getSeconds()
      this.fileLists.forEach(item => {
        // eslint-disable-next-line eqeqeq
        if (item.type == newValue.type) {
          item.subClass = n
          item.total = newValue.total
          item.capacity = newValue.filesize || '--'
          item.subChild = newValue.singleMsgCountStatisticalVOS
          item.status = 1
          item.updateTime = h + ':' + m + ':' + s
          if (item.timer) window.clearTimeout(item.timer)
          item.timer = setTimeout(() => {
            item.status = 2
          }, 10000)
        }
      })
      updataTime = null
    }
  },
  created() {},
  mounted() {
    this.breakDots()
  },
  destroyed() {
    this.fileLists.forEach(
      item => item.timer && window.clearTimeout(item.timer)
    )
  },
  methods: {
    // 页面跳转
    routerLink(val){
      if(val.name === '民航报文'){
        this.$router.push({ path: '/application/serachDownload/Message' })
      }else if(val.name === '常规观测资料'){
        this.$router.push({ path: '/application/serachDownload/normal-observe' })
      }else if(val.name === '非常规观测'){
        this.$router.push({ path: '/application/serachDownload/airport-observe' })
      }else if(val.name === '模式预报资料'){
        this.$router.push({ path: '/application/serachDownload/forecast-data' })
      }else if(val.name === '咸阳机场自观'){
        this.$router.push({ path: '/application/serachDownload' })
      }else if(val.name === '预报产品'){
        this.$router.push({ path: '/application/serachDownload/product-observe' })
      }
    },
    //  状态显示三个点闪烁效果
    Mchange() {
      var tmp = ''
      for (var j = 0; j < this.i; j++) {
        tmp += '●'
      }
      this.qqContext = tmp
      this.i++
      if (this.i > 3) this.i = 1
    },
    breakDots() {
      setInterval(() => {
        this.Mchange()
      }, 500)
    },
    showDetail(data) {
      this.dialogVisible = true
      this.tableData.name = data.name
      this.tableData.data = []
      this.tableData.reportList = []
      if (data.type !== 5) {
        if (data.subChild && data.subChild.file) {
          Object.keys(data.subChild.file).forEach(item => {
            if (item !== '') {
              const cName = options.dataType.filter(
                // eslint-disable-next-line eqeqeq
                data => data.datatypecode === item
              )[0].datatypename
              this.tableData.data.push({
                key: item,
                value: data.subChild.file[item],
                cName
              })
            }
          })
        }
        if (data.type === 1) {
          if (data.subChild && data.subChild.report) {
            Object.keys(data.subChild.report).forEach(item => {
              if (item !== '') {
                const cName = options.dataType.filter(
                  // eslint-disable-next-line eqeqeq
                  data => data.datatypecode === item
                )[0].datatypename
                this.tableData.reportList.push({
                  key: item,
                  value: data.subChild.report[item],
                  cName
                })
              }
            })
          }
        }
        if (data.type === 6) {
          if (data.subChild && data.subChild.report) {
            Object.keys(data.subChild.report).forEach(item => {
              if (item !== '') {
                const cName = options.dataType.filter(
                  // eslint-disable-next-line eqeqeq
                  data => data.datatypecode === item
                )[0].datatypename
                this.tableData.reportList.push({
                  key: item,
                  value: data.subChild.report[item],
                  cName
                })
              }
            })
          }
        }
      } else {
        Object.keys(data.subChild).forEach(item => {
          if (item !== '') {
            const cName = options.dataType.filter(
              // eslint-disable-next-line eqeqeq
              data => data.datatypecode === item
            )[0].datatypename
            this.tableData.data.push({
              key: item,
              value: data.subChild[item],
              cName
            })
          }
        })
      }
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: lightblue;color: #fff;font-weight: 500;'
      }
    }
  }
}
</script>

<style>
.fileDetails {
  padding: 0 20px;
}
.fileDetails .el-dialog__body {
  padding: 0px 0 20px 0;
}
.el-dialog__header {
  background: transparent;
}
</style>
<style lang="scss" scoped>
.card-panel-col {
  margin-bottom: 20px;
}
.card-panel {
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 200px;
  border-radius: 10px;
  box-shadow: rgba(62, 57, 107, 0.3) 0px 6px 16px 2px;
  transition: all 0.5s ease-in-out 0s;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
    box-shadow: rgba(62, 57, 107, 0.6) 0px 8px 30px 2px;
  }
  .header {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    padding: 0 10px 5px 0;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
    .card-head {
      width: 120px;
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      color: #fff;
    }
  }

  .content {
    flex: 1 1 0%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .content-img {
      flex: 2;
      text-align: center;
    }
    .card-img {
      width: 100px;
      border-radius: 6px;
    }
    @media (max-width: 1400px) {
      .card-img {
        width: 70px;
        border-radius: 6px;
      }
    }
    ul {
      font-size: 14px;
      height: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding-left: 30px;
      li {
        padding: 5px;
        border-bottom: 1px solid rgba(242, 242, 242, 1);
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
        span {
          margin-left: 20px;
          // float: left;
        }
      }
    }
    @media (max-width: 1400px) {
      ul {
        padding-left: 15px;
        li {
          span {
            margin-left: 10px;
          }
        }
      }
    }
  }
  @media (max-width: 1400px) {
    .content {
      .content-img {
        flex: 1 1 0%;
      }
    }
    ul {
      li {
        list-style-type: none;
        span {
          margin-left: 10px;
        }
      }
    }
  }
}

.greenDot {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: #24d2f0;
  border-radius: 10px;
  -webkit-animation-name: move;
  animation-name: move;
}

.greyDot {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: grey;
  box-shadow: 0 2px 12px 0 grey;
  border-radius: 10px;
}
.activeStatus {
  border: 2px solid #24d2f0;
}

@keyframes move {
  0% {
    box-shadow: 0 2px 12px 0 #fff;
  }
  100% {
    box-shadow: 0 2px 12px 0 #24d2f0;
  }
}

.ar-animated {
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
