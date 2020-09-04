<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form :inline="true" class="formInline">
      <el-form-item>
        <span>添加成员</span>
      </el-form-item>
    </el-form>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="ruleForm"
    >
      <el-form-item label="成员名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="fullName">
        <el-input v-model="ruleForm.fullName"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="department">
        <el-select v-model="ruleForm.department" placeholder="全部">
          <el-option label="学生" value="xuesheng"></el-option>
          <el-option label="老师" value="laoshi"></el-option>
          <el-option label="校长" value="xiaozhang"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          v-model="ruleForm.pass"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注信息" prop="desc">
        <el-input
          v-model="ruleForm.desc"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {} from '@/api/application'

export default {
  name: 'AddUser',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        name: '',
        fullName: '',
        email: '',
        department: '',
        desc: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入成员名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入正确邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        department: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请填写备注信息', trigger: 'blur' }],
        pass: [{ required: true, validator: validatePass, trigger: 'blur' }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.formInline {
  padding-left: 15px;
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
}
.formInline .el-form-item.el-form-item--medium {
  padding-left: 10px;
  color: #666666;
}
.ruleForm .el-form-item.is-required.el-form-item--medium,
.ruleForm .el-form-item.el-form-item--medium {
  padding: 10px;
}
.ruleForm .el-textarea.el-input--medium {
  width: 400px;
}
.ruleForm .el-input.el-input--medium {
  width: 200px;
}
.ruleForm {
  border: 1px solid #e4e4e4;
  border-top: none;
  padding: 30px;
}
</style>
