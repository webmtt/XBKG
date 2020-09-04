<template>
  <div>
    <i
      @click="userListEvent"
      style="float: right;position: absolute;z-index: 100;right: 60px;top: 19px;font-size: 16px;"
      class="el-icon-user"
    ></i>
    <el-select
      v-if="userListShow"
      style="width: 140px;position: absolute;z-index: 200;right: 168px;top: 73px;"
      @change="userListChange"
      multiple
      v-model="users"
      clearable
      size="small"
      placeholder="用户列表"
      collapse-tags
    >
      <el-option
        v-for="(item, index) in sizeOptions"
        :key="index"
        :label="item.value"
        :value="item.value"
      ></el-option>
    </el-select>
    <span slot="footer" class="dialog-footer"></span>
    <div ref="dataTask" style="height: 100%;width:100%" />
  </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import { getInterfaceStatistics } from '@/api/index'
// import { getUsername } from '@/api/userManage'
export default {
  components: {},
  props: {},
  data() {
    return {
      users: [],
      userListShow: false,
      timer: null, // 定时器
      echartsData: '',
      seriesData: [],
      inf: [],
      userdata: [],
      dataTaskEcharts: '',
      sizeOptions: [],
      userText: '用户1',
      option: '',
      dimension: 1,
      schema: [],
      beginTimeInit: '',
      endTimeInit: '',
      maxcount: '',
      newtime: [],
      seluser: ['总数', '111', '12345', '789', 'lilei'],
      sum: '',
      ff: ''
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.initEcharts()
    })
    this.timer = setInterval(() => {
      this.initEcharts()
    }, 1 * 60 * 1000)
  },
  destroyed() {
    this.timer = null
  },
  methods: {
    userListEvent() {
      this.userListShow = !this.userListShow
    },
    // 点击用户列表动态显示echarts图表
    userListChange() {
      this.seluser = []
      this.users.forEach(item => {
        this.seluser.push(item)
      })
      this.seluser.unshift('总数')
    },
    handleCommand(command) {
      this.userText = command
      this.schema.forEach(ix => {
        if (ix.text === command) {
          this.dimension = ix.index
        }
      })
      this.initEcharts()
    },
    initEcharts() {
      this.dataTaskEcharts = echarts.init(this.$refs.dataTask)
      var itemStyle = {
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
      const day1 = new Date()
      var preDate = new Date(day1.getTime() - 22 * 60 * 60 * 1000)
      var nextDate = new Date(day1.getTime() + 60 * 60 * 1000)
      preDate.setTime(preDate.getTime())
      nextDate.setTime(nextDate.getTime())
      this.beginTimeInit =
        preDate.getFullYear() +
        '-' +
        (preDate.getMonth() + 1) +
        '-' +
        preDate.getDate() +
        ' ' +
        preDate.getHours() +
        ':00:00'
      this.endTimeInit =
        nextDate.getFullYear() +
        '-' +
        (nextDate.getMonth() + 1) +
        '-' +
        nextDate.getDate() +
        ' ' +
        nextDate.getHours() +
        ':00:00'
      getInterfaceStatistics({
        begintime: this.beginTimeInit,
        endtime: this.endTimeInit
      }).then(res => {
        if (res.data) {
          this.newtime = []
          this.seriesData = []
          this.echartsData = res.data
          this.counts = []
          this.ff = ''

          this.userdata = this.echartsData.username
          this.userdata.unshift('总数')
          this.inf = this.echartsData.interfaces

          this.sizeOptions = []
          this.schema = [{ index: 0, text: '' }]
          // 请求用户列表信息
          this.userdata.forEach(item => {
            this.sizeOptions.push({ label: item, value: item })
          })
          this.sizeOptions.forEach((ix, index) => {
            if (ix.label === '总数') {
              this.sizeOptions.splice(index, 1)
            }
          })
          this.echartsData.statisticstime.forEach(item => {
            this.newtime.push(item.substring(11, 13))
          })

          this.echartsData.statisticsdata.forEach((item, index) => {
            var tempdata = []
            item.forEach((inneritem, ix) => {
              this.sum = eval(inneritem.join('+'))
              this.counts.push(this.sum)
              var temp = []
              if (this.sum > 0) {
                inneritem.unshift(this.newtime[ix], this.sum)
                tempdata.push(inneritem)
              } else {
                temp.unshift(this.newtime[ix])
                tempdata.push(temp)
              }
            })
            this.seriesData.push({
              type: 'scatter',
              itemStyle: itemStyle,
              data: tempdata
            })
          })
          this.seriesData.forEach((inneritem, ix) => {
            inneritem.name = this.inf[ix]
          })
          const creatdata = () => {
            this.userdata.forEach((v, index) => {
              this.schema.push({ index: index, text: v })
            })
          }

          creatdata()
          this.maxcount =
            this.counts.sort((a, b) => {
              return b - a
            })[0] + 2
          this.option = {
            backgroundColor: '#fff',
            color: [
              '#3366cc',
              '#1a1aff',
              '#00004d',
              '#006666',
              '#00ffcc',
              '#33ccff',
              '#339966',
              '#6600ff',
              '#996600',
              '#ff9966',
              '#ff0066',
              '#990099',
              '#ff0000',
              '#66ff66',
              '#881235'
            ],
            title: {
              text: '24小时统计',
              color: '#000',
              textStyle: {
                color: '#000'
              }
            },
            legend: {
              top: 10,
              data: this.inf,
              textStyle: {
                color: '#000',
                fontSize: 16
              },
              width: '1000px'
            },
            grid: {
              left: '5%',
              right: '5%',
              top: '18%',
              bottom: '10%'
            },
            tooltip: {
              padding: 10,
              backgroundColor: '#222',
              borderColor: '#777',
              borderWidth: 1,
              formatter: obj => {
                var value = obj.value
                this.ff = ''
                value.forEach((v, index) => {
                  if (
                    index > 0 &&
                    this.seluser.indexOf(this.schema[index].text) >= 0
                  ) {
                    this.ff +=
                      this.schema[index].text + '：' + value[index] + '<br>'
                  }
                })
                return (
                  '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                  obj.seriesName +
                  ' ' +
                  value[0] +
                  '时：' +
                  '</div>' +
                  this.ff
                )
              }
            },
            xAxis: {
              type: 'category',
              name: '时间',
              nameGap: 16,
              nameTextStyle: {
                color: '#000',
                fontSize: 14
              },
              data: this.newtime,
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#000'
                }
              }
            },
            yAxis: {
              minInterval: 1,
              type: 'value',
              name: '调用次数',
              nameLocation: 'end',
              nameGap: 20,
              nameTextStyle: {
                color: '#000',
                fontSize: 16
              },
              axisLine: {
                lineStyle: {
                  color: '#000'
                }
              },
              splitLine: {
                show: false
              }
            },
            visualMap: [
              {
                left: 'right',
                top: '10%',
                dimension: 1,
                min: 0,
                max: this.maxcount,
                itemWidth: 30,
                itemHeight: 120,
                calculable: true,
                precision: 0.1,
                text: ['圆形大小：' + '总数'],
                textGap: 30,
                textStyle: {
                  color: '#000'
                },
                inRange: {
                  symbolSize: [10, 70]
                },
                outOfRange: {
                  symbolSize: [10, 70],
                  color: ['rgba(255,255,255,.2)']
                },
                controller: {
                  inRange: {
                    color: ['#c23531']
                  },
                  outOfRange: {
                    color: ['#444']
                  }
                }
              }
            ],
            series: this.seriesData
          }
          this.dataTaskEcharts.setOption(this.option)
        }
      })
    }
  }
}
</script>

<style>
.fileDetail {
  padding: 0 20px;
}
.fileDetail .el-dialog__body {
  padding: 0px 0 20px 0;
}
.el-dialog__header {
  background: transparent;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
<style lang="scss" scoped></style>
