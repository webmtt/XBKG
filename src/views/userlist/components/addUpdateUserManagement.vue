<template>
  <el-dialog
    width="40%"
    :visible.sync="show"
    v-model="show"
    :title="editMode ==='insert' ? '添加用户资料' : editMode ==='update' ? '编辑用户资料' : '用户资料详情'"
  >
    <div class="userModalDetails" style="height:260px;">
      <el-scrollbar style="height: 100%;">
        <el-form ref="dataCollectForm" :model="formModel" inline v-if="show" label-width="120px">
          <el-form-item label="用户名：" prop="userName">
            <el-input v-model="formModel.userName" placeholder="成员名称"></el-input>
          </el-form-item>
          <el-form-item label="角色：" prop="realNames">

            <el-select v-model="formModel.realNames" :label-in-value="true" multiple :disabled='editMode==="update" ? false : true'>
              <el-option v-for="(item, ix) in realNameOptions" :value="item" :key="ix">{{item}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户姓名：" prop="name">
            <el-input v-model="formModel.name" placeholder="用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="电话号码：" prop="phone">
            <el-input v-model="formModel.phone" placeholder="电话号码"></el-input>
          </el-form-item>
          <!-- <el-form-item label="邮箱地址：" prop="adress">
            <el-input v-model="formModel.adress" placeholder="邮箱地址"></el-input>
          </el-form-item> -->
          <el-form-item label="登录密码：" prop="password" v-if="editMode ==='insert'||editMode ==='update'">
            <el-input v-model="formModel.password" placeholder="登录密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="newPassword" v-if="editMode ==='insert'||editMode ==='update'">
            <el-input v-model="formModel.newPassword" placeholder="确认密码"></el-input>
          </el-form-item>
        </el-form>
        <!-- <div class="userDetails" v-if="modalData.flag == 'details'">
          <h5 style="margin-top:30px;">服务接口调用记录</h5>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="linkNum" label="接口编号">
            </el-table-column>
            <el-table-column prop="userTime" label="调用时间">
            </el-table-column>
            <el-table-column prop="account" label="用户账号">
            </el-table-column>
            <el-table-column prop="downNum" label="下载量">
            </el-table-column>
          </el-table>
        </div> -->
      </el-scrollbar>
    </div>
    <template #footer v-if="editMode ==='insert'||editMode ==='update'">
      <el-button :disabled="loading" type="primary" @click="closeModal">取消</el-button>
      <el-button
        v-show="footerShow == true"
        :loading="loading"
        type="primary"
        @click="updateOrAddDataCollect('dataCollectForm')"
      >保存</el-button>
    </template>


  </el-dialog>
</template>

<script>
import { getUserAdd, getUserUpdate } from '@/api/userManage'
import Options from '../options'
export default {
  data() {
    return {
      data: [
        { key: 0, label: '风速' },
        { key: 1, label: '湿度' },
        { key: 2, label: '温度' },
        { key: 3, label: '气压' },
        { key: 4, label: '远道视程' }
      ],
      data1: [
        { 风速: { min: 0, max: 0 } },
        { 湿度: { min: 0, max: 0 } },
        { 温度: { min: 0, max: 0 } },
        { 气压: { min: 0, max: 0 } },
        { 跑道视程: { min: 0, max: 0 } }
      ],
      transferList: [],
      timeScope: [],
      hrImg: require('@/assets/sys_images/collectionConfig/hr.png'),
      dataCollectionModel: {
        options: Options.dataClassify.map(item => item),
        checkItem: null,
        value: ''
      },
      footerShow: true,
      loading: false,
      editMode: 'insert',
      dataClassifyOptions: Options.dataClassify,
      dataTypeOptions: Options.dataType,
      points: [],
      realNameOptions: ['管理员', '用户', '学生',],
      formModel: this.resetFormModel(),
      show: this.modalData.show,
      tableData: [{
        linkNum: '15465645',
        userTime: '2016-05-02',
        account: '1515',
        downNum:20
        }, {
         linkNum: '15465645',
         userTime: '2016-05-02',
         account: '1515',
         downNum:20
        }, {
        linkNum: '15465645',
        userTime: '2016-05-02',
        account: '1515',
        downNum:20
        }, {
         linkNum: '15465645',
         userTime: '2016-05-02',
         account: '1515',
         downNum:20
      }]
    }
  },
  computed: {},
  watch: {
    modalData(newValue) {
      console.log("modalData -> newValue", newValue)
      this.editMode = this.modalData.flag
      this.show = newValue.show

      const plainModel = this.resetFormModel()
      if (this.modalData.data) {
        Object.keys(plainModel).forEach(key => {
          plainModel[key] = this.modalData.data[key]
        })
      }
      if (this.modalData.flag == 'details') {
        this.footerShow = false
      } else {
        this.footerShow = true
      }

      this.formModel = plainModel
      console.log("modalData -> this.formModel", this.formModel)
    }
  },
  props: ['modalData'],
  methods: {
    handleChange(value, direction, movedKeys) {
      this.transferList.filter(item => {
        if (Object.keys(this.data1[item])[0] === '风速') {
          this.formModel.wsinsmin = this.data1[item].min
          this.formModel.wsinsmax = this.data1[item].max
        } else if (Object.keys(this.data1[item])[0] === '温度') {
          this.formModel.tainsmin = this.data1[item].min
          this.formModel.tainsmax = this.data1[item].max
        } else if (Object.keys(this.data1[item])[0] === '湿度') {
          this.formModel.tdinsmin = this.data1[item].min
          this.formModel.tdinsmax = this.data1[item].max
        } else if (Object.keys(this.data1[item])[0] === '气压') {
          this.formModel.painsmin = this.data1[item].min
          this.formModel.painsmax = this.data1[item].max
        } else if (Object.keys(this.data1[item])[0] === '跑道视程') {
          this.formModel.rvrmin = this.data1[item].min
          this.formModel.rvrmax = this.data1[item].max
        }
      })
    },
    dataClassifyChange() {
      this.formModel.datatype = ''
      this.dataTypeOptions = Options.dataType
      const t = this.dataClassifyOptions.filter(
        item => item.typename === this.formModel.dataclassification
      )
      this.dataTypeOptions = this.dataTypeOptions.filter(
        item => item.type === t[0].typecode
      )
    },
    dataTypeChange(val) {
      const f = this.dataTypeOptions.filter(item => val === item.datatypename)
      this.formModel.datasource = f[0].datasrouce
    },
    resetFormModel() {
      return {
        adress: '',
        createTime: '',
        department: '',
        id: 0,
        lastLoginDate: '',
        name: '',
        newPassword: '',
        password: '',
        phone: '',
        realNames: [],
        status: 0,
        sys_role_ids: [],
        updateTime: '',
        userName: ''
      }
    },
    equimentChanged(val) {
      this.formModel.equipmentModel = val
        // .map(item => item.label.split(' ')[0])
        .join(',')
    },
    closeModal() {
      this.$refs['dataCollectForm'].resetFields()
      this.show = false
    },
    updateOrAddDataCollect(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const titlePreText = this.modalData.data ? '更新' : '新增'
          if (!this.modalData.data) {
            var { id, ...params } = this.formModel
          } else {
            var { ...params } = this.formModel
          }
          if (this.modalData.flag == 'insert') {
            getUserAdd(params)
              .then(res => {
                this.$Message.info(`${titlePreText}成功`)
                this.$emit('handleSucc')
              })
              .finally(res => {
                this.show = false
                this.loading = false
              })
          } else {
            getUserUpdate(params)
              .then(res => {
                this.$Message.info(`${titlePreText}成功`)
                this.$emit('handleSucc')
              })
              .finally(res => {
                this.show = false
                this.loading = false
              })
          }
        } else {
        }
      })
    }
  },
  mounted() {}
}
</script>


<style lang="scss">
.userModalDetails {
  font-size: 18px;
  line-height: 40px;
  .el-scrollbar{
    .el-scrollbar__wrap{
     overflow-x:hidden;
     .el-scrollbar__view{
      .el-form{
        .el-form-item{
          float: left;
          margin: 5px 0px;
          width:98%;
          .el-form-item__content{
            width: calc(100% - 120px);
            .el-select.el-select--medium {
              width:100%;
            }
          }
        }
      }
     }
     
  }
    .el-select-dropdown__wrap{
      margin-bottom: 0!important;
    }
  } 
  .userDetails{
    float: left;
    margin:0 30px;
    width: calc(100% - 60px);
  }
  
}
</style>
