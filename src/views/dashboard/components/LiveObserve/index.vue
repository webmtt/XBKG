<template>
  <div class="liveBox">
    <i
      @click="locationEvent"
      style="float: right;position: absolute;z-index: 1000;left: 111px;top: 18px;font-size: 16px;"
      class="el-icon-location-outline"
    ></i>
    <el-select
      v-if="locationShow"
      style="width: 140px;position: absolute;z-index: 100;left: 144px;top: 9px;font-size: 16px;"
      v-model="location"
      clearable
      size="small"
      placeholder="传感器位置"
      collapse-tags
      @change="locationChange"
    >
      <el-option
        v-for="(item, index) in locationOptions"
        :key="index"
        :label="item.value"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-row>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <div class="img-chart-wrap">
            <div class="pointChart">
              <div
                :class="{ 'is-active': activeCharts === 'wind' }"
                @click="changeChart('wind')"
              >
                <img
                  style="width: 20px; height: 20px;margin-right:10px"
                  :src="img2"
                />风速风向数据
              </div>
              <div
                :class="{ 'is-active': activeCharts === 'vis' }"
                @click="changeChart('vis')"
              >
                <img
                  style="width: 20px; height: 20px;margin: 0 10px"
                  :src="img2"
                />跑道视程数据
              </div>
            </div>
            <div class="chart-wap-box">
              <div
                ref="windCharts"
                class="charts charts-content wind-charts-content"
                :class="{ 'is-active-wind': activeCharts !== 'wind' }"
              ></div>
              <div
                ref="runCharts"
                class="charts charts-content run-charts-content"
                :class="{ 'is-active-run': activeCharts !== 'vis' }"
              >
                dafdfa
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <div class="img-chart-wrap">
            <div class="title">实时观测</div>
            <div style="flex: 1;display: flex;flex-direction: column;">
              <div style="display: flex;flex: 1">
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">平均风速</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #f75121;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.WIND.ws2a }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">m/s</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">平均风向</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #5974f9;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.WIND.ws2m }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">º</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">头风</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #5974f9;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.WIND.hw2a }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">m/s</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">侧风</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #5974f9;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.WIND.cw2a }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">m/s</span>
                  </div>
                </div>
              </div>
              <div style="display: flex;flex: 1">
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">温度</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #0598f7;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.HUMITEMP.tains }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">℃</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">相对湿度</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #3ed9b1;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.HUMITEMP.rhins }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">%</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">露点温度</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #3ed9b1;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.HUMITEMP.tdins }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">℃</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">气压</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #3ed9b1;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.PRESS.pains }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">Pa</span>
                  </div>
                </div>
              </div>
              <div style="display: flex;flex: 1">
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">天气现象</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #0598f7;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.PW.pw }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">RA</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">云底高</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #3ed9b1;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.CLOUD.cloudbase }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">m</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">降水量</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #3ed9b1;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.RAIN.sum_ins }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">mm</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">
                    修正海平面气压
                  </div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #3ed9b1;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">
                      {{ disPlayModel.PRESS.qnhins }}
                    </span>
                    <span style="font-size: 8px;margin-left: 3px">hPa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="img-chart-wrap">
            <div class="title">能见度和跑道视程</div>
            <div style="flex: 1;">
              <div ref="gauge" class="charts"></div>
              <div style="display: flex;flex: 1;margin-top: -45px;">
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">平均RVR</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #0598f7;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">{{
                      disPlayModel.VIS.rvr2a
                    }}</span>
                    <span style="font-size: 8px;margin-left: 3px">m</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">平均MOR</div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #3ed9b1;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">{{
                      disPlayModel.VIS.mor2a
                    }}</span>
                    <span style="font-size: 8px;margin-left: 3px">m</span>
                  </div>
                </div>
                <div
                  style="flex: 1;display: flex;flex-direction: column;align-items: center;"
                >
                  <div style="font-size: 14px;padding: 0 0 5px 0">
                    平均能见度
                  </div>
                  <div style="display: flex;align-items: center">
                    <span
                      style="width: 7px; height: 7px;background: #3ed9b1;margin-right: 5px"
                    ></span>
                    <span style="color: #666;font-weight: bold">{{
                      disPlayModel.VIS.vis2a
                    }}</span>
                    <span style="font-size: 8px;margin-left: 3px">m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'
import { getWindOrVisEhartsData } from '@/api/homePage'
import { guageOption, windOption, runWayOption } from './chartConfig'

export default {
  components: {},
  props: {
    realData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      locationShow: false,
      location: '05L',
      locationOptions: [
        {value: '05L',label: '05L'},
        {value: 'NORTH_MID',label: 'NORTH_MID'},
        {value: '23R',label: '23R'},
        {value: '05R',label: '05R'},
        {value: 'SOUTH_MID',label: 'SOUTH_MID'},
        {value: '23L',label: '23L'},
      ],
      temperature: 10, // wenduzhi
      gauge: null,
      img: require('@/assets/sys_images/晴.png'),
      img2: require('@/assets/sys_images/tollgle.png'),
      websock: null,
      activeCharts: '', // 当前图标展示
      isWindCharts: false,
      isRoadCharts: false,
      disPlayModel: {
        WIND: { ws2a: '--', ws2m: '--', hw2a: '--', cw2a: '--' },
        HUMITEMP: { tains: '--', rhins: '--', tdins: '--' },
        PRESS: { pains: '--', qnhins: '--' },
        VIS: { rvr: '--', rvr1a: '--', rvr2a: '--', mor2a: '--', vis2a: '--' },
        PW: { pw: '--' },
        CLOUD: { cloudbase: '--' },
        RAIN: { sum_ins: '--' }
      },
      timer: null // 定时器
    }
  },
  computed: {},
  watch: {
    realData(newData) {
      const locationValue = Object.keys(newData).filter(item => 
        newData[item].locationID === this.location
      )
      // Object.keys(newData).forEach(
      //   item => {
      this.disPlayModel[locationValue[0]] = newData[locationValue[0]]
          // }
      // )
    },
    'disPlayModel.VIS'(newValue) {
      guageOption.series[0].data[0].value = newValue.rvr
      this.gauge.setOption(guageOption)
    }
  },
  mounted() {
    this.changeChart('wind')
    this.gauge = echarts.init(this.$refs.gauge)
    guageOption.series[0].data[0].value = {}
    this.gauge.setOption(guageOption)
  },
  destroyed() {
    this.timer = null
  },
  methods: {
    locationChange(){
      this.disPlayModel = {
        WIND: { ws2a: '--', ws2m: '--', hw2a: '--', cw2a: '--' },
        HUMITEMP: { tains: '--', rhins: '--', tdins: '--' },
        PRESS: { pains: '--', qnhins: '--' },
        VIS: { rvr: '--', rvr1a: '--', rvr2a: '--', mor2a: '--', vis2a: '--' },
        PW: { pw: '--' },
        CLOUD: { cloudbase: '--' },
        RAIN: { sum_ins: '--' }
      }
    },
    locationEvent(){
      this.locationShow = !this.locationShow
    },
    changeChart(type) {
      if (this.activeCharts !== type) {
        this.activeCharts = type
        // 初始化风向图表
        const windCharts = echarts.init(this.$refs.windCharts)
        if (type === 'wind') {
          this.getWindEhartsData().then(res => {
            windOption.series.forEach(item => (item.data = res))
            windCharts.setOption(windOption)
          })
        } else if (type === 'vis') {
          const runCharts = echarts.init(this.$refs.runCharts)
          this.getRunWayData().then(res => {
            runWayOption.xAxis.data = res.times
            runWayOption.series[0].data = res.newrvrs
            runCharts.setOption(runWayOption)
          })
        }
      }
    },
    // 获取风速风向或者跑道视程数据
    getEchartsData(param) {
      return getWindOrVisEhartsData(param).then(res => res.data)
    },
    // 获取跑跑道视图数据
    getRunWayData() {
      const nowtime = new Date().getTime()
      const param = {
        starttime: moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss'),
        endtime: moment(nowtime).format('YYYY-MM-DD HH:mm:ss'),
        type: this.activeCharts
      }

      return this.getEchartsData(param).then(data => {
        const { times, rvrs } = data
        const newtimes = []
        const newrvrs = []
        times.forEach((item, index) => {
          newtimes.push(moment(item).format('HH'))
          newrvrs.push(rvrs[index])
        })
        return {
          times: newtimes,
          newrvrs: newrvrs
        }
      })
    },

    getWindEhartsData() {
      const nowtime = new Date().getTime()
      const param = {
        starttime: moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss'),
        endtime: moment(nowtime).format('YYYY-MM-DD HH:mm:ss'),
        type: this.activeCharts
      }
      return this.getEchartsData(param).then(data => {
        data.times.splice(0,1)
        data.wdinss.splice(0,1)
        data.wsinss.splice(0,1)
        const { times, wdinss, wsinss } = data
        return times.map((item, index) => [
          moment(times[index]).format('HH'),
          wsinss[index],
          wdinss[index]
        ])
      })
    }
    // getVisEhartsData() {
    //   const param = {
    //     starttime: '2019-12-31 10:06:24',
    //     endtime: '2019-12-31 10:07:44',
    //     type: 'vis'
    //   }
    //   return this.getEchartsData(param).then(data => {
    //     let { times, rvrs, rvr1as } = data
    //     const set = new Set(times)
    //     times = Array.from(set)
    //     rvrs = rvrs.slice(0, times.length)
    //     rvr1as = rvr1as.slice(0, times.length)
    //     return { times, rvrs, rvr1as }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.liveBox {
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 270px;
  background-color: #ffffff;
  justify-content: space-between;
  & > div {
    width: 100%;
  }
  .is-active {
    color: #000;
  }
  .img-chart-wrap {
    // min-width: 310px;
    // width: 400px;
    height: 240px;
    border-radius: 10px;
    position: relative;
    margin-right: 3px;
    display: flex;
    flex: 1;
    margin: 20px 10px 10px;
    box-shadow: rgba(62, 57, 107, 0.3) 0px 6px 16px 2px;
    flex-direction: column;
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: #000;
    }
    .chart-wap-box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      .charts-content {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        transition: transform 0.6s;
      }
      .wind-charts-content {
        transform: translateX(0px);
      }
      .run-charts-content {
        transform: translateX(0px);
      }
      .is-active-wind {
        transform: translateX(-100%);
      }
      .is-active-run {
        transform: translateX(100%);
      }
      // background: red;
    }
  }
  img {
    height: 100%;
    width: 100%;
  }
  .charts {
    height: 100%;
  }
  .pointChart {
    position: absolute;
    top: 10px;
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 14px;
    // color: #f0f32c;
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    color: #ccc;
    & > div {
      :nth-of-type(1){
         margin-left:10px;
      }
      display: flex;
      align-items: center;
    }
  }
}
</style>
