<template>
  <el-dialog
    width="50%"
    :visible.sync="show"
    v-model="show"
    :title="editMode ==='insert' ? '添加重要天气个例' : '编辑重要天气个例' "
  >
    <div class="modalDetails">
      <el-scrollbar style="height: 100%;">
        <el-form
          ref="dataCollectForm"
          :rules="rules"
          :model="formModel"
          inline
          v-if="show"
          label-width="120px"
        >
          <el-form-item label="天气个例：" prop="alias">
            <el-input v-model="formModel.alias" placeholder="天气个例"></el-input>
          </el-form-item>
          <el-form-item class="airportClass" label="机场名称：" prop="airportName">
            <el-select
              :disabled="onlyRead"
              v-model="provinceValue"
              clearable
              style="margin: 0 2px;z-index: 1000;width: 130px;"
              size="small"
              placeholder="请选择省/市"
              @change="provinceChange"
              @clear="provinceClear"
            >
              <el-option
                v-for="(item, index) in provinceModelOptions"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              :disabled="onlyRead"
              v-model="formModel.airportName"
              clearable
              style="margin: 0 2px;z-index: 1000;width: 130px;"
              size="small"
              placeholder="请选择机场"
              @change="airportChange"
              @clear="airportClear"
            >
              <el-option
                v-for="(item, index) in airportOptions"
                :key="index"
                :label="item.airportName"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="记录要素：" prop="element">
            <el-select
              :disabled="onlyRead"
              v-model="formModel.element"
              style="margin: 0 2px;z-index: 1000;width: 225px;"
              size="small"
              placeholder="请选择记录要素"
            >
              <el-option
                v-for="(item, index) in elementOptions"
                :key="index"
                :label="item.elementName"
                :value="item.elementName"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="min-width:382px;">
            <span style="color: #FF4949;margin-left: 29px;">*</span>
            <span style="font-weight: 400;">日期范围：</span>
            <el-date-picker
              style="width:227px;margin-left: 10px;"
              v-model="timeScope"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format
              @change="timeChange"
            />
            <div
              v-if="timeScopeShow"
              style="color: #FF4949;font-size: 12px;margin: -7px 0px -27px 120px;"
            >日期范围不能为空</div>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formModel.remark"></el-input>
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
  getWeatherCasesAdd,
  getWeatherCasesUpdate,
  getProvince,
  getAirportList
} from '@/api/application'
export default {
  data() {
    return {
      timeScope: [],
      timeScopeShow: false,
      elementOptions: [
        {
          elementName: '连续(强)降雨',
          elementCode: '连续(强)降雨'
        },
        {
          elementName: '连续(强)降雪',
          elementCode: '连续(强)降雪'
        },
        {
          elementName: '冻降水',
          elementCode: '冻降水'
        },
        {
          elementName: '雷暴',
          elementCode: '雷暴'
        },
        {
          elementName: '沙(尘)暴',
          elementCode: '沙(尘)暴'
        },
        {
          elementName: '大风',
          elementCode: '大风'
        },
        {
          elementName: '低能见度',
          elementCode: '低能见度'
        },
        {
          elementName: '风切变',
          elementCode: '风切变'
        },
        {
          elementName: '其他',
          elementCode: '其他'
        }
      ],
      provinceValue: '',
      onlyRead: false,
      airportOptions: [],
      footerShow: true,
      loading: false,
      provinceModelOptions: [],
      editMode: 'insert',
      dataClassifyOptions: ['民航报文66', '民航报文'],
      points: [],
      filterRulesOptions: ['有', '无'],
      checkRulesOptions: ['有', '无'],
      equipmentOptions: [],
      equipment: [],
      formModel: this.resetFormModel(),
      show: this.modalData.show,
      rules: {
        alias: [
          { required: true, message: '天气个例不能为空', trigger: 'blur' }
        ],
        airportName: [
          { required: true, message: '机场名称不能为空', trigger: 'change' }
        ],
        element: [
          { required: true, message: '记录要素不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    modalData(newValue) {
      this.editMode = this.modalData.flag
      this.show = newValue.show

      const plainModel = this.resetFormModel()
      if (this.modalData.data) {
        Object.keys(plainModel).forEach(key => {
          plainModel[key] = this.modalData.data[key]
        })
      }
      if (this.modalData.flag === 'insert') {
        this.timeScope = []
        this.provinceValue = ''
      }
      if (this.modalData.flag === 'details') {
        this.footerShow = false
      } else {
        this.footerShow = true
      }
      if (this.modalData.flag === 'update') {
        this.onlyRead = true
      } else {
        this.onlyRead = false
      }
      this.formModel = plainModel
    },
    timeScope(value) {
      if (value !== null) {
        this.timeScopeShow = false
      } else if (value === null) {
        this.timeScopeShow = true
      }
    }
  },
  props: ['modalData'],
  methods: {
    provinceClear() {
      this.listQuery.name = ''
    },
    airportChange(val) {
      this.formModel.airportName = val
    },
    // 机场名称选项选择
    provinceChange() {
      this.formModel.airportName = ''
      getAirportList({ province: this.provinceValue }).then(res => {
        this.airportOptions = res
        this.formModel.airportName = this.airportOptions[0].code
      })
    },
    // 清除机场名称选项时触发
    airportClear() {
      this.listQuery.name = ''
    },
    resetFormModel() {
      return {
        alias: '',
        element: '',
        remark: '',
        timeBegin: '',
        timeEnd: '',
        id: '',
        name: '',
        airportName: ''
      }
    },
    timeChange() {
      this.formModel.timeBegin = this.timeScope ? this.timeScope[0] : null
      this.formModel.timeEnd = this.timeScope ? this.timeScope[1] : null
    },
    closeModal() {
      this.$refs['dataCollectForm'].resetFields()
      this.show = false
    },
    // 时间转换
    dateFormat_(date, format) {
      date = new Date(date)
      var o = {
        'M+': date.getMonth() + 1, //month
        'd+': date.getDate(), //day
        'H+': date.getHours() - 8, //hour+8小时
        'm+': date.getMinutes(), //minute
        's+': date.getSeconds(), //second
        'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      }
      if (o['H+'] < 0) {
        o['H+'] = o['H+'] + 24
        o['d+'] = o['d+'] - 1
      }
      if(o['d+'] === 0){
        o['M+'] = o['M+'] - 1
        o['d+'] = 30
      }
      if (/(y+)/.test(format))
        format = format.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )

      for (var k in o)
        if (new RegExp('(' + k + ')').test(format))
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )

      return format
    },
    updateOrAddDataCollect(name) {
      if (
        this.formModel.timeBegin === '' ||
        this.formModel.timeBegin === null ||
        this.formModel.timeEnd === '' ||
        this.formModel.timeEnd === null
      ) {
        this.timeScopeShow = true
      } else {
        this.timeScopeShow = false
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          const titlePreText = this.modalData.data ? '更新' : '新增'
          if (!this.modalData.data) {
            var { id, ...params } = this.formModel
          } else {
            var { ...params } = this.formModel
          }
          const t = this.airportOptions.filter(
            item => item.code === params.airportName
          )
          if (t.length) {
            params.airportName = t[0].airportName
            params.name = t[0].code
          }
          params.timeBegin = this.dateFormat_(params.timeBegin, 'yyyy-MM-dd HH:mm:ss')
          params.timeEnd = this.dateFormat_(params.timeEnd, 'yyyy-MM-dd HH:mm:ss')
          if (this.modalData.flag === 'insert') {
            if (this.timeScopeShow === false) {
              getWeatherCasesAdd(params)
                .then(res => {
                  this.$Message.info(`${titlePreText}成功`)
                  this.$emit('handleSucc')
                })
                .finally(res => {
                  this.show = false
                  this.loading = false
                })
            }
          } else {
            getWeatherCasesUpdate(params)
              .then(res => {
                this.$Message.info(`${titlePreText}成功`)
                this.$emit('handleSucc')
              })
              .finally(res => {
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
    // 获取机场信息
    getProvince().then(response => {
      this.provinceModelOptions = response
    })
  }
}
</script>


<style lang="scss" scoped>
.modalDetails div {
  font-size: 16px;
  font-weight: 600;
  line-height: 40px;
}
.modalDetails .el-form-item.el-form-item--medium {
  margin: 15px 49px;
}
</style>
