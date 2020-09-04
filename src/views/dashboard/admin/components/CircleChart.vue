<template>
  <div style="display: flex;flex-direction: column;">
    <div ref="circle" style="flex: 1;height: 140px" />
    <div
      style="height: 30px;line-height: 30px;text-align: center;font-weight:bold"
    >
      {{ circleTitle }}
    </div>
  </div>
</template>

<script>
// import CountTo from 'vue-count-to'
import echarts from 'echarts'
export default {
  // components: {
  //   CountTo
  // },
  props: {
    color: {
      type: String,
      default: 'blue'
    },
    showValue: {
      type: Number,
      default: 0
    },
    circleTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      testImg: require('@/assets/sys_images/u748.png'),
      circleOptons: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          x: '25%',
          bottom: '35%',
          data: [
            {
              name: this.showValue,
              textStyle: {
                fontSize: 22,
                fontWeight: 'bolder',
                color: this.color
              },
              icon: 'none'
            }
          ]
        },
        series: [
          {
            name: '值',
            type: 'pie',
            radius: ['70%', '85%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{ value: this.showValue, name: this.showValue }],
            itemStyle: {
              normal: {
                color: this.color
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    const circle = echarts.init(this.$refs.circle)
    circle.setOption(this.circleOptons)
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
