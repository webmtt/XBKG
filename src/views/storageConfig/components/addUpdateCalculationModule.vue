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
    <div class="modalDetails" style="height: 410px;overflow: hidden">
      <el-scrollbar style="height: 100%;">
        <el-form
          v-if="show"
          ref="dataCollectForm"
          :rules="rules"
          :model="formModel"
          inline
          label-width="120px"
        >
          <el-form-item v-if="ifShow===true" style="display: block;
    margin-left: 156px;" prop="files">
            <span id="uploadFile">
              <input
                id="file"
                style="margin: 15px 0px 15px -4px;line-height: 26px;"
                type="file"
                ref="fileId"
                @change="getFile"
              />
              <span>请先上传文件!</span>
            </span>
          </el-form-item>
          <el-form-item label="数据名称：" prop="name">
            <el-input :disabled="!ifShow" style="width: 308px;" v-model="formModel.name" placeholder="数据名称"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 12px;" label="输入参数样例：" prop="inParam">
            <el-input style="width: 308px;" v-model="formModel.inParam" placeholder="输入参数样例"></el-input>
          </el-form-item>
          <el-form-item label="输出参数样例：" prop="outParam">
            <el-input style="width: 308px;" v-model="formModel.outParam" placeholder="输出参数样例"></el-input>
          </el-form-item>
          <!-- <el-form-item label="时间：" prop="addtime">
            <el-date-picker v-model="formModel.addtime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>-->
          <el-form-item label="描述：" prop="description">
            <el-input style="width: 308px;" v-model="formModel.description" placeholder="描述"></el-input>
          </el-form-item>
        </el-form>
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
import { addPluginTab, updatePluginTab, uploadPlugin } from '@/api/storage'
export default {
  data() {
    return {
      editMode: '',
      datastorageShow: false,
      rules: {
        // name: [{ required: true, message: '请输入数据名称', trigger: 'blur' }],
      },
      footerShow: true,
      ifShow: true,
      loading: false,
      show: this.modalData.show,
      formModel: this.resetFormModel(),
      pathValue: '',
    }
  },
  computed: {},
  watch: {
    modalData(newValue) {
      if(newValue.flag ==='update'){
        this.ifShow = false
      }else{
        this.ifShow = true
      }
      this.editMode = this.modalData.flag
      this.show = newValue.show

      const plainModel = this.resetFormModel()
      if (this.modalData.data) {
        Object.keys(plainModel).forEach((key) => {
          plainModel[key] = this.modalData.data[key]
        })
      }
      this.formModel = plainModel
    },
  },
  props: ['modalData'],
  methods: {
    getFile() {
      //获取file内容
      let files = this.$refs.fileId.files[0]
      this.xlsxFile = files
      if (this.xlsxFile == '') {
        this.$message.error('请先添加文件')
        return
      }
      // vue 中使用 window.FormData(),否则会报 'FormData isn't definded'
      //创建一个FormData对象，然后通过append() 方法向对象中添加键值对
      let formData = new window.FormData()
      formData.append('files', this.xlsxFile)
      uploadPlugin(formData).then((response) => {
        this.pathValue = response.data[0].path
        this.$message({
          showClose: true,
          message: response.msg==='ERROR'?response.data:'上传成功',
          type: 'success',
        })
      })
    },
    timeFilter() {},
    resetFormModel() {
      return {
        inParam: '',
        name: '',
        outParam: '',
        path: '',
        addtime: '',
        description: '',
        id:''
      }
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
          if (this.modalData.flag === 'insert') {
            params.path = this.pathValue
            addPluginTab(params)
              .then((res) => {
                if (res.data) {
                  this.$Message.info(`数据类型和路径属性已配置`)
                } else {
                  this.$Message.info(`${titlePreText}成功`)
                }
                this.$emit('handleSucc')
              })
              .finally((res) => {
                this.show = false
                this.loading = false
                this.pathValue = ''
              })
          } else {
            updatePluginTab(params)
              .then((res) => {
                if (res.data) {
                  this.$Message.info(`数据类型和路径属性已配置`)
                } else {
                  this.$Message.info(`${titlePreText}成功`)
                }
                this.$emit('handleSucc')
              })
              .finally((res) => {
                this.show = false
                this.loading = false
              })
          }
        }
      })
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss" scoped>
.file-name {
  display: block;
}
.modalDetails div {
  font-size: 16px;
  font-weight: 600;
  line-height: 50px;
}
.modalDetails .el-form-item.el-form-item--medium {
  margin: 5px 0px 5px 115px;
}
.modalDetails .el-select.el-select--medium {
  width: 308px;
}
.modalDetails span {
  font-weight: 400;
  margin-left: 10px;
}
img {
  padding-left: 62px;
}
#uploadFile span {
  color: white;
  background: #5bc0be;
  padding: 9px;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
}
</style>
