<template>
  <el-dialog
    width="60%"
    :visible.sync="show"
    v-model="show"
    :title="
      editMode === 'insert'
        ? '添加数据采集配置'
        : editMode === 'update'
        ? '编辑数据采集配置'
        : '数据采集配置详情'
    "
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
          <div>
            <div class="collectTitle">基本信息：</div>
            <img :src="hrImg" />
          </div>
          <el-form-item label="数据分类：" class="class-flex" prop="dataclassification">
            <el-select
              :disabled="!disabledShow"
              class="el-form-item__content-item"
              @change="dataClassifyEvent"
              v-model="formModel.dataclassification"
              placeholder="数据分类"
            >
              <el-option
                v-for="item in dataClassifyoptions"
                :key="item.typecode"
                :label="item.typename"
                :value="item.typecode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据类型：" class="class-flex" prop="datatype">
            <el-select
              :disabled="!disabledShow"
              class="el-form-item__content-item"
              @change="dataTypeChange"
              v-model="formModel.datatype"
              placeholder="数据类型"
            >
              <el-option
                v-for="item in dataTypeoptions"
                :key="item.datatypecode"
                :label="item.datatypename"
                :value="item.datatypecode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据名称：" class="class-flex" prop="dataname">
            <el-input
              :disabled="!disabledShow"
              v-model="formModel.dataname"
              class="el-form-item__content-item"
              placeholder="数据名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="路径属性：" class="class-flex" prop="directory">
            <el-input
              :disabled="!disabledShow"
              class="el-form-item__content-item"
              v-model="formModel.directory"
            ></el-input>
          </el-form-item>
          <el-form-item label="过滤规则：" class="class-flex" prop="filterrules">
            <el-select
              @change="filterChange"
              class="el-form-item__content-item"
              v-model="formModel.filterrules"
              :label-in-value="true"
            >
              <el-option v-for="(item, ix) in filterRulesOptions" :value="item" :key="ix">{{ item }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="校验规则：" class="class-flex" prop="checkrules">
            <el-select @change="ruleChange" v-model="formModel.checkrules" :label-in-value="true">
              <el-option v-for="(item, ix) in checkRulesOptions" :value="item" :key="ix">{{ item }}</el-option>
            </el-select>
          </el-form-item>
          <div v-show="filterShow">
            <div>
              <div class="collectTitle">过滤规则：</div>
              <img :src="hrImg" />
            </div>
            <el-form-item
              label="文件修改时间："
              v-if="filterupdatetimeShow === true"
              class="class-flex"
              prop="filterupdatetime"
            >
              <el-input style="width:83px;" v-model.number="formModel.filterupdatetime" placeholder></el-input>
              <span>分钟</span>
            </el-form-item>
            <div v-if="fileShow" class="edit-lable">
              <el-form-item label="文件大小范围：" prop="filterfilesizesmall">
                <el-input
                  style="width:83px;"
                  v-model.number="formModel.filterfilesizesmall"
                  placeholder="起始值"
                ></el-input>
              </el-form-item>
              <span>~</span>
              <el-form-item
                style="display: inline-block;width: 130px;margin-left: 10px;"
                prop="filterfilesizebig"
              >
                <el-input
                  style="width:83px;"
                  v-model.number="formModel.filterfilesizebig"
                  placeholder="结束值"
                ></el-input>
                <span>KB</span>
              </el-form-item>
            </div>
          </div>
          <div v-show="ruleShow">
            <div>
              <div class="collectTitle">校验规则：</div>
              <img :src="hrImg" />
            </div>
            <div v-if="fileShow" class="edit-lable">
              <el-form-item label="文件大小范围：" prop="checkfilesizesmall">
                <el-input
                  style="width:83px;"
                  v-model.number="formModel.checkfilesizesmall"
                  placeholder="起始值"
                ></el-input>
              </el-form-item>
              <span>~</span>
              <el-form-item
                style="display: inline-block;width: 130px;margin-left: 10px;"
                prop="checkfilesizebig"
              >
                <el-input
                  style="width:83px;"
                  v-model.number="formModel.checkfilesizebig"
                  placeholder="结束值"
                ></el-input>
                <span>KB</span>
              </el-form-item>
            </div>
            <el-form-item
              v-show="transferShow"
              class="transferClass"
              style="margin-left:40px"
              label="字段取值范围："
            >
              <el-transfer
                @change="handleChange"
                v-model="transferList"
                :data="data"
                :titles="['待选', '已选字段']"
              >
                <span slot-scope="{ option }" class="transfer-class-item">
                  <span>{{ option.label }}</span>
                  <el-input
                    @blur="inputMinEvent(option,data1[option.key][option.label].min)"
                    style="width:60px"
                    v-model="data1[option.key][option.label].min"
                  ></el-input>~
                  <el-input
                    @blur="inputMaxEvent(option,data1[option.key][option.label].min)"
                    style="width:60px"
                    v-model="data1[option.key][option.label].max"
                  ></el-input>
                </span>
              </el-transfer>
            </el-form-item>
          </div>
          <div>
            <div class="collectTitle">数据源信息：</div>
            <img :src="hrImg" />
          </div>
          <el-form-item label="数据存储类型：" class="class-flex" prop="isFTP">
            <el-radio-group @change="radioChange" v-model="formModel.isFTP">
              <el-radio v-if="formModel.isFTP === '2' || formModel.isFTP === '1'" label="1">本地FTP</el-radio>
              <el-radio v-if="formModel.isFTP === '2' || formModel.isFTP === '1'" label="2">远端FTP</el-radio>
              <el-radio v-if="formModel.isFTP === '3'" label="3">socket</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="formModel.isFTP === '2' || formModel.isFTP === '1'">
            <el-form-item label="IP地址：" class="class-flex" prop="sourceftpurl">
              <el-input
                :disabled="isFTPShow"
                v-model="formModel.sourceftpurl"
                class="el-form-item__content-item"
                placeholder="IP地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="端口号：" class="class-flex" prop="socketport">
              <el-input
                :disabled="isFTPShow"
                v-model="formModel.socketport"
                class="el-form-item__content-item"
                placeholder="端口号"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户名：" class="class-flex" prop="sourceftpusername">
              <el-input
                :disabled="isFTPShow"
                v-model="formModel.sourceftpusername"
                class="el-form-item__content-item"
                placeholder="用户名"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码：" class="class-flex" prop="sourceftppwd">
              <el-input
                :disabled="isFTPShow"
                v-model="formModel.sourceftppwd"
                class="el-form-item__content-item"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="文件路径：" class="class-flex" prop="sourceftpfilepath">
              <el-input
                disabled
                v-model="formModel.sourceftpfilepath"
                class="el-form-item__content-item"
                placeholder="文件路径"
              ></el-input>
            </el-form-item>
          </div>
          <div v-show="formModel.isFTP === '3'">
            <el-form-item label="IP地址：" class="class-flex" prop="socketip">
              <el-input
                v-model="formModel.socketip"
                class="el-form-item__content-item"
                placeholder="IP地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="端口号：" class="class-flex" prop="socketport">
              <el-input
                v-model="formModel.socketport"
                class="el-form-item__content-item"
                placeholder="端口号"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <div class="collectTitle" style="width:150px">数据存储目标：</div>
            <img :src="hrImg" />
          </div>
          <el-form-item style=" margin-left: 173px;" prop="datastorage">
            <el-radio-group :disabled="radioGrouphow" v-model="formModel.datastorage">
              <el-radio label="MongoDB">MongoDB</el-radio>
              <el-radio label="Hbase">Hbase</el-radio>
              <el-radio label="MongoDB/HBase">MongoDB/HBase</el-radio>
            </el-radio-group>
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
import {
  getCollectionAdd,
  getCollectionUpdate,
  getDataTypes,
  getDataTypeClassify,
  getLocalFtpInfo,
  doSwitch
} from '@/api/collection'
import Options from '../options'
export default {
  data() {
    var filtersmall = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (
          this.formModel.filterfilesizebig &&
          value > this.formModel.filterfilesizebig
        ) {
          callback(new Error('必须小于后者'))
        } else {
          callback()
        }
      }
    }
    var filtersmalls = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    var filterbig = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (
          this.formModel.filterfilesizesmall &&
          value < this.formModel.filterfilesizesmall
        ) {
          callback(new Error('必须大于后者'))
        } else {
          callback()
        }
      }
    }
    var checksmall = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (
          this.formModel.checkfilesizebig &&
          value > this.formModel.checkfilesizebig
        ) {
          callback(new Error('必须小于后者'))
        } else {
          callback()
        }
      }
    }
    var checkbig = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (
          this.formModel.checkfilesizesmall &&
          value < this.formModel.checkfilesizesmall
        ) {
          callback(new Error('必须大于后者'))
        } else {
          callback()
        }
      }
    }
    var isUrl = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      var matchUrl = /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      if (!matchUrl.test(value.trim())) {
        callback(new Error('不是正确网址'))
      } else {
        callback()
      }
    }
    return {
      isFTPShow: true,
      isFTPRadioShow: false,
      fileShow: true,
      rules: {
        sourceftpurl: [{ validator: isUrl, trigger: 'blur' }],
        filterupdatetime: [{ validator: filtersmalls, trigger: 'blur' }],
        filterfilesizesmall: [{ validator: filtersmall, trigger: 'blur' }],
        filterfilesizebig: [{ validator: filterbig, trigger: 'blur' }],
        checkfilesizesmall: [{ validator: checksmall, trigger: 'blur' }],
        checkfilesizebig: [{ validator: checkbig, trigger: 'blur' }],
        dataclassification: [
          { required: true, message: '请选择数据分类', trigger: 'change' }
        ],
        datatype: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ]
      },
      radioGrouphow: true,
      filterShow: true,
      ruleShow: true,
      disabledShow: true,
      transferShow: false,
      data: [
        { key: 0, label: '风速' },
        { key: 1, label: '湿度' },
        { key: 2, label: '温度' },
        { key: 3, label: '气压' },
        { key: 4, label: '跑道视程' }
      ],
      dataTypeoptions: [],
      dataClassifyoptions: [],
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
      dataCollectionModel: {
        options: Options.dataClassify.map(item => item),
        checkItem: null,
        value: ''
      },
      footerShow: true,
      loading: false,
      filterupdatetimeShow: false,
      editMode: 'insert',
      dataClassifyOptions: Options.dataClassify,
      dataTypeOptions: Options.dataType,
      points: [],
      filterRulesOptions: ['有', '无'],
      checkRulesOptions: ['有', '无'],
      formModel: this.resetFormModel(),
      show: this.modalData.show,
      newValueData: ''
    }
  },
  computed: {},
  watch: {
    modalData(newValue) {
      if (newValue.data.dataname === 'socket') {
        this.fileShow = false
      } else {
        this.fileShow = true
      }
      this.newValueData = newValue.data
      this.newValueData.filterrules === '无'
        ? (this.filterShow = false)
        : (this.filterShow = true)
      this.newValueData.checkrules === '无'
        ? (this.ruleShow = false)
        : (this.ruleShow = true)
      if (this.newValueData.dataclassification === '其它') {
        this.radioGrouphow = false
      } else {
        this.radioGrouphow = true
      }
      if (
        this.newValueData.datastorage === 'MongoDB' ||
        this.newValueData.datastorage === ''
      ) {
        this.newValueData.datastorage = 'MongoDB'
      }
      if (this.newValueData.dataclassification === '咸阳机场自观') {
        this.transferShow = true
        this.newValueData.isFTP = '3'
      } else {
        this.transferShow = false
      }
      if (
        this.newValueData.isFTP === '' ||
        this.newValueData.isFTP === 'N' ||
        this.newValueData.isFTP === '1'
      ) {
        this.isFTPShow = true
        this.newValueData.isFTP = '1'
        getLocalFtpInfo().then(res => {
          this.formModel.sourceftpurl = res.localFtpUrl
          this.formModel.sourceftpusername = res.localFtpUser
          this.formModel.sourceftppwd = res.localFtpPwd
          this.formModel.socketport = res.localFtpPort
        })
      } else if (this.newValueData.isFTP === 'Y') {
        this.newValueData.isFTP = '2'
      }
      if (this.newValueData.isFTP === '2' || this.newValueData.isFTP === 'Y') {
        this.filterupdatetimeShow = true
        this.isFTPShow = false
      } else {
        this.filterupdatetimeShow = false
      }
      this.editMode = this.modalData.flag
      this.show = newValue.show
      if (this.modalData.flag === 'update') {
        this.disabledShow = false
      } else {
        this.disabledShow = true
      }
      const plainModel = this.resetFormModel()
      if (this.modalData.data) {
        Object.keys(plainModel).forEach(key => {
          plainModel[key] = this.modalData.data[key]
        })
      }
      if (this.modalData.flag == 'details') {
        this.footerShow = false
      } else {
        this.footerShow = true
      }

      this.formModel = plainModel
    }
  },
  props: ['modalData', 'list'],
  methods: {
    inputMinEvent(option, val) {
      if (option.label === '风速') {
        this.formModel.wsinsmin = Number(val)
      } else if (option.label === '温度') {
        this.formModel.tainsmin = Number(val)
      } else if (option.label === '湿度') {
        this.formModel.tdinsmin = Number(val)
      } else if (option.label === '气压') {
        this.formModel.painsmin = Number(val)
      } else if (option.label === '跑道视程') {
        this.formModel.rvrmin = Number(val)
      }
    },
    inputMaxEvent(option, val) {
      if (option.label === '风速') {
        this.formModel.wsinsmax = Number(val)
      } else if (option.label === '温度') {
        this.formModel.tainsmax = Number(val)
      } else if (option.label === '湿度') {
        this.formModel.tdinsmax = Number(val)
      } else if (option.label === '气压') {
        this.formModel.painsmax = Number(val)
      } else if (option.label === '跑道视程') {
        this.formModel.rvrmax = Number(val)
      }
    },
    radioChange() {
      if (this.formModel.isFTP === '2' || this.newValueData.isFTP === 'Y') {
        this.filterupdatetimeShow = true
        this.isFTPShow = false
        this.formModel.sourceftpurl = ''
        this.formModel.sourceftpusername = ''
        this.formModel.sourceftppwd = ''
        this.formModel.socketport = ''
      } else if (
        this.formModel.isFTP === '' ||
        this.formModel.isFTP === 'N' ||
        this.formModel.isFTP === '1'
      ) {
        this.filterupdatetimeShow = false
        this.isFTPShow = true
        getLocalFtpInfo().then(res => {
          this.formModel.sourceftpurl = res.localFtpUrl
          this.formModel.sourceftpusername = res.localFtpUser
          this.formModel.sourceftppwd = res.localFtpPwd
          this.formModel.socketport = res.localFtpPort
        })
      } else {
        this.filterupdatetimeShow = false
      }
    },
    dataClassifyEvent() {
      this.formModel.datatype = ''
      getDataTypes({ type: this.formModel.dataclassification }).then(
        response => {
          this.dataTypeoptions = response.data
        }
      )
    },
    filterChange() {
      if (this.formModel.filterrules === '无') {
        this.filterShow = false
      } else {
        this.filterShow = true
      }
    },
    ruleChange() {
      if (this.formModel.checkrules === '无') {
        this.ruleShow = false
      } else {
        this.ruleShow = true
      }
    },
    handleChange(value, direction, movedKeys) {
      this.formModel.tainsmax = ''
      this.formModel.tainsmin = ''
      this.formModel.tdinsmax = ''
      this.formModel.tdinsmin = ''
      this.formModel.wsinsmax = ''
      this.formModel.wsinsmin = ''
      this.formModel.painsmax = ''
      this.formModel.painsmin = ''
      this.formModel.rvrmax = ''
      this.formModel.rvrmin = ''
      this.transferList.filter(item => {
        if (Object.keys(this.data1[item])[0] === '风速') {
          this.formModel.wsinsmin = this.data1[item][
            Object.keys(this.data1[item])[0]
          ].min
          this.formModel.wsinsmax = this.data1[item][
            Object.keys(this.data1[item])[0]
          ].max
        } else if (Object.keys(this.data1[item])[0] === '温度') {
          this.formModel.tainsmin = this.data1[item][
            Object.keys(this.data1[item])[0]
          ].min
          this.formModel.tainsmax = this.data1[item][
            Object.keys(this.data1[item])[0]
          ].max
        } else if (Object.keys(this.data1[item])[0] === '湿度') {
          this.formModel.tdinsmin = this.data1[item][
            Object.keys(this.data1[item])[0]
          ].min
          this.formModel.tdinsmax = this.data1[item][
            Object.keys(this.data1[item])[0]
          ].max
        } else if (Object.keys(this.data1[item])[0] === '气压') {
          this.formModel.painsmin = this.data1[item][
            Object.keys(this.data1[item])[0]
          ].min
          this.formModel.painsmax = this.data1[item][
            Object.keys(this.data1[item])[0]
          ].max
        } else if (Object.keys(this.data1[item])[0] === '跑道视程') {
          this.formModel.rvrmin = Number(
            this.data1[item][Object.keys(this.data1[item])[0]].min
          )
          this.formModel.rvrmax = Number(
            this.data1[item][Object.keys(this.data1[item])[0]].max
          )
        }
      })
    },
    dataClassifyChange() {
      this.formModel.datatype = ''
      this.dataTypeOptions = Options.dataType
      const t = this.dataClassifyOptions.filter(
        item => item.typename === this.formModel.dataclassification
      )
      this.dataTypeOptions = this.dataTypeOptions.filter(
        item => item.type === t[0].typecode
      )
      const tablelist = this.list.map(item => item.datatype)
      this.dataTypeOptions = this.dataTypeOptions.filter(
        item => !tablelist.includes(item.datatypename)
      )
    },
    dataTypeChange(val) {
      const f = this.dataTypeOptions.filter(item => val === item.datatypename)
      this.formModel.datasource = f[0].datasrouce
    },
    resetFormModel() {
      return {
        dataclassification: '',
        dataname: '',
        datatype: '',
        isFTP: '1',
        sourceftpurl: '',
        sourceftpfilepath: '',
        sourceftpusername: '',
        sourceftppwd: '',
        directory: '',
        filterrules: '',
        checkrules: '',
        filterfilesizesmall: '',
        filterupdatetime: '',
        filterfilesizebig: '',
        checkfilesizesmall: '',
        socketport: '',
        socketip: '',
        checkfilesizebig: '',
        tainsmax: '',
        tainsmin: '',
        datastorage: '1',
        tdinsmax: '',
        tdinsmin: '',
        wsinsmax: '',
        wsinsmin: '',
        painsmax: '', //气压上限
        painsmin: '', //气压下限
        rvrmax: '', //跑道视程上限
        rvrmin: '', //跑道视程下限
        id: ''
      }
    },
    closeModal() {
      this.$refs['dataCollectForm'].resetFields()
      this.show = false
    },
    updateOrAddDataCollect(name) {
      // debugger
      this.$refs[name].validate(valid => {
        if (valid) {
          const titlePreText = this.modalData.data ? '更新' : '新增'
          if (this.formModel.datastorage === 'MongoDB') {
            this.formModel.datastorage = 1
          } else if (this.formModel.datastorage === 'MongoDB/HBase') {
            this.formModel.datastorage = 3
          } else if (this.formModel.datastorage === 'HBase') {
            this.formModel.datastorage = 2
          }
          if (!this.modalData.data) {
            var { id, ...params } = this.formModel
          } else {
            var { ...params } = this.formModel
          }
          if (this.modalData.flag == 'insert') {
            getCollectionAdd(params)
              .then(res => {
                console.log()
                this.$Message.info(`${titlePreText}成功`)
                this.$emit('handleSucc')
              })
              .finally(res => {
                this.show = false
                this.loading = false
              })
          } else {
            if (params.dataname === 'socket') {
              params.directory = '/'
            }
            if (params.filterrules === '无') {
              this.formModel.filterupdatetime = null
              this.formModel.filterfilesizesmall = null
              this.formModel.filterfilesizebig = null
            }
            getCollectionUpdate(params)
              .then(res => {
                if (res.msg === 'SUCCESS') {
                  this.$Message.info(`${titlePreText}成功`)
                  this.$emit('handleSucc')
                }else{
                  this.$Message.info(res.data)
                }
              })
              .finally(res => {
                doSwitch().then(res => {})
                this.show = false
                this.loading = false
              })
          }
        } else {
        }
      })
    }
  },
  mounted() {
    getDataTypeClassify().then(response => {
      this.dataClassifyoptions = response.data
    })
    // 字段取值范围赋值
    setTimeout(() => {
      if (this.newValueData.wsinsmin !== '') {
        this.transferList.push(0)
        this.data1[0]['风速']['min'] = this.newValueData.wsinsmin
        this.data1[0]['风速']['max'] = this.newValueData.wsinsmax
      }
      if (this.newValueData.tdinsmin !== '') {
        this.transferList.push(1)
        this.data1[1]['湿度']['min'] = this.newValueData.tdinsmin
        this.data1[1]['湿度']['max'] = this.newValueData.tdinsmax
      }
      if (this.newValueData.tainsmin !== '') {
        this.transferList.push(2)
        this.data1[2]['温度']['min'] = this.newValueData.tainsmin
        this.data1[2]['温度']['max'] = this.newValueData.tainsmax
      }
      if (this.newValueData.painsmin !== '') {
        this.transferList.push(3)
        this.data1[3]['气压']['min'] = this.newValueData.painsmin
        this.data1[3]['气压']['max'] = this.newValueData.painsmax
      }
      if (this.newValueData.rvrmin !== '') {
        this.transferList.push(4)
        this.data1[4]['跑道视程']['min'] = this.newValueData.rvrmin
        this.data1[4]['跑道视程']['max'] = this.newValueData.rvrmin
      }
    }, 2000)
  }
}
</script>

<style lang="scss" scoped>
.modalDetails > div {
  font-size: 16px;
  font-weight: 600;
  line-height: 55px;
}
.modalDetails .el-form-item.el-form-item--medium {
  margin: 5px 0px 5px 140px;
}
.modalDetails .el-select.el-select--medium {
  width: 400px;
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
<style>
.transfer-class-item > span {
  display: inline-block;
  width: 60px;
  margin-left: 0px !important;
}
.class-flex {
  display: flex !important;
}
.edit-lable > div > label {
  position: relative;
  top: -7px;
}
.modalDetails .el-form-item__content-item > input {
  width: 400px;
}
</style>
