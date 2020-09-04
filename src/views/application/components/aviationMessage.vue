<template>
  <el-dialog title="高级检索" :visible.sync="myFrameShow" width="900px" :before-close="handleClose">
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
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="valueEnd">
          <i class="el-icon-arrow-right"></i>
          <el-date-picker
            v-model="ruleForm.valueEnd"
            :picker-options="endDatePicker"
            type="datetime"
            placeholder="选择时间"
            @change="endTimeChange"
          ></el-date-picker>
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
      <el-form-item prop="area">
        <span>区域名称：</span>
        <el-select v-model="ruleForm.area" placeholder="国家/地区" @change="areaOption">
          <el-option
            v-for="item in areaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name">
        <span>机场名称：</span>
        <el-select v-model="ruleForm.name" placeholder="机场名称" @change="nameOption">
          <el-option
            v-for="item in nameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="attr">
        <span>天气现象：</span>
        <el-transfer
          v-model="value4"
          style="text-align: left; display: inline-block"
          filterable
          :titles="['Source', 'Target']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="data"
          @change="handleChange"
        >
          <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
          <el-button slot="left-footer" class="transfer-footer" size="small">操作</el-button>
          <el-button slot="right-footer" class="transfer-footer" size="small">操作</el-button>
        </el-transfer>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetting">重置</el-button>
      <el-button type="primary" @click="beginFilter">开始检索</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Genneral from '@/utils/generalOptions'
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
    const generateData = _ => {
      const data = []
      const cities = new Genneral().attrOptions()
      const pinyin = new Genneral().attrOptions()
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        })
      })
      return data
    }
    return {
      startDatePicker: this.beginDate(),
      endDatePicker: this.endDate(),
      data: generateData(),
      value4: [],
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        )
      },
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
        attr: [],
        name: undefined
      },
      areaOptions: [
        {
          value: '东北地区4C、3C等级机场',
          label: '东北地区'
        },
        {
          value: '华北地区4E、4D等级机场',
          label: '华北地区'
        },
        {
          value: '华中地区4E、4D等级机场',
          label: '华中地区'
        },
        {
          value: '华南地区4E、4D等级机场',
          label: '华南地区'
        },
        {
          value: '华东地区4E、4D等级机场',
          label: '华东地区'
        },
        {
          value: '西北地区4C、3C等级机场',
          label: '西北地区'
        },
        {
          value: '中南地区4E、4D等级机场',
          label: '中南地区'
        }
      ],
      nameOptions: [
        {
          value: '郑州新郑机场',
          label: '郑州新郑机场'
        },
        {
          value: '邯郸马头机场',
          label: '邯郸马头机场'
        },
        {
          value: '北京西郊机场',
          label: '北京西郊机场'
        },
        {
          value: '安庆天柱山机场',
          label: '安庆天柱山机场'
        },
        {
          value: '通化三源浦机场',
          label: '通化三源浦机场'
        },
        {
          value: '包头二里半机场',
          label: '包头二里半机场'
        }
      ],
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
    handleChange(value) {
      this.$emit('attrSearch', value)
    },
    areaOption(val) {
      this.$emit('areaSearch', val)
    },
    nameOption(val) {
      this.$emit('nameSearch', val)
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
  height: 400px;
  overflow: auto;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
</style>
