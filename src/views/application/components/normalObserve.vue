<template>
  <el-dialog
    title="高级检索"
    :visible.sync="myFrameShow"
    width="900px"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" class="advancedFilter">
      <el-form-item>
        <el-form-item prop="valueBegin">
          <span>起止时间：</span>
          <el-date-picker
            v-model="ruleForm.valueBegin"
            :picker-options="startDatePicker"
            type="datetime"
            placeholder="选择时间"
            @change="startTimeChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="valueEnd">
          <i class="el-icon-arrow-right"></i>
          <el-date-picker
            v-model="ruleForm.valueEnd"
            :picker-options="endDatePicker"
            type="datetime"
            placeholder="选择时间"
            @change="endTimeChange"
          >
          </el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <span>起止经度：</span>
        <el-form-item prop="lonBeginInput">
          <el-input v-model="ruleForm.lonBeginInput" disabled></el-input>
        </el-form-item>
        <i class="el-icon-arrow-right"></i>
        <el-form-item prop="lonEndInput">
          <el-input v-model="ruleForm.lonEndInput" disabled></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <span>起止纬度：</span>
        <el-form-item prop="latBeginInput">
          <el-input v-model="ruleForm.latBeginInput" disabled></el-input>
        </el-form-item>
        <i class="el-icon-arrow-right"></i>
        <el-form-item prop="latEndInput">
          <el-input v-model="ruleForm.latEndInput" disabled></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item prop="name">
        <span>机场名称：</span>
        <el-select
          v-model="provinceModel.value"
          style="margin: 0 2px;z-index: 1000;width: 130px;"
          size="small"
          placeholder="请选择省/市"
          @change="provinceChange"
        >
          <el-option
            v-for="(item, index) in provinceModel.options"
            :key="index"
            :label="item.provinceName"
            :value="item.provinceName"
          ></el-option>
        </el-select>
        <el-select
          v-model="airportModel.value"
          style="margin: 0 2px;z-index: 1000;width: 130px;"
          size="small"
          placeholder="请选择机场"
          @change="airportChange"
        >
          <el-option
            v-for="(item, index) in airportModel.options"
            :key="index"
            :label="item.airport"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="resetting">重置</el-button>
      <el-button type="primary" @click="beginFilter">开始检索</el-button>
    </span>
  </el-dialog>
</template>

<script>
import city from '@/utils/province'
import country from '@/utils/airport'
export default {
  name: 'AdvancedFilter',
  props: {
    frameShow: {
      required: true,
      type: Boolean
    },
    handleFilter: {
      required: true,
      type: Function
    }
  },
  data() {
    return {
      provinceModel: {
        options: city.features.map(item => item.properties),
        checkItem: null,
        value: ''
      },
      airportModel: {
        options: [],
        checkItem: null,
        value: ''
      },
      startDatePicker: this.beginDate(),
      endDatePicker: this.endDate(),
      myFrameShow: this.frameShow, // ①创建props属性frameShow的副本--myFrameShow
      ruleForm: {
        page: 1,
        limit: 20,
        sort: '+id',
        valueBegin: undefined,
        valueEnd: undefined,
        lonBeginInput: undefined,
        latBeginInput: undefined,
        latEndInput: undefined,
        lonEndInput: undefined,
        area: undefined,
        warning: undefined,
        name: undefined
      },
      warningOptions: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        }
      ]
    }
  },
  watch: {
    frameShow(val) {
      this.myFrameShow = val // ②监听外部对props属性frameShow的变更，并同步到组件内的data属性myFrameShow中
    },
    myFrameShow(val) {
      this.$emit('on-frameShow-change', val) // ③组件内对myFrameShow变更后向外部发送事件通知
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    provinceChange() {
      this.provinceModel.checkItem = this.provinceModel.options.filter(
        item => item.provinceName === this.provinceModel.value
      )[0]
      this.airportModel.value = ''
      this.airportModel.checkItem = null
      this.airportModel.options = country.features
        .filter(
          item => item.properties.provinceName === this.provinceModel.value
        )
        .map(item => item.properties)
    },
    airportChange(val) {
      this.airportModel.checkItem = this.airportModel.options.filter(
        item => item.airport === this.airportModel.value
      )[0]
      val = val.substr(1)
      this.$emit('nameSearch', val)
    },
    handleClose(done) {
      done()
    },
    beginDate() {
      const self = this
      return {
        disabledDate(time) {
          // 开始时间不选时，结束时间必须大于开始时间
          if (self.ruleForm.valueEnd) {
            const endTime = new Date(self.ruleForm.valueEnd).valueOf()
            return time && time.valueOf() > endTime
          }
        }
      }
    },
    endDate() {
      const self = this
      return {
        disabledDate(time) {
          // 开始时间选中时，结束时间必须大于开始时间
          if (self.ruleForm.valueBegin) {
            const startTime = new Date(self.ruleForm.valueBegin).valueOf()
            return time && time.valueOf() < startTime
          }
        }
      }
    },
    startTimeChange(val) {
      this.$emit('startTimeSearch', val)
    },
    endTimeChange(val) {
      this.$emit('endTimeSearch', val)
    },
    warningOption(val) {
      this.$emit('warningSearch', val)
    },
    // 高级检索
    beginFilter() {
      // this.myFrameShow = false
      this.handleFilter()
    },
    // 重置
    resetting(ruleForm) {
      // this.myFrameShow = false
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style scoped>
.advancedFilter .el-form-item.el-form-item--medium {
  text-align: left;
  padding: 10px 0px 10px 80px;
}
.advancedFilter
  .el-form-item.el-form-item--medium
  .el-form-item.el-form-item--medium {
  display: inline-block;
  padding-left: 0px;
}
.advancedFilter .el-form-item.el-form-item--medium:nth-child(1),
.advancedFilter .el-form-item.el-form-item--medium:nth-child(2),
.advancedFilter .el-form-item.el-form-item--medium:nth-child(3) {
  display: flex;
  padding: 0px 0px 0px 80px;
}
.advancedFilter {
  padding: 15px 0px;
  border-bottom: 1px solid #dadada;
  color: #666666;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
</style>
