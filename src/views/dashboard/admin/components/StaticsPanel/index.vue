<template>
  <div class="statics-panel">
    <div class="infoBox">
      <i
        @click="renovate"
        style="    position: absolute;top: 51px;right: 63px;"
        :class="[rotate?  'el-icon-refresh-right go' : 'el-icon-refresh-right aa' ]"
      ></i>
      <div class="header">
        <img :src="day" />
        <div class="infoTitle">Day 日</div>
      </div>
      <div class="content">
        <div>
          <div class="count">文件个数</div>
          <div class="countValue">
            <span style="margin-right: 5px;font-size: 20px">{{ dataMoel.day.filecount }}</span>
            <!-- <img :src="down" /> -->
          </div>
        </div>
        <div>
          <div class="count">报文个数</div>
          <div class="countValue">
            <span style="margin-right: 5px;font-size: 20px">{{ dataMoel.day.msgcount }}</span>
            <!-- <img :src="up" /> -->
          </div>
        </div>
      </div>
    </div>
    <div class="infoBox">
      <div class="header">
        <img :src="week" />
        <div class="infoTitle">Week 周</div>
      </div>
      <div class="content">
        <div>
          <div class="count">文件个数</div>
          <div class="countValue">
            <span style="margin-right: 5px;font-size: 20px">{{ dataMoel.week.filecount }}</span>
            <!-- <img :src="down" /> -->
          </div>
        </div>
        <div>
          <div class="count">报文个数</div>
          <div class="countValue">
            <span style="margin-right: 5px;font-size: 20px">{{ dataMoel.week.msgcount }}</span>
            <!-- <img :src="up" /> -->
          </div>
        </div>
      </div>
    </div>
    <div class="infoBox">
      <div class="header">
        <img :src="month" />
        <div class="infoTitle">Month 月</div>
      </div>
      <div class="content">
        <div>
          <div class="count">文件个数</div>
          <div class="countValue">
            <span style="margin-right: 5px;font-size: 20px">{{ dataMoel.month.filecount }}</span>
            <!-- <img :src="down" /> -->
          </div>
        </div>
        <div>
          <div class="count">报文个数</div>
          <div class="countValue">
            <span style="margin-right: 5px;font-size: 20px">{{ dataMoel.month.msgcount }}</span>
            <!-- <img :src="up" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStatics } from '@/api/homePage'

export default {
  name: 'StaticPanel',
  components: {},
  data() {
    return {
      rotate: false,
      timer: null,
      day: require('@/assets/sys_images/日.png'),
      week: require('@/assets/sys_images/周.png'),
      month: require('@/assets/sys_images/月.png'),
      down: require('@/assets/sys_images/down.png'),
      up: require('@/assets/sys_images/up.png'),
      dataMoel: {
        day: {},
        week: {},
        month: {},
        year: {}
      }
    }
  },
  mounted() {
    this.getData()
    this.timer = setInterval(() => {
      this.getData()
    }, 1000 * 10)
  },
  destroyed() {
    this.timer && window.clearInterval(this.timer)
  },
  methods: {
    //刷新页面
    renovate() {
      this.rotate = !this.rotate
      this.getData()
    },
    getData() {
      getStatics().then(res => (this.dataMoel = res.data))
    }
  }
}
</script>

<style lang="scss" scoped>
.aa {
  transition: all 1s;
}

.go {
  transform: rotate(360deg);
  transition: all 1s;
}
.statics-panel {
  height: 440px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 15px;
}
.infoBox {
  height: 120px;
  display: flex;
  border-radius: 15px;
  flex-direction: column;
  padding: 10px 20px;
  background: #f8f6f9;
  .header {
    height: 40px;
    line-height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      width: 28px;
      height: 28px;
    }
    .infoTitle {
      flex: 1;
      padding-left: 20px;
      font-size: 24px;
      color: #183c97;
      font-weight: bold;
    }
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: row;
    & > div {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .count {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #414141;
      font-weight: bold;
    }
    .countValue {
      flex: 1;
      color: #2495f0;
      font-weight: bold;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>
