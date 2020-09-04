<template>
  <div class="register-form">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" autocomplete="on"
      label-position="left">
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="registerForm.username" placeholder="请输入用户名" type="text" name="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="registerForm.password" type="text" placeholder="请输入密码" name="password" />
      </el-form-item>
      <el-form-item prop="configerPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="registerForm.configerPassword" type="text" placeholder="请确认密码" name="configerPassword" />
      </el-form-item>
      <div class="goLogin" @click="goLogin">返回登录</div>
      <el-button :loading="loading" style="width:100%;margin-bottom:30px;background: #0753c5;color: #fff"
        @click.native.prevent="handleRegister('registerForm')">
        注册
      </el-button>
    </el-form>
  </div>

</template>
<script>
export default {
  name: 'register',
  props:{
    showRegister:Boolean
  },
  data() {
    var validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'));
      }else{
        if (this.registerForm.configerPassword !== '') {
         this.$refs.registerForm.validateField('configerPassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
      }
    };
    return {
      registerForm: {
        username: '',
        password: '',
        configerPassword:''
      },
      registerRules: {
        username: [
          {required: true, trigger: 'blur', message: '请输入用户名'}
        ],
        password: [
          {trigger: 'blur', validator: validatePass}
        ],
        configerPassword:[
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      loading: false,
    }
  },
  methods:{
    showPwd() {
      if (this.passwordType==='password') {
        this.passwordType=''
      }else {
        this.passwordType='password'
      }
      this.$nextTick(()=> {
        this.$refs.password.focus()
      })
    },
    handleRegister(formName){
      this.$refs[formName].validate((valid)=> {
        if(valid) {
          this.$Message.success('注册成功')
          this.$emit('hideRegister',!this.showRegister)
        }else{
          this.$Message.error('请输入完整注册信息')
          return false;
        }
      })
    },
    goLogin(){
      this.$emit('hideRegister',!this.showRegister)
    }
  }
}
</script>
<style lang="scss" scoped>
  .register-form{
    position: relative;
    width: 400px;
    padding: 30px 0;
    margin: 0 auto;
    overflow: hidden;
    .el-form-item {
     border: 1px solid #ccc;
     background: transparent;
     border-radius: 5px;
     color: #454545;
     margin-bottom: 20px !important;
      .el-form-item__content{
        .el-input.el-input--medium {
          display: inline-block;
          height: 47px;
          width: 85%;
        }
      }
    }
    .goLogin{
      float: left;
      color: #0753c5;
      font-size: 14px;
      cursor: pointer;
      margin-bottom: 20px !important;
    }
     .register-form /deep/ .el-input__inner{
     border: none;
     }

     .svg-container {
     padding: 6px 5px 6px 15px;
     color: #889aa4;
     vertical-align: middle;
     width: 30px;
     display: inline-block;
     }
  }
</style>
