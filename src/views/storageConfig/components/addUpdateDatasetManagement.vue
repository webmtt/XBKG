<template>
  <el-dialog
    v-model="show"
    width="50%"
    :visible.sync="show"
    :title="
      editMode === 'insert'
        ? '数据集添加'
        : editMode === 'update'
        ? '数据集编辑'
        : '数据集详情'
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
          <el-form-item label="数据分类：" prop="dataclassification">
            <el-select
              v-model="formModel.dataclassification"
              placeholder="数据分类"
              :disabled="!disabledClassify"
              @change="dataClassifyEvent"
            >
              <el-option
                v-for="item in dataClassifyoptions"
                :key="item.typecode"
                :label="item.typename"
                :value="item.typename"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据类型：" prop="datatype">
            <el-select
              v-model="formModel.datatype"
              placeholder="数据类型"
              :disabled="!disabledType"
              @change="dataTypeEvent"
            >
              <el-option
                v-for="item in dataTypeoptions"
                :key="item.datatypecode"
                :label="item.datatypename"
                :value="item.datatypename"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="datastorageShow" label="数据存储：" prop="datastorage">
            <el-input v-model="formModel.datastorage" placeholder="数据存储"></el-input>
          </el-form-item>
          <el-form-item label="数据名称：" prop="dataname">
            <el-input style="width: 308px;" v-model="formModel.dataname" placeholder="数据名称"></el-input>
          </el-form-item>
          <el-form-item label="目录属性：" prop="directory">
            <el-input style="width: 308px;" v-model="formModel.directory" :disabled="!this.disabledDirectory"></el-input>
          </el-form-item>
          <el-form-item class="file-name" label="文件时间：" prop="timetype">
            <el-radio-group v-model="formModel.timetype" @change="timeFilter">
              <el-radio label="0">世界时</el-radio>
              <el-radio label="1">北京时</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数据说明：" prop="illustration">
            <el-input
              style="width: 308px;"
              type="textarea"
              v-model="formModel.illustration"
              placeholder="数据说明"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="formModel.dataclassification==='模式预报数据'" label="经纬度选择：">
            <el-select v-model="lonLatSelection" placeholder="经纬度选择" @change="dataLonLat">
              <el-option
                v-for="(item,index) in lonLatSelections"
                :key="item.index"
                :label="item.typename"
                :value="item.typecode"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-if="formModel.dataclassification==='模式预报数据'" label="起止经度：">
            <el-form-item style="margin-left:0px;width:105px;margin-top: 0px;">
              <el-input v-model="formModel.lonBeginInput"></el-input>
            </el-form-item>
            <i class="el-icon-arrow-right"></i>
            <el-form-item style="width:105px;margin-left:0px;margin-top: 0px;">
              <el-input v-model="formModel.lonEndInput"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formModel.dataclassification==='模式预报数据'" label="起止纬度：">
            <el-form-item style="margin-left:0px;width:105px;margin-top: 0px;">
              <el-input v-model="formModel.latBeginInput"></el-input>
            </el-form-item>
            <i class="el-icon-arrow-right"></i>
            <el-form-item style="width:105px;margin-left:0px;margin-top: 0px;">
              <el-input v-model="formModel.latEndInput"></el-input>
            </el-form-item>
          </el-form-item> -->
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
import {
  getCollectionAdd,
  getCollectionUpdate,
  getDataTypes,
  getDataTypeClassify,
  getDirectoryLevels,
  updateDirectoryLevels,
  getResionInfo
} from '@/api/collection'
import Options from '../options'
export default {
  data() {
    var isdirectory = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      var matchUrl = /^\/[a-zA-Z_0-9\\]*/
      if (!matchUrl.test(value.trim())) {
        callback(new Error('不是正确目录'))
      } else {
        callback()
      }
    }
    return {
      lonLatSelections: [],
      lonLatSelection: '',
      datastorageShow: false,
      rules: {
        dataclassification: [
          { required: true, message: '请选择数据分类', trigger: 'change' }
        ],
        datatype: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        directory: [{ validator: isdirectory, trigger: 'blur' }]
      },
      disabledClassify: true,
      disabledType: true,
      disabledDirectory: true,
      data: [
        { key: 0, label: '风速' },
        { key: 1, label: '湿度' },
        { key: 2, label: '温度' },
        { key: 3, label: '气压' },
        { key: 4, label: '远道视程' }
      ],
      directoryOptions: [],
      data1: [
        { 风速: { min: 0, max: 0 } },
        { 湿度: { min: 0, max: 0 } },
        { 温度: { min: 0, max: 0 } },
        { 气压: { min: 0, max: 0 } },
        { 跑道视程: { min: 0, max: 0 } }
      ],
      transferList: [],
      timeScope: [],
      hrImg: require('@/assets/sys_images/collectionConfig/hr.png'),
      footerShow: true,
      loading: false,
      editMode: 'insert',
      dataTypeoptions: [],
      dataClassifyoptions: [],
      points: [],
      filterRulesOptions: ['有', '无'],
      checkRulesOptions: ['有', '无'],
      formModel: this.resetFormModel(),
      show: this.modalData.show,
      dataClassify: '',
      directoryLevel: {
        datatypecode: '',
        directory: '',
        elementid: 0,
        id: 0
      }
    }
  },
  computed: {},
  watch: {
    modalData(newValue) {
      this.editMode = this.modalData.flag
      this.show = newValue.show
      if (this.modalData.flag === 'update') {
        if (newValue.data.timetype === 0 || newValue.data.timetype === '') {
          newValue.data.timetype = '0'
        } else if (newValue.data.timetype === 1) {
          newValue.data.timetype = '1'
        }
        this.disabledClassify = false
        this.disabledType = false
      } else {
        this.disabledClassify = true
        this.disabledType = true
      }

      const plainModel = this.resetFormModel()
      if (this.modalData.data) {
        Object.keys(plainModel).forEach(key => {
          plainModel[key] = this.modalData.data[key]
        })
      }
      if (this.modalData.flag === 'details') {
        this.footerShow = false
      } else {
        this.footerShow = true
      }

      this.formModel = plainModel
    }
  },
  props: ['modalData'],
  methods: {
    timeFilter() {},
    dataTypeEvent() {
      this.dataTypeoptions.forEach(item => {
        if (this.formModel.datatype === item.datatypename)
          this.formModel.datastorage = item.objdatabase
        this.formModel.structuraltype = item.structuraltype
      })
    },
    dataClassifyEvent() {
      this.formModel.datatype = ''
      this.lonLatSelection = ''
      if (this.formModel.dataclassification === '咸阳机场自观') {
        this.formModel.structuraltype = '1'
        this.formModel.datastorage = '1'
      } else if (this.formModel.dataclassification === '预报产品数据') {
        this.formModel.structuraltype = '0'
      }
      this.dataClassifyoptions.forEach(item => {
        if (this.formModel.dataclassification === item.typename) {
          this.dataClassify = item.typecode
        }
      })
      getDataTypes({ type: this.dataClassify }).then(response => {
        this.dataTypeoptions = response.data
      })
      if (this.formModel.dataclassification === '咸阳机场自观') {
        this.disabledType = false
        this.disabledDirectory = false
        this.formModel.datatype = 'socket'
      } else if (this.formModel.dataclassification === '预报产品数据') {
        this.disabledType = false
        this.formModel.datatype = 'prog'
      } else {
        this.disabledType = true
        this.disabledDirectory = true
      }
    },
    resetFormModel() {
      return {
        directory: '',
        dataclassification: '',
        dataname: '',
        datatype: '',
        id: '',
        datastorage: '',
        timetype: '0',
        illustration: '',
        structuraltype: '',
        s_lon: '',
        e_lon: '',
        s_lat: '',
        e_lat: ''
      }
    },
    closeModal() {
      this.$refs['dataCollectForm'].resetFields()
      this.show = false
    },
    updateOrAddDataCollect(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const titlePreText = this.modalData.data ? '更新' : '新增'
          if (!this.modalData.data) {
            var { id, ...params } = this.formModel
          } else {
            var { ...params } = this.formModel
          }
          if (this.modalData.flag === 'insert') {
            this.directoryLevel.datatypecode = this.formModel.datatype
            this.directoryLevel.directory = this.formModel.directory
            getCollectionAdd(params)
              .then(res => {
                if (res.data) {
                  this.$Message.info(`数据类型和路径属性已配置`)
                } else {
                  this.$Message.info(`${titlePreText}成功`)
                }
                this.$emit('handleSucc')
              })
              .finally(res => {
                this.show = false
                this.loading = false
              })
          } else {
            this.directoryLevel.datatypecode = this.formModel.datatype
            this.directoryLevel.directory = this.formModel.directory
            this.directoryLevel.id = this.formModel.id
            getCollectionUpdate(params)
              .then(res => {
                if (res.data) {
                  this.$Message.info(`数据类型和路径属性已配置`)
                } else {
                  this.$Message.info(`${titlePreText}成功`)
                }
                this.$emit('handleSucc')
              })
              .finally(res => {
                this.show = false
                this.loading = false
              })
          }
        }
      })
    },
    dataLonLat(){
      this.formModel.s_lon = this.lonLatSelection.s_lon
      this.formModel.e_lon = this.lonLatSelection.e_lon
      this.formModel.s_lat = this.lonLatSelection.s_lat
      this.formModel.e_lat = this.lonLatSelection.e_lat
    }
  },
  mounted() {
    getDataTypeClassify().then(response => {
      this.dataClassifyoptions = response.data
    })
    this.lonLatSelection = ''
    getResionInfo().then(response => {
      response.data.forEach(item=>{
        this.lonLatSelections.push(
        {
          typecode: item,
          typename: item.tagging,
        }
      ) 
      })
    })
  }
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
