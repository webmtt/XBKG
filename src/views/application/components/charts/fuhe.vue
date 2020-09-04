<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>风力负荷图</span>
        <div>
          <i
            style="cursor:pointer
          "
            :class="is_show1 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show1 = !is_show1"
          ></i>
          <span
            style="cursor:pointer
          "
            @click="is_show1 = !is_show1"
          >{{ is_show1 == true ? '收起' : '展开' }}</span>
        </div>
      </el-form-item>
    </el-form>

    <div class="charts" v-show="is_show1">
      <el-row :gutter="20">
        <el-col :span="24">
          <!-- <img
            :width="imgWidth"
            :src="path"
            style="display:block;margin:30px auto"
          />-->
          <div  style="text-align:center;">
            <el-image
              :class="imgClass?'imgLarge':'imgLoading'"
              :preview-src-list="[dialogImage]"
              :src="path"
              fit="contain"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选查询 -->
    <el-form>
      <el-form-item class="filterSearch">
        <i class="el-icon-search"></i>
        <span>筛选查询</span>
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
          >{{ is_show == true ? '收起' : '展开' }}</span>
          <el-button @click="search">查询结果</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--搜索操作 -->
    <div class="opt" v-if="is_show">
      <span>起始时间:</span>
      <el-date-picker
        v-model="startTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"
      ></el-date-picker>

      <span>结束时间:</span>
      <el-date-picker v-model="endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
      <span style="margin-left:20%;">条件:</span>
      <el-select v-model="type" placeholder="请选择" @change="selType(type)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import moment from 'moment'
export default {
  props: ['condition'],

  data() {
    return {
      imgClass:false,
      dialogImage: '', // 预览图片】
      path: '', // 算法生成的图片路径
      startTime: '2019-10-20',
      endTime: '2020-02-20',
      type: 4,
      options: [
        {
          value: 1,
          label: '风向'
        },
        {
          value: 2,
          label: '风速'
        },
        {
          value: 3,
          label: '玫瑰图'
        },
        {
          value: 4,
          label: '风力负荷图'
        }
      ],
      value: '',
      is_show: true,
      is_show1: true
    }
  },
  computed: {},

  created() {
    const yy = moment(new Date().getTime()).format('YYYY') - 1
    const mm = moment(new Date().getTime()).format('MM')
    const dd = moment(new Date().getTime()).format('DD')
    this.startTime = yy + '-' + mm + '-' + dd
    this.endTime = moment(new Date().getTime()).format('YYYY-MM-DD')
  },
  mounted() {},
  methods: {
    // 选择类型

    selType(type) {
      this.$emit('update-show', parseInt(type))
    },
    search() {
      this.init()
    },
    async init() {
      this.imgClass = false
      var newImg = new Image()
      newImg.src = this.path
      newImg.src = require('@/assets/sys_images/loading.gif')
      newImg.onerror = () => {
        // 图片加载错误时的替换图片
        newImg.src = require('@/assets/sys_images/loading.gif')
      }
      newImg.onload = () => {
        // 图片加载成功后把地址给原来的img
        this.path = newImg.src
      }
      let params = '?startTime=' + this.startTime + '&endTime=' + this.endTime

      let result = await axios.get(
        'http://121.36.62.243:9453/windSpeed/getWsProByTime' + params
      )
      if (result.data.code == 0) {
        this.imgClass = true
        this.path = result.data.data
        this.dialogImage = result.data.data
      }else{
        this.imgClass = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .opt {
    height: 50px;
    width: 100%;
    border: 1px solid #e4e4e4;
    padding: 5px 20px;
  }
  .dataTable {
    .headTitle {
      height: 50px;
      line-height: 50px;
      background: #f3f3f3;
      padding: 7px;
      border: 1px solid #e4e4e4;
    }
  }
  .chart1,
  .chart2 {
    width: 100%;
    height: 40vh;
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
.imgLarge{
  width: 500px;
}
.imgLoading{
  width:70px;
}
</style>
