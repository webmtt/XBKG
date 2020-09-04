<template>
  <div>
    <div class="dashboard-editor-container">
      <div class="home-line" style="margin-bottom:32px;">
        <!-- <div style="position: absolute;right: 0px;top: 10px;">
          <el-collapse-transition>
            <div v-show="warningShow">
              <div class="transition-box">{{ warningInfo }}</div>
            </div>
          </el-collapse-transition>
        </div>-->
        <div class="bgWhite home-left">
          <h1 class="titleHeader">
            <span>数据采集监控</span>
          </h1>
          <div style="padding: 20px 0 0 0">
            <card-panel :card-data="dataClassData" />
          </div>
        </div>

        <div class="bgWhite column-flex home-right">
          <h1 @click="routerLink" class="titleHeader">
            <span>数据采集统计</span>
          </h1>
          <div class="column-flex" style="flex: 1;">
            <statics-panel />
          </div>
        </div>
      </div>
      <el-row :gutter="32" style="margin-bottom:32px;height:340px;">
        <el-col :xs="24" :sm="24" :lg="24" style="height:100%">
          <div class="bgWhite" style=" height:100%">
            <div style="display: flex;flex-direction: column;">
              <h1 @click="routerLinkLocal" class="titleHeader">
                <span>自观</span>
              </h1>
              <div style="flex: 1;">
                <live-observe :real-data="liveData" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="32" style="margin-bottom:32px;height:500px;">
        <el-col :xs="12" :sm="12" :lg="12" style="height:100%">
          <div class="bgWhite" style=" flex: 1;height:100%">
            <div style="height:100%">
              <div>
                <div
                  style="height: 40px;display: flex;flex-direction: row;background: #fff;border-bottom: 1px solid #ccc;align-items: center"
                >
                  <div
                    :style="{
                      backgroundImage:
                        activeIndex === 0
                          ? 'url(' + headerImage + ')'
                          : '',
                      color: activeIndex === 0 ? '#fff' : ''
                    }"
                    style="backgroundSize: 100%, 100%;width:116px; display: flex; align-items: center; justify-content: center;font-weight: bold;height: 29px;cursor:pointer"
                    @click="changeImg(0)"
                  >雷达拼图</div>
                  <div
                    :style="{
                      backgroundImage:
                        activeIndex === 1
                          ? 'url(' + headerImage + ')'
                          : '',
                      color: activeIndex === 1 ? '#fff' : ''
                    }"
                    style="backgroundSize: 100%, 100%;width:116px;; display: flex; align-items: center; justify-content: center;font-weight: bold;height: 29px;cursor:pointer"
                    @click="changeImg(1)"
                  >卫星云图</div>
                </div>
                <div class="loopImg" style="padding: 20px;background: #fff;height: auto">
                  <el-carousel
                    ref="loopImg"
                    :initial-index="activeIndex"
                    @change="loopChange"
                    :height="carouselWidth"
                  >
                    <el-carousel-item v-for="(item, index) in images" :key="index" style="flex: 1">
                      <img style="width: auto; height:100%" :src="item" @click="showBigImg(item)" />
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" style="height:100%">
          <div class="bgWhite" style=" flex: 1;height:100%">
            <div style="height:100%">
              <div>
                <div
                  style="height: 40px;display: flex;flex-direction: row;background: #fff;border-bottom: 1px solid #ccc;align-items: center"
                >
                  <div
                    :style="{
                      backgroundImage:
                        activeIndexRight === 0
                          ? 'url(' + headerImage + ')'
                          : '',
                      color: activeIndexRight === 0 ? '#fff' : ''
                    }"
                    style="backgroundSize: 100%, 100%;width:116px; display: flex; align-items: center; justify-content: center;font-weight: bold;height: 29px;cursor:pointer"
                    @click="changeImgRight(0)"
                  >高空风温预报图</div>
                  <div
                    :style="{
                      backgroundImage:
                        activeIndexRight === 1
                          ? 'url(' + headerImage + ')'
                          : '',
                      color: activeIndexRight === 1 ? '#fff' : ''
                    }"
                    style="backgroundSize: 100%, 100%;width:116px;; display: flex; align-items: center; justify-content: center;font-weight: bold;height: 29px;cursor:pointer"
                    @click="changeImgRight(1)"
                  >重要天气预告图</div>
                </div>
                <div class="loopImg" style="padding: 20px;background: #fff;height: auto">
                  <el-carousel
                    ref="loopImgRight"
                    :initial-index="activeIndexRight"
                    @change="loopChangeRight"
                    :height="carouselWidth"
                  >
                    <el-carousel-item
                      v-for="(item, index) in imagesRight"
                      :key="index"
                      style="flex: 1"
                    >
                      <img style="width: auto;; height:100%" :src="item" @click="showBigImg(item)" />
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-bottom:32px;">
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="bgWhite">
            <h1 @click="routerLinkMonitor" class="titleHeader">
              <span>服务接口调用监控</span>
            </h1>
            <div style="padding: 10px;height: 500px">
              <interface-panel style="height:500px" />
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-bottom:32px;">
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="bgWhite">
            <h1 class="titleHeader">
              <span>全国</span>
            </h1>
            <div style="padding: 10px;height:700px">
              <div id="china" ref="map" style="height: 100%;" />
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 图片详情展示 -->
      <el-dialog
        v-if="dialogImgUrl"
        title="图片详情"
        width="60vw"
        :visible.sync="dialogImageVisible"
        top="5vh"
      >
        <!-- style="width:100%; height: 70vh" -->
        <el-image :style="dialogStyle" :src="dialogImgUrl" :preview-src-list="srcList"></el-image>
        <!-- <img :src="dialogImgUrl" alt="" style="width:100%; height: auto" /> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import airportAaddress from '../airport.js'

import echarts from 'echarts'

import CardPanel from './components/CardPanel'
import InterfacePanel from './components/InterfacePanel'
import StaticsPanel from './components/StaticsPanel'
import LiveObserve from '../components/LiveObserve'

import 'echarts/map/js/china.js'
import climateLists from '../climate.js'

import {
  getAirporDetail,
  getAirporInfo,
  getLoopPicture,
  pushWebsocket
} from '@/api/index'

import wsRequest from '@/utils/wsRequest'

import options from '../options.js'

export default {
  name: 'DashboardAdmin',
  components: {
    CardPanel,
    StaticsPanel,
    LiveObserve,
    InterfacePanel
  },
  data() {
    return {
      dialogStyle: {
        width: '0',
        height: '0'
      },
      dialogImageVisible: false, // 大图展示
      dialogWith: '600px',
      dialogImgUrl: '',
      srcList: [],
      timer: null,
      timerLoop: null,
      warningShow: true,
      warningInfo: '',
      chinaMap: '',
      filterAirport: '',
      carouselWidth: '400px', // 轮播高度
      // carouseProportion: 86 / 56, // // 轮播图片比例
      isDataChange: false,
      activeIndex: 0,
      activeName: '',
      activeIndexRight: 0,
      dataClassData: {},
      liveData: null,
      headerImage: require('@/assets/sys_images/icon.png'),
      climateLists: climateLists,
      serverClusterImg: require('@/assets/sys_images/u1095.jpg'),
      testImg: require('@/assets/sys_images/u748.png'),
      dataStatistic: options.dataStatistic,
      images: [],
      imagesRight: [],
      extremeWeatherOptions: options.extremeWeatherOptions,
      extremeWeatherData: options.extremeWeatherData,
      monthClimateOptions: options.monthClimateOptions,
      monthClimateData: options.monthClimateData,
      mapOption: options.mapOption,
      mapActivew: [], // 激活点亮状态
      airAaddress: [], // 机场信息
      mapActivewtimer: null, // 激活点亮状态,
      codeNames: '',
      Hum_: '',
      WindS_2_: '',
      Qfe_: '',
      Temp_: '',
      TIME: ''
    }
  },
  computed: {
    getOpcity() {
      return {
        filter: `opacity(${Number(
          (this.gaugeOption.series[0].data[0].value / 220).toFixed(2)
        )})`
      }
    }
  },
  watch: {
    dialogImageVisible() {
      if (!this.dialogImageVisible) {
        this.dialogImgUrl = null
        // this.dialogWith = '0'
      }
    }
  },
  destroyed() {
    this.timer && window.clearInterval(this.timer)
    this.timerLoop && window.clearInterval(this.timerLoop)
  },
  mounted() {
    this.mapOption.series[2].cursor = 'crosshair'
    this.loopPictures()
    // 定时请求轮播图
    this.timer = setInterval(() => {
      this.loopPictures()
      const day2 = new Date()
      // console.log('循环',day2.getTime())
    }, 300000)
    this.chinaMap = echarts.init(this.$refs.map)
    this.chinaMap.setOption(this.mapOption)
    this.airportStatus()
    // 定时请求机场信息状态
    this.timerLoop = setInterval(() => {
      this.airportStatus()
      const day1 = new Date()
      // console.log('机场',day1.getTime())
    }, 20000)
    this.airportInfo()
    pushWebsocket().then(res => {})
  },
  created() {
    airportAaddress.forEach(item => {
      if (item.airportData && item.airportData.length) {
        item.airportData.forEach(citem => {
          this.airAaddress.push(citem)
        })
      }
    })
    this.initWebSocket()
  },
  methods: {
    // 页面跳转
    routerLink() {
      this.$router.push({ path: '/collection/monitor/task' })
    },
    routerLinkLocal() {
      this.$router.push({ path: '/application/serachDownload' })
    },
    routerLinkMonitor() {
      this.$router.push({
        path: '/backstage/statusMonitoring/service-monitoring'
      })
    },
    // 首页轮播图
    loopPictures() {
      getLoopPicture('radar').then(rec => {
        this.images[0] = rec.zipUrl
      })
      getLoopPicture('kh_8').then(rec => {
        this.images[1] = rec.zipUrl
      })
      getLoopPicture('gk').then(rec => {
        this.imagesRight[0] = rec.zipUrl
      })
      getLoopPicture('zy').then(rec => {
        this.imagesRight[1] = rec.zipUrl
      })
    },
    // 全国机场模拟分布图状态显示
    airportStatus() {
      getAirporInfo({
        second: 20
      }).then(response => {
        if (response.data.length) {
          const arr = response.data.map(item => {
            return { type: item }
          })
          this.setMapData(arr)
        } else {
          this.setMapData([])
        }
      })
    },
    setMapData(arr) {
      const newDataList = []
      const oldDataList = []
      arr.forEach((x, index) => {
        const obj = this.mapActivew.find(item => item.type === x.type) || null
        // 如果不存在，加入数据，如果存在更新时间
        !obj
          ? this.mapActivew.push({ type: x.type, date: new Date().getTime() })
          : (obj['date'] = new Date().getTime())
      })

      // 根据时间分组数据
      const newShowTime =
        window.DefaultSetting.homeData.airPorts.newShowTime || 10
      const disappearTime =
        window.DefaultSetting.homeData.airPorts.disappearTime || 10

      this.mapActivew.forEach((item, index) => {
        // 前 newShowTime 分钟数据
        const newTime = new Date().getTime()
        if (newTime - item.date < newShowTime * 60 * 1000) {
          // 超过3秒
          this.airAaddress.forEach(citem => {
            if (citem.code === item.type) {
              newDataList.push(citem)
            }
          })
          // this.mapActivew.splice(index, 1)
        } else if (
          newTime - item.date >= newShowTime * 60 * 1000 &&
          newTime - item.date < (disappearTime - newShowTime) * 60 * 1000
        ) {
          // 3分钟到10分钟的数据
          this.airAaddress.forEach(citem => {
            if (citem.code === item.type) {
              oldDataList.push(citem)
            }
          })
        } else {
          // 剔除时间大于3秒的数据
          // 大于10分钟的数据
          this.mapActivew.splice(index, 1)
        }
      })
      if (newDataList.length !== 0) {
        this.mapOption.series[2].data = []
        newDataList.forEach((Titem, index) => {
          this.mapOption.series[2].name = Titem.airportName
          this.mapOption.series[2].data.push({
            name: Titem.airportName,
            value: [Titem.lat, Titem.lon]
          })
        })
      } else {
        this.mapOption.series[2].name = null
        this.mapOption.series[2].data = []
      }
      if (oldDataList.length !== 0) {
        this.mapOption.series[1].data = []
        oldDataList.forEach((Titem, index) => {
          this.mapOption.series[1].name = Titem.airportName
          this.mapOption.series[1].data.push({
            name: Titem.airportName,
            value: [Titem.lat, Titem.lon, 10]
          })
        })
      } else {
        this.mapOption.series[1].name = null
        this.mapOption.series[1].data = []
      }
      this.chinaMap = echarts.init(this.$refs.map)
      this.chinaMap.setOption(this.mapOption)
    },
    // 点击某一机场，显示相关机场的数据信息
    airportInfo() {
      this.chinaMap.on('click', params => {
        this.Hum_ = ''
        this.WindS_2_ = ''
        this.Temp_ = ''
        this.Qfe_ = ''
        this.TIME = ''
        this.mapOption.tooltip.formatter = function(params) {
          return params.name
        }
        this.$nextTick(() => {
          this.mapOption.series[2].cursor = 'crosshair'
        })
        airportAaddress.map(item => {
          this.filterAirport = item.airportData.filter(
            item => item.airportName === params.name
          )
          if (this.filterAirport.length !== 0) {
            this.codeNames = this.filterAirport[0].airportName
            getAirporDetail({
              // airport: this.filterAirport[0].code.substr(1)
              airport: this.filterAirport[0].code
            }).then(response => {
              this.Hum_ = response.data.Hum_
              this.WindS_2_ = response.data.WindS_2_
              this.Temp_ = response.data.Temp_
              this.Qfe_ = response.data.Qfe_
              this.TIME = response.data.TIME
              if (response.data !== null) {
                this.mapOption.tooltip.formatter = params => {
                  let value = (params.value + '').split('.')
                  value = value[0].replace(
                    /(\d{1,3})(?=(?:\d{3})+(?!\d))/g,
                    '$1,'
                  )
                  if (this.codeNames === params.name) {
                    return (
                      '机场名称：' +
                      params.name +
                      '<br/>' +
                      '，相对湿度：' +
                      this.Hum_ +
                      '<br/>' +
                      '，风速：' +
                      this.WindS_2_ +
                      '<br/>' +
                      '，温度：' +
                      this.Temp_ +
                      '<br/>' +
                      '，压力：' +
                      this.Qfe_ +
                      '<br/>' +
                      '，时间：' +
                      this.TIME
                    )
                  } else {
                    return params.name
                  }
                }
              } else {
                this.mapOption.tooltip.formatter = function(params) {
                  return params.name
                }
              }
            })
          }
        })
      })
    },
    delOthersVisitedViews({ commit, state }, view) {},
    loopChange(value) {
      this.activeIndex = value
    },
    loopChangeRight(value) {
      this.activeIndexRight = value
    },
    changeImg(value) {
      this.$refs.loopImg.setActiveItem(value)
    },
    changeImgRight(value) {
      this.$refs.loopImgRight.setActiveItem(value)
    },
    initWebSocket() {
      const wsUrl = wsRequest.wsUrl
      this.websock = new WebSocket(wsUrl)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },

    // 连接建立之后执行send方法发送数据
    websocketonopen() {
      this.websocketsend('ok')
    },

    // 连接建立失败重连
    websocketonerror() {
      this.initWebSocket()
    },

    // 数据接收
    websocketonmessage(e) {
      if (/ok/.test(e.data)) return
      if (typeof e.data == 'string') {
        try {
          const data = JSON.parse(e.data)
          if (typeof data == 'object' && data) {
            if (data.type || data.socketStatus) {
              this.dataClassData = data
            } else if (data.reason) {
              this.warningShow = true
              this.warningInfo = data.reason
            } else {
              this.liveData = data || {}
              this.warningShow = false
            }
          }else{
            return
          }
        } catch (e) {
          return
        }
      }
      setTimeout(() => {
        if (!this.isDataChange) {
          this.isDataChange = true
        }
      }, 100)
    },

    // 数据发送
    websocketsend(Data) {
      this.websock.send(Data)
    },

    // 关闭
    websocketclose(e) {
      console.log('断开连接', e)
    },

    closeSocket() {
      this.websock.close()
    },
    // 显示大图
    showBigImg(d) {
      const img = new Image()
      img.src = d
      img.onload = e => {
        this.srcList.push(d)
        const a = parseFloat(img.width / img.height)
        // if (img.width >= img.height) {
        // 横图
        this.dialogStyle = {
          width: '100%',
          height: 'auto'
        }
        // } else {
        // this.dialogStyle = {
        // width: a * 600 + 'px',
        // height: '500px'
        // }
        // }
        //  this.dialogWith = '60vw' // img.width >= 1920 ? '1920px' : img.width + 'px'
        // this.dialogWith = this.dialogWith
        this.dialogImgUrl = d
        this.dialogImageVisible = true
      }
    }
  }
}
</script>
<style>
.el-dialog__body {
  /* width: 800px; */
  /* height: 600px; */
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.transition-box {
  margin-bottom: 10px;
  width: 113px;
  border-radius: 4px;
  background-color: red;
  text-align: center;
  color: #fff;
  box-sizing: border-box;
  margin-right: 20px;
}
.warningInfo {
  width: 100px;
  height: 30px;
  border: 1px solid red;
  position: absolute;
  right: 10px;
  top: 7px;
}
/* .loopImg .el-carousel__container {
  height: 220px;
} */
.el-carousel__container > div {
  display: flex;
  justify-content: center;
  /* align-items: center */
}
</style>
<style lang="scss" scoped>
#china > div > canvas:hover {
  cursor: default !important;
}
.titleHeader {
  cursor: pointer;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  margin: 0;
  border-bottom: 1px solid #ccc;
  span {
    padding: 0 20px;
    border-left: 3px solid #4fcbc5;
  }
}
.bgWhite {
  background: #fff;
  padding: 0 20px 20px 20px;
}
.column-flex {
  display: flex;
  flex-direction: column;
}
.dashboard-editor-container {
  min-width: 1200px;
  padding: 32px 0px;
  background-color: #f1f4f9;
  position: relative;
  color: #666;
  .home-line {
    display: flex;
    justify-content: flex-start;
    min-width: 1200px;
    margin: 0 auto;
    .home-left {
      min-width: 900px;
    }
    .home-right {
      min-width: 280px;
      margin-left: 20px;
    }
  }

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.activeHeader {
  color: red !important;
}

#arrow {
  position: relative;
  color: #fff;
  font-size: 18px;
  animation: mymove 10s infinite;
  -webkit-animation: mymove 10s infinite;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

@media (min-width: 1240px) {
  .dashboard-editor-container {
    padding: 32px 20px;
  }
}
.aa-bb {
  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    // white-space: nowrap;
    flex: 1;
    height: 96px;
    align-items: center;
    display: flex;
    font-size: 14px;
    line-height: 120%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
  }
  padding: 26px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 10px 0px;
}
</style>
