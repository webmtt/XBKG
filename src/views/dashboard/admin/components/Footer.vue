<template>
  <div class="footer">
    <div class="top">
      <div class="left">
        <h3>相关链接</h3>
        <div>
          <a href="http://10.172.16.181:801/#/" target="_blank">
            陕西省气象大数据资源目录服务系统
          </a>
        </div>
        <div>
          <a href="http://10.172.8.166:8080/#/" target="_blank">
            陕西省气象数据共享网
          </a>
        </div>
        <div>
          <a href="http://10.172.89.55/cimissapiweb/" target="_blank">
            CIMISS气象数据统一服务接口
          </a>
        </div>
      </div>
      <div class="center">
        <h3>服务支持</h3>
        <div>
          <router-link to="/home/aboutUs">关于我们</router-link>
        </div>
        <div>
          <router-link to="/home/problems">常见问题</router-link>
        </div>
        <div>
          <router-link to="/userSpace/index/userFeed">用户反馈</router-link>
        </div>
      </div>
      <div class="right" style="margin-top: 0">
        <h3>联系我们</h3>
        <div>029-63256789</div>
        <div>029-63256789</div>
        <div>陕西省西安市北关正街36号气象大厦</div>
      </div>
    </div>
    <div class="bottom">
      <div>
        <span>版权所有&nbsp:&nbsp陕西省气象信息中心</span>
        <span style="margin-left:1rem">
          地址&nbsp:&nbsp陕西省西安市北关正街36号气象大厦
        </span>
      </div>
      <div style="margin-top:0.5rem">
        Copyright@2017-2018 陕西省气象信息中心 All Right Reserved
      </div>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.footer {
  padding-top: 42px;
  .top {
    display: flex;
    justify-content: space-between;
    color: #8f9299;
    font-size: 1rem;
    h3 {
      font-size: 1.1rem;
      color: white;
      margin-bottom: 2rem;
    }

    .left {
      flex: 1;
      text-align: right;
      div {
        margin: 0.8rem 0;
      }
    }

    .center {
      flex: 1;
      text-align: center;
      div {
        margin: 0.8rem 0;
      }
    }

    .right {
      text-align: left;
      flex: 1;
      div {
        margin: 0.8rem 0;
      }
    }
  }

  .bottom {
    padding-top: 2rem;
    border-top: 1px solid #3e3e3e;
    text-align: center;
    margin-top: 2rem;
    color: #8f9299;
    font-size: 0.9rem;
  }
}
</style>
