<template>
  <div class="login-container">
    <div class="loginBox">
      <div class="loginDiv">
        <h1 class="loginTitle">
          <img style="width: 60px;" src="@/assets/sys_images/飞机-蓝.png" />
          航空气象资料存储管理应用系统
        </h1>
        <div v-if="showLogin" class="login-form">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                v-model="loginForm.username"
                placeholder="Username"
                name="username"
                type="text"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                ref="password"
                :key="passwordType"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
            <el-checkbox v-model="rememberPwd" style="padding: 0 0 30px 0">
              记住密码
            </el-checkbox>
            <div class="goregist" @click="goRegister">点击注册</div>
            <el-button
              :loading="loading"
              style="width:100%;margin-bottom:30px;background: #0753c5;color: #fff;border: none;"
              @click.native.prevent="handleLogin('loginForm')"
            >
              登录
            </el-button>
          </el-form>
        </div>
        <div v-else>
          <Register
            :show-register="showLogin"
            @hideRegister="getShowLogin"
          ></Register>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Register from './regieter'
// import { goLogin, getRoot } from '@/api/login'
// import Cookies from 'js-cookie'
// import localStorage from '@/utils/localStorage'
// import { mapActions } from 'vuex'
export default {
  name: 'Login',
  components: {
    Register
  },
  data() {
    return {
      showLogin: true,
      rememberPwd: false,
      loginForm: {
        username: '12345',
        password: '12345'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      passwordType: 'password',
      loading: false,
      userRoleId: [],
      allRouter: [],
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const md5 = require('md5')
          const params = {
            username: this.loginForm.username,
            password: md5(this.loginForm.password)
          }
          this.$store
            .dispatch('user/login', params)
            .then(res => {
              this.$Message.success('登录成功')
              // this.$router.push({ path: this.redirect || '/' })
              this.$router.push('/index')
            })
            .catch(err => this.$Message.error(err.response.data.message))
            .finally(res => (this.loading = false))
        } else {
          this.loading = false
          this.$Message.error('请输入完整信息')
          return false
        }
      })
    },
    goRegister() {
      this.showLogin = false
    },
    getShowLogin(val) {
      this.showLogin = true
    }
  },
  mounted() {},
  destroyed() {}
}
</script>
<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('../../assets/sys_images/1.jpg');
  background-size: 100%;
  .loginBox {
    width: 640px;
    height: 460px;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 81px;
    left: 188px;
    .loginDiv {
      width: 640px;
      padding: 20px 20px;
      // background: #fff;
      .loginTitle {
        font-size: 24px;
        font-weight: bold;
        color: #194067;
        letter-spacing: 1px;
        text-align: center;
        margin-top: 30px;
        height: 40px;
        line-height: 40px;
        img {
          vertical-align: middle;
        }
      }
    }
    .login-form {
      position: relative;
      width: 400px;
      padding: 30px 0;
      margin: 0 auto;
      overflow: hidden;
      .el-form-item {
        border: 1px solid transparent;
        background: #87AFDB;
        border-radius: 5px;
        color: #454545;
        margin-bottom: 20px !important;
        .el-form-item__content {
          .el-input.el-input--medium {
            display: inline-block;
            height: 47px;
            width: 85%;
          }
        }
      }
      .goregist {
        float: right;
        color: #0753c5;
        font-size: 14px;
        cursor: pointer;
      }
      .goLogin {
        float: left;
        color: #0753c5;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .login-form /deep/ .el-input__inner {
      border: none;
      background: transparent;
      color: #fff;
    }
    .register-form /deep/ .el-input__inner {
      border: none;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: #889aa4;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: #889aa4;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
