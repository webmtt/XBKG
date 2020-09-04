<template>
  <div class="wrapBox">
    <!-- header part -->
    <div class="header">
      <img :src="headerImg" class="headerImage" />
      <h4 class="headerTitle">航空气象资料存储管理应用系统</h4>
      <!-- top navgation -->
      <el-menu
        :router="true"
        style="display: flex;width: 600px;background-color: rgb(1, 33, 126);justify-content: space-between;"
        :default-active="active_top_route"
        mode="horizontal"
        background-color="#01217e"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item
          v-for="(item, index) in permission_routes"
          :key="index"
          :index="item.path"
        >
          {{ item.meta.title }}
        </el-menu-item>
      </el-menu>
      <!-- user function -->
      <div class="right-menu">
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <div class="right-menu-item hover-effect item">
          <el-popover placement="bottom" width="400" trigger="click">
            <div v-if="warningList.length">
              <el-table :data="warningList">
                <el-table-column
                  width="100"
                  property="datatype"
                  label="类型名称"
                ></el-table-column>
                <el-table-column
                  width="100"
                  property="count"
                  label="警报数量"
                ></el-table-column>
                <el-table-column
                  width="170"
                  property="reason"
                  label="警报内容"
                ></el-table-column>
              </el-table>
              <el-form style="margin-top:10px;">
                <el-form-item>
                  <el-button type="warning" @click="tagOver">
                    全部标记为已读
                    <i class="el-icon-view" />
                  </el-button>
                  <el-button type="success" @click="warningClick">
                    查看详情
                    <i class="el-icon-reading" />
                  </el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-badge slot="reference" :value="warningNumber" :max="99">
              <i style="font-size: 24px" class="el-icon-bell" />
            </el-badge>
          </el-popover>
        </div>
        <!-- logout -->
        <div style="border: none;" class="right-menu-item">
          <el-dropdown>
            <span class="el-dropdown-link">{{userNameShow}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <p @click="logout">退出</p>
                <!-- <img :src="require('@/assets/sys_images/退出.png')" style="width: 20px;cursor: pointer;"/>  -->
              </el-dropdown-item>
              <el-dropdown-item>
                <p @click="resetPassword">修改密码</p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 修改密码的弹框 -->
    <el-dialog title="修改密码" :visible.sync="resetVisible" width="30%">
      <div class="resetForm">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model.number="ruleForm.userName"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="旧密码" prop="oldPass">
            <el-input
              v-model="ruleForm.oldPass"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input
              v-model="ruleForm.newPass"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button @click="cancelReset('ruleForm')">取消</el-button>
            <el-button type="primary" @click="ensureSubmit('ruleForm')">
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <div class="mainContent">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import wsRequest from '@/utils/wsRequest'
// import Search from '@/components/HeaderSearch'
import { logout, resetPass } from '@/api/login'

import { getwarryListUpdata } from '@/api/collection'

export default {
  name: 'WrapBox',
  components: {
    // Breadcrumb,
    // Hamburger,
    ErrorLog,
    Screenfull
    // Search
  },

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        if (this.ruleForm.newPass !== '') {
          this.$refs.ruleForm.validateField('newPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次新密码'))
      } else {
        callback()
      }
    }
    return {
      userNameShow: Cookies.get('userName'),
      i: 0,
      warningNumber: 0,
      resetVisible: false,
      headerImg: require('@/assets/sys_images/headerImg.png'),
      ruleForm: {
        oldPass: '',
        newPass: '',
        userName: Cookies.get('userName')
      },
      rules: {
        oldPass: [{ validator: validatePass, trigger: 'blur' }],
        newPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      warningList: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'active_top_route',
      'sidebar',
      'avatar',
      'device'
    ])
  },
  watch: {
    '$route.path': {
      handler(newValue) {
        const matchRouter = this.permission_routes.filter(item =>{

          new RegExp(item.path).test(newValue)
        }
        )
        const activeTopMenu = (matchRouter.length && matchRouter[0].path) || ''
        activeTopMenu &&
          this.$store.dispatch(
            'permission/generateTopActiveMenu',
            activeTopMenu
          )
      },
      immediate: true
    }
  },
  created() {
    this.initWebSocket()
  },
  methods: {
    initWebSocket() {
      const wsUrl = wsRequest.wsUrl
      this.websock = new WebSocket(wsUrl)
      this.websock.onmessage = this.websocketonmessage
    },
    // 数据接收
    websocketonmessage(e) {
      if (/ok/.test(e.data)) return
      const data = JSON.parse(e.data)
      if (
        data.colleFaildStatisticsList &&
        data.colleFaildStatisticsList.length
      ) {
        this.warningList = data.colleFaildStatisticsList
        // console.log('data.total=', data.total)
        // data.colleFaildStatisticsList.forEach(item => {
        //   // eslint-disable-next-line no-extra-semi
        //   ;(k => {
        //     setTimeout(() => {
        //       this.$notify({
        //         title: `警告(${k.datatype})`,
        //         message: `${k.reason}（共计${
        //           k.count && k.count !== undefined ? k.count : 0
        //         }个）`,
        //         type: 'warning',
        //         duration: window.DefaultSetting.elConfig.notifyDuration || 3000
        //       })
        //     }, 100)
        //   })(item)
        // })
        this.warningNumber = data.total
      }
    },
    warningClick() {
      this.$router.push({ path: '/collection/monitor/warning' })
    },
    // 标记为已读
    tagOver() {
      getwarryListUpdata()
        .then(res => {
          this.warningList = []
          this.warningNumber = 0
        })
        .catch()
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$store.dispatch('user/logout')
        .then(() => {
          // debugger;
          this.$store.commit('permission/SET_ROUTES', []);
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        });
    },
    resetPassword() {
      this.resetVisible = true
    },
    cancelReset(formName) {
      this.$refs[formName].resetFields()
      this.resetVisible = false
    },
    ensureSubmit(formName) {
      const _this = this
      this.$refs[formName].validate(valid => {
        const md5 = require('md5')
        const params = {
          userName: _this.ruleForm.userName,
          password: md5(_this.ruleForm.oldPass),
          newPassword: md5(_this.ruleForm.newPass)
        }
        if (valid) {
          resetPass(params).then(res => {
            if (res.code === '000000') {
              this.$Message.success('修改成功')
              this.resetVisible = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapBox {
  height: 100%;
  min-height: 100vh;
  flex-direction: column;
}
.wrapBox .header {
  height: 57px;
  display: flex;
  padding: 0 20px;
  background: #01217e;
  align-items: center;
}
.wrapBox .el-dialog__wrapper {
  .el-dialog {
    .el-dialog__body {
      .resetForm {
        .el-form-item {
          margin-bottom: 20px !important;
        }
      }
    }
  }
}
.wrapBox /deep/ .el-dialog {
  overflow: hidden;
}
.wrapBox .header .headerImage {
  width: 50px;
  margin-right: 20px;
}
.wrapBox .header .headerTitle {
  padding: 0;
  margin: 0;
  color: #fff;
  font-size: 22px;
  line-height: 60px;
  letter-spacing: 1px;
  height: 60px;
  margin-right: 40px;
}
.wrapBox .mainContent {
  flex: 1;
  // overflow: hidden;
}

.errLog-container {
  display: inline-block;
  vertical-align: top;
}

.right-menu {
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 22px;
  line-height: 22px;
  &:focus {
    outline: none;
  }
  .right-menu-item {
    display: inline-block;
    padding: 0 18px;
    font-size: 18px;
    color: #ffffff;
    border-right: 1px solid #dddddd;
    vertical-align: text-bottom;
    .el-dropdown {
      color: #fff;
      cursor: pointer;
    }
    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      // margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
