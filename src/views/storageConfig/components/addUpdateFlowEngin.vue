<template>
  <el-dialog
    v-model="show"
    width="50%"
    :visible.sync="show"
    :title="
      editMode === 'insert'
        ? '插件添加'
        : editMode === 'update'
        ? '插件编辑'
        : '插件详情'
    "
  >
    <div class="inputData">
      <div style="margin:10px 0px;">
        <span>流程名称：</span>
        <el-input style="width: 150px;" v-model="flowName"></el-input>
        <span style="color: red;font-size: 12px;" v-show="flowNameShow">流程名称不能为空</span>
      </div>
      <div style="margin:10px 0px;">
        <span>初始参数：</span>
        <el-input style="width: 150px;" v-model="flowInparam"></el-input>
      </div>
      <div style="margin:10px 0px;">
        选择周期：
        <el-form style="display:inline-block;" :model="form" label-width="80px">
          <el-form-item style="margin-top: -10px; margin-bottom:0px;">
            <cron v-if="showCronBox" v-model="form.cronExpression"></cron>
            <span
              style="color: #E6A23C; font-size: 12px;"
            >corn从左到右（用空格隔开）：秒 分 小时 月份中的日期 月份 星期中的日期 年份</span>
          </el-form-item>
          <el-form-item label="Cron">
            <el-input v-model="form.cronExpression" auto-complete="off">
              <el-button
                slot="append"
                v-if="!showCronBox"
                icon="el-icon-arrow-up"
                @click="showCronBox = true"
                title="打开图形配置"
              ></el-button>
              <el-button
                slot="append"
                v-else
                icon="el-icon-arrow-down"
                @click="showCronBox = false"
                title="关闭图形配置"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="addinputData">
        <i class="el-icon-circle-plus-outline"></i> 新增插件
      </el-button>
      <el-scrollbar style="height: 70%;">
        <el-table :data="inputTableData" style="width: 100%">
          <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
          <el-table-column prop="paramsName" label="插件名称">
            <template slot-scope="scope">
              <el-select
                @change="paramsNameEvent(scope.row.paramsName)"
                v-model="scope.row.paramsName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in paramsNamesVal"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" class-name="operationBtn" align="center">
            <template slot-scope="scope">
              <span @click="handleDeleteClick(scope.$index,inputTableData,scope.row)">删除</span>
              <el-button
                size="mini"
                :disabled="scope.$index===0"
                @click="moveUp(scope.$index,scope.row)"
              >
                <i class="el-icon-arrow-up"></i>
              </el-button>
              <el-button
                size="mini"
                :disabled="scope.$index===(inputTableData.length-1)"
                @click="moveDown(scope.$index,scope.row)"
              >
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button :disabled="loading" type="primary" @click="closeModal">取消</el-button>
      <el-button
        v-show="footerShow == true"
        :loading="loading"
        type="primary"
        @click="updateOrAddDataCollect('dataCollectForm')"
      >保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {
  getPluginTabList,
  addFlowTab,
  updateFlowTab,
  reschedulejob,
} from '@/api/storage'
import cron from './components/cron'
export default {
  data() {
    return {
      showCronBox: false,
      form: {
        cronExpression: '',
      },
      inputTableData: [
        {
          paramsName: '',
        },
      ],
      flowNameShow: false,
      flowInparam: '',
      show: this.modalData.show,
      editMode: 'insert',
      loading: false,
      footerShow: true,
      flowName: '',
      paramsNamesVal: [],
      listQuery: {
        page: 0,
        limit: 0,
        obj: {
          id: '',
          name: '',
          inParam: '',
          outParam: '',
          path: '',
          addtime: '',
          description: '',
        },
        flowPlugin: [],
        paramsName: '',
        flowId: '',
      },
      cycleValue: '',
    }
  },
  computed: {},
  components: {
    cron,
  },
  watch: {
    modalData(newValue) {
      if (newValue.data) {
        this.cycleValue = newValue.data.cycle
      }
      this.form.cronExpression = ''
      this.showCronBox = false
      this.flowName = ''
      this.flowInparam = ''
      this.inputTableData = []
      this.editMode = this.modalData.flag
      this.show = newValue.show
      if (this.modalData.flag === 'update') {
        this.form.cronExpression = this.modalData.data.cycle
      } else if (this.modalData.flag === 'insert') {
        this.form.cronExpression = ''
      }
      if (this.modalData.data) {
        this.flowName = this.modalData.data.flowName
        this.flowId = this.modalData.data.id
        this.flowInparam = this.modalData.data.flowInparam
        newValue.data.flowPlugin = newValue.data.flowPlugin.split(',')
        newValue.data.flowPlugin[0] = newValue.data.flowPlugin[0].substring(1)
        newValue.data.flowPlugin[
          newValue.data.flowPlugin.length - 1
        ] = newValue.data.flowPlugin[
          newValue.data.flowPlugin.length - 1
        ].substring(
          0,
          newValue.data.flowPlugin[newValue.data.flowPlugin.length - 1].length -
            1
        )
        newValue.data.flowPlugin.forEach((item) => {
          this.inputTableData.push({ paramsName: parseInt(item) })
        })
      }
    },
  },
  props: ['modalData'],
  methods: {
    addinputData() {
      this.inputTableData.push({})
    },
    closeModal() {
      this.$refs['dataCollectForm'].resetFields()
      this.show = false
    },
    updateOrAddDataCollect(name) {
      this.flowPlugin = []
      if (this.inputTableData) {
        this.inputTableData.map((item) => {
          this.flowPlugin.push(item.paramsName)
        })
      }
      this.flowName ? (this.flowNameShow = false) : (this.flowNameShow = true)
      if (!this.flowPlugin.length) {
        this.$Message.info(`请添加插件`)
      } else {
        if (!this.flowNameShow) {
          const titlePreText = this.modalData.data ? '更新' : '新增'
          if (this.modalData.flag === 'insert') {
            addFlowTab({
              flowName: this.flowName,
              flowPlugin: '[' + this.flowPlugin.toString() + ']',
              cycle: this.form.cronExpression,
              flowInparam: this.flowInparam,
            })
              .then((res) => {
                if (res.msg) {
                  this.$Message.info(`添加成功`)
                  this.inputTableData = [
                    {
                      paramsName: '',
                    },
                  ]
                  this.$emit('handleSucc')
                }
              })
              .finally((res) => {
                this.show = false
                this.loading = false
              })
          } else {
            updateFlowTab({
              id: this.flowId,
              flowName: this.flowName,
              flowPlugin: '[' + this.flowPlugin.toString() + ']',
              cycle: this.form.cronExpression,
              flowInparam: this.flowInparam,
            })
              .then((res) => {
                if (res.data) {
                  this.$Message.info(`${res.data}`)
                } else {
                  this.$Message.info(`${titlePreText}成功`)
                }
                if (this.cycleValue !== this.form.cronExpression) {
                  reschedulejob({
                    flowName: this.flowName,
                    cronExpression: this.form.cronExpression,
                  }).then((res) => {
                    this.$emit('handleSucc')
                  })
                }
                this.$emit('handleSucc')
              })
              .finally((res) => {
                this.show = false
                this.loading = false
              })
          }
        }
      }
    },
    handleDeleteClick(index, rows) {
      rows.splice(index, 1)
    },
    paramsNameEvent(val) {
      this.paramsName = val
    },
    //上移
    moveUp(index, row) {
      var that = this
      if (index > 0) {
        let upDate = that.inputTableData[index - 1]
        that.inputTableData.splice(index - 1, 1)
        that.inputTableData.splice(index, 0, upDate)
      } else {
        alert('已经是第一条，不可上移')
      }
    },

    //下移
    moveDown(index, row) {
      var that = this
      if (index + 1 === that.inputTableData.length) {
        alert('已经是最后一条，不可下移')
      } else {
        let downDate = that.inputTableData[index + 1]
        that.inputTableData.splice(index + 1, 1)
        that.inputTableData.splice(index, 0, downDate)
      }
    },
    getList() {
      this.listLoading = true
      getPluginTabList(this.listQuery).then((response) => {
        response.data.list.map((item) => {
          this.paramsNamesVal.push({
            name: item.name,
            id: item.id,
          })
        })
      })
    },
  },
  mounted() {
    this.getList()
  },
}
</script>

<style lang="scss" scoped>
img {
  padding-left: 62px;
}
.inputData {
  width: 100%;
  height: 600px;
  .operationBtn {
    span {
      cursor: pointer;
    }
  }
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 700px;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

