<template>
  <div class="dialog-form">
     <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
      <el-form-item label="主机名称" prop="hostname">
        <el-input v-model="ruleForm.hostname"></el-input>
      </el-form-item>
      <el-form-item label="操作系统" prop="ostype">
        <el-input v-model="ruleForm.ostype"></el-input>
      </el-form-item>
      <el-form-item label="磁盘大小" prop="totaldisk">
        <el-input v-model="ruleForm.totaldisk"></el-input>
      </el-form-item>
      <el-form-item label="内存大小" prop="totalmemory">
        <el-input v-model="ruleForm.totalmemory"></el-input>
      </el-form-item>
      <el-form-item label="mac地址" prop="mac">
        <el-input v-model="ruleForm.mac"></el-input>
      </el-form-item>
       <el-form-item label="IP地址" prop="ip">
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          {{activeData?'编辑':'立即创建'}}
        </el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'FacilityMonitorForm',
    props: ['dialogVisible', 'activeData'],
  data() {
    return {
        ruleForm: {
          hostname: this.activeData ? this.activeData.hostname : null,
          ostype: this.activeData ? this.activeData.ostype : null,
          totaldisk: this.activeData ? this.activeData.totaldisk : null,
          totalmemory: this.activeData ? this.activeData.totalmemory : null,
          mac: this.activeData ? this.activeData.mac : null,
          ip: this.activeData ? this.activeData.ip : null,
       },
        rules: {
          hostname: [ { required: true, message: '主机名称不能为空', trigger: 'blur' } ],
          ostype: [ { required: true, message: '操作系统不能为空', trigger: 'blur' } ],
          totaldisk: [ { required: true, message: '磁盘大小不能为空', trigger: 'blur' } ],
          totalmemory: [ { required: true, message: '内存大小不能为空', trigger: 'blur' } ],
          mac: [ { required: true, message: 'mac地址不能为空', trigger: 'blur' } ],
          ip: [ { required: true, message: 'IP地址不能为空', trigger: 'blur' } ]
       }
    }
  },
  computed: {},
  methods: {
      submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.activeData) {
          } else {
          }
        } else {
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  watch: {
    activeData () {
      if (this.activeData) {
          this.ruleForm.hostname=   this.activeData.hostname ;
          this.ruleForm.ostype=   this.activeData.ostype ;
          this.ruleForm.totaldisk=   this.activeData.totaldisk ;
          this.ruleForm.totalmemory=   this.activeData.totalmemory ;
          this.ruleForm.mac=   this.activeData.mac ;
          this.ruleForm.ip=   this.activeData.ip ;
      } else {
          this.ruleForm.hostname= null;
          this.ruleForm.ostype= null;
          this.ruleForm.totaldisk= null;
          this.ruleForm.totalmemory= null;
          this.ruleForm.mac= null;
          this.ruleForm.ip= null;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-form {
  width: 100%;
  height: auto;
  padding:0 20px;
}
</style>
