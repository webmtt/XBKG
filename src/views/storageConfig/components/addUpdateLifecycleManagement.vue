<template>
  <el-dialog
    width="60%"
    :visible.sync="show"
    v-model="show"
    :title="editMode ==='insert' ? '添加生命周期管理' : editMode ==='update' ? '编辑生命周期管理' : '生命周期管理详情'"
  >
    <div class="modalDetails" style="height: 400px;overflow: hidden">
      <el-scrollbar style="height: 100%;">
        <el-form
          :rules="rules"
          ref="dataCollectForm"
          :model="formModel"
          inline
          v-if="show"
          label-width="120px"
        >
          <el-form-item label="数据名称：" prop="dataname">
            <el-input
              :disabled="footerShow === false"
              v-model="formModel.dataname"
              placeholder="数据名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="更新方式：" prop="updateway">
            <el-select
              @change="updateEvent"
              :disabled="footerShow === false"
              v-model="formModel.updateway"
              :label-in-value="true"
            >
              <el-option
                v-for="(item, ix) in filterRulesOptions"
                :label="item.label"
                :value="item.value"
                :key="ix"
              >{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="更新频率：" prop="datasource">
            <el-input v-model="formModel.datasource" placeholder="数据来源"></el-input>
          </el-form-item>-->
          <el-form-item label="存储周期(天)：" prop="lifecycle">
            <el-input
              :disabled="footerShow === false"
              v-model="formModel.lifecycle"
              placeholder="存储周期"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button
        v-show="footerShow == true"
        :disabled="loading"
        type="primary"
        @click="closeModal"
      >取消</el-button>
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
  getCollectionAdd,
  getCollectionUpdate,
  getLifecycle,
  deleteLifecycle,
} from '@/api/collection'
import Options from '../options'
export default {
  data() {
    var isLifecycle = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入一个正数'))
      }
      var matchUrl = /^[1-9]\d*$/
      if (!matchUrl.test(value)) {
        callback(new Error('请输入一个正数'))
      } else {
        callback()
      }
    }
    return {
      directory: '',
      rules: {
        // lifecycle: [{ validator: isLifecycle, trigger: 'blur' }],
      },
      data: [
        { key: 0, label: '风速' },
        { key: 1, label: '湿度' },
        { key: 2, label: '温度' },
        { key: 3, label: '气压' },
        { key: 4, label: '远道视程' },
      ],
      data1: [
        { 风速: { min: 0, max: 0 } },
        { 湿度: { min: 0, max: 0 } },
        { 温度: { min: 0, max: 0 } },
        { 气压: { min: 0, max: 0 } },
        { 跑道视程: { min: 0, max: 0 } },
      ],
      transferList: [],
      timeScope: [],
      hrImg: require('@/assets/sys_images/collectionConfig/hr.png'),
      dataCollectionModel: {
        options: Options.dataClassify.map((item) => item),
        checkItem: null,
        value: '',
      },
      footerShow: true,
      loading: false,
      editMode: 'insert',
      dataTypeOptions: Options.dataType,
      points: [],
      filterRulesOptions: [
        { label: '手动', value: '0' },
        { label: '自动', value: '1' },
      ],
      formModel: this.resetFormModel(),
      show: this.modalData.show,
    }
  },
  computed: {},
  watch: {
    modalData(newValue) {
      if (newValue.data.updateway == '手动') {
        newValue.data.lifecycle = '永久'
      } else {
        newValue.data.lifecycle = newValue.data.lifecycle
      }
      this.directory = newValue.data.directory
      this.editMode = this.modalData.flag
      this.show = newValue.show

      const plainModel = this.resetFormModel()
      if (this.modalData.data) {
        Object.keys(plainModel).forEach((key) => {
          plainModel[key] = this.modalData.data[key]
        })
      }
      if (this.modalData.flag == 'details') {
        this.footerShow = false
      } else {
        this.footerShow = true
      }

      this.formModel = plainModel
    },
  },
  props: ['modalData'],
  methods: {
    resetFormModel() {
      return {
        dataname: '',
        updateway: '',
        lifecycle: 0,
        id: '',
        datatype: '',
      }
    },
    updateEvent() {
      if (this.formModel.updateway == 0) {
        this.formModel.lifecycle = '永久'
      } else {
        this.formModel.lifecycle = 1
      }
    },
    equimentChanged(val) {
      this.formModel.equipmentModel = val
        // .map(item => item.label.split(' ')[0])
        .join(',')
    },
    closeModal() {
      this.$refs['dataCollectForm'].resetFields()
      this.show = false
    },
    updateOrAddDataCollect(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const titlePreText = this.modalData.data ? '更新' : '新增'
          if (!this.modalData.data) {
            var { id, ...params } = this.formModel
          } else {
            var { ...params } = this.formModel
          }
          params.directory = this.directory
          if (this.modalData.flag == 'insert') {
            getCollectionAdd(params)
              .then((res) => {
                this.$Message.info(`${titlePreText}成功`)
                this.$emit('handleSucc')
              })
              .finally((res) => {
                this.show = false
                this.loading = false
              })
          } else {
            params.updateway === '自动' || params.updateway === '1'
              ? (params.updateway = '1')
              : (params.updateway = '0')
            if (params.updateway == '0') {
              params.lifecycle = null
            } else {
              params.lifecycle = params.lifecycle
            }
            getCollectionUpdate(params)
              .then((res) => {
                this.$Message.info(`${titlePreText}成功`)
                this.$emit('handleSucc')
              })
              .finally((res) => {
                this.show = false
                this.loading = false
              })
            if (params.lifecycle !== null) {
              deleteLifecycle({
                collectionName: 'socket',
                lifeCycle: params.lifecycle,
              }).then((res) => {
                getLifecycle({
                  lifeCycleArgs: {
                    collectionName: 'socket',
                    lifeCycle: params.lifecycle,
                  },
                }).then((res) => {})
              })
            } else {
              deleteLifecycle({
                collectionName: 'socket',
                lifeCycle: params.lifecycle,
              } ).then((res) => {})
            }
          }
        } else {
        }
      })
    },
  },
  mounted() {},
}
</script>


<style lang="scss" scoped>
.modalDetails div {
  font-size: 16px;
  font-weight: 600;
  line-height: 40px;
}
.modalDetails .el-form-item.el-form-item--medium {
  margin: 5px 0px 5px 140px;
}
.modalDetails .el-select.el-select--medium {
  width: 226px;
}
.modalDetails span {
  font-weight: 400;
  margin-left: 10px;
}
.collectTitle {
  width: 120px;
  background: #909399;
  border-radius: 4px;
  padding: 1px 0px 1px 24px;
  color: white;
  display: inline-block;
}
img {
  padding-left: 62px;
}
</style>
