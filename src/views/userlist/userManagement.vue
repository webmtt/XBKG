<template>
  <div class="userManageBox">
    <!-- 筛选查询 -->
    <el-form ref="filter">
      <el-form-item class="UserfilterSearch">
        <i class="el-icon-search"></i>
        <span>筛选查询</span> 
        <div style="float:right">
          <i
            :class="is_show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="is_show = !is_show"
          ></i>
          <span>{{ word }}</span>
          <el-button @click="handleFilter">查询结果</el-button>
        </div>
      </el-form-item>
      <el-form-item class="searchContent">
        <el-form v-show="is_show == true">
          <el-form-item>
            <span>用户名：</span>
            <el-input style="width:170px;" placeholder="用户名" v-model="listQuery.userName" @keyup.enter.native="handleFilter">
            </el-input>
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span style="color:#666666">数据列表</span>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button @click="editData('add')">添加</el-button>
        <el-select
          v-model="listQuery.pageSize"
          class="filter-item"
          placeholder="显示条数"
          @change="handleFilter"
        >
          <el-option
            v-for="item in numberOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <!-- <el-select
          v-model="listQuery.sort"
          class="filter-item"
          placeholder="排序方式"
          @change="handleFilter"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select> -->
      </el-form-item>
    </el-form>
    <!-- 数据显示部分 -->
    <el-table
      :cell-style="columnStyle"
      ref="multipleTable"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- <el-table-column type="selection" align="center" width="60"></el-table-column> -->
      <el-table-column type="index" align="center" label="序号" :index="indexMethod" width="70"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
      <el-table-column label="用户状态" prop="status" :formatter="statusFormat" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }" class="tableButtom">
          <el-button type="warning" size="mini" @click="openModal('details',row)">详情</el-button>
          <el-button type="info" size="mini" @click="setUserModal(row)">角色设置</el-button>
          <el-button type="info" size="mini" @click="editData('edit',row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"    
      style="margin-top: 30px;"
      :total="total"ju
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="paginationChange"
    />
    <!-- 编辑/新增数据采集的模态框 -->
    <user-management-submit class="inPageModal" @handleSucc="getList" :modalData="modalOption"></user-management-submit>

    <!-- 用户角色设置弹框 -->
    <el-dialog title="角色设置" :visible.sync="setUserVisible" width="40%">
      <div class="setUserBox">
        <div class="everyLine">
          <span class="lableName">当前用户角色：</span>
          <el-tag :key="tag" v-for="tag in userRoles" closable :disable-transitions="false" @close="handleCloseTag(tag)">
            {{tag}}
          </el-tag>
          <el-select v-if="inputVisible" v-model="inputValue" filterable 
            placeholder="请选择新增的角色" 
            ref="saveTagInput"
            size="small"
            class="input-new-tag"
            @change="handleInputConfirm">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value+','+item.label">
            </el-option>
          </el-select>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增用户角色</el-button>
          <!-- <el-select v-model="roleValue" placeholder="请选择" @change="changeRole">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
        </div>
        <!-- <div class="everyLine">
          <el-tabs v-model="activeName" @tab-click="handleToggleClick">
            <el-tab-pane label="当前用户权限" name="first" :key="'first'">
              <span class="lableName">权限：</span>
              <span class="lableBtn" @click="addRoot('权限')">分配权限</span>
              <div class="rootBox">
                <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false"
                  :render-content="renderContent">
                </el-tree>
              </div>
            </el-tab-pane>
            <el-tab-pane label="当前用户接口" name="second" :key="'second'">
              <span class="lableName">接口：</span>
              <span class="lableBtn" @click="addRoot('接口')">分配接口</span>
              <div class="rootBox">
                <el-tree :data="interFaceData" node-key="id" default-expand-all :expand-on-click-node="false"
                  :render-content="renderContent">
                </el-tree>
              </div>
            </el-tab-pane>
          </el-tabs>


        </div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureSetUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户资料 -->
    <el-dialog :title='currType=="edit"?"编辑用户资料":"添加用户资料"' :visible.sync="dataEditVisible" width="30%"
      :before-close="handleClose">
      <div class="editDataBox">
        <el-form :model="dataRuleForm" :rules="rules" ref="dataRuleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="dataRuleForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="dataRuleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="dataRuleForm.phone"></el-input>
          </el-form-item>
          <!-- <el-form-item label="邮箱地址" prop="adress">
            <el-input v-model="dataRuleForm.adress"></el-input>
          </el-form-item> -->
          <el-form-item v-if="currType!=='edit'" label="登录密码" prop="password">
            <el-input v-model="dataRuleForm.password"></el-input>
          </el-form-item>
          <el-form-item v-if="currType!=='edit'" label="确认密码" prop="newPassword">
            <el-input v-model="dataRuleForm.newPassword"></el-input>
          </el-form-item>
          <!-- <el-form-item label="备注信息" prop="noteInfo">
            <el-input v-model="dataRuleForm.noteInfo"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="submitForm('dataRuleForm')">确定</el-button>
            <el-button @click="resetForm('dataRuleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 新增权限 -->
    <el-dialog title="分配权限" :visible.sync="addRootVisible" width="30%" class="addRootName">
      <h5>已选择：{{currRootName}}</h5>
      <div style="border: 1px solid lightgray;border-radius: 4px;">
        <el-scrollbar>
          <el-tree :data="treeArchiveData" @node-click="selectTreeArchiveData"></el-tree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRootVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureAddRoot">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增接口 -->
    <el-dialog title="分配接口" :visible.sync="addRootVisible2" width="30%" class="addRootName">
      <h5>已选择：{{currInterFaceName}}</h5>
      <div style="border: 1px solid lightgray;border-radius: 4px;">
        <el-scrollbar>
          <el-tree :data="treeInterFaceData" @node-click="selectTreeArchiveData"></el-tree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRootVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="ensureAddRoot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
import generalOptions from '@/utils/generalOptions'
import userManagementSubmit from './components/addUpdateUserManagement'
import { getUserList, getUserDelete,getRoleList,getRoot,getAllRoot,changeRole ,changeRoot,getUserUpdate,getUserAdd} from
'@/api/userManage'
export default {
  name: 'DataCollectionConfig',
  components: { Pagination, userManagementSubmit },
  data() {
    var validatePass4 = (rule, value, callback) => {
      if (value === ''||value == null) {
        callback(new Error('请输入密码'));
      }else{
        if (this.dataRuleForm.newPassword !== '') {
          this.$refs.dataRuleForm.validateField('newPassword');
        }
        callback();
       }
       };
       var validatePass3 = (rule, value, callback) => {
        if (value === ''||value == null) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.dataRuleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
       }
    };
    var isPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'));
      }
      var matchPhone = /^1[3456789]\d{9}$/
      if (!matchPhone.test(value)) {
        callback(new Error('不是正确电话号码'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        userName: [
          { required: true, message: '请输入成员名称', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请选择用户姓名', trigger: 'blur' }
        ],
        phone:[
          { required: true,  trigger: 'blur',validator: isPhone }
        ],
        // adress:[
        //   { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur',required: true }
        // ],
        password:[
          { required: true,  trigger: 'blur',validator: validatePass4 }
        ],
        newPassword:[
           { required: true, trigger: 'blur',validator: validatePass3 }
        ]
      },
      numberOptions: new generalOptions().numberOfPerPage(),
      sortOptions: new generalOptions().listSorting(),
      checked: false,
      multipleSelection: [],
      modalOption: {
        flag: null,
        show: false,
        data: null
      },
      is_show: true,
      value: '',
      value1: '',
      value2: '',
      list: [],
      total: 0,
      options: [],
      userLimits:[],
      interFaceLimits:[],
      treeData:[],
      interFaceData:[],
      dataRuleForm: {
        userName: '',
        name: '',
        phone:'',
        adress:'',
        password:'',
        newPassword:'',
        // noteInfo:''
       },
      activeName: "first",
      currType:null,//添加or编辑
      userRoles: ['角色一', '角色二', '角色三'],
      userRolesId:[],
      inputVisible: false,
      inputValue: '',
      roleValue:'',
      tableMeta: [
        { key: 'userName', label: '用户名'},
        { key: 'name', label: '用户姓名' },
        { key: 'phone', label: '电话号码'},
        // { key: 'adress', label: '邮箱地址'},
        // { key: 'department', label: '所属部门' },
        { key: 'lastLoginDate', label: '最后登录' },
      ],
      setUserVisible:false,
      dataEditVisible:false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        sort: '+id',
        adress: '',
        createTime: '',
        department: '',
        id:undefined,
        lastLoginDate: '',
        name: '',
        newPassword: '',
        password: '',
        phone: '',
        realName: '',
        status: undefined,
        sys_role_id: undefined,
        updateTime: '',
        userName: ''
      },
      currRoleID: Cookies.get('roleId'),//当前用户角色id
      addRootVisible:false,
      addRootVisible2:false,//接口
      treeArchiveData:[],//权限数据
      treeInterFaceData:[],//接口数据
      titleData:[],
      FaceTitleData:[],
      currRootName:null,
      currInterFaceName:null,
      currRoleSelectId:[],
      currDate:null,
      timer:null,
      TreeRootId:[],
      idArr:[],
      // addRoleID:[],
      addFlag:true,//默认新增
      allDataID:[],//权限跟接口的id
      CurrName:null
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
    }
  },
  created() {
    this.getList()
    this.getAllRoleList()
    this.getDataRootlogue()
  },
  methods: {
    // 修改列表特殊几行颜色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      // if (
      //   columnIndex == 4 ||
      //   columnIndex == 6 ||
      //   columnIndex == 7 ||
      //   columnIndex == 8
      // ) {
      //   return 'color:#64bc9c;'
      // }
    },
    // 数据详情
    handleDetails(row) {
      getCollectionDetails().then(response => {})
    },
    /**
     * 打开编辑/新增模态框
     * @method opendModal
     * @returns {undefined}
     */
    openModal(flag, rowParam) {
      console.log("openModal -> rowParam", rowParam)
      // console.log("openModal -> rowParam", rowParam)
      this.modalOption = { show: true, data: rowParam, flag: flag }
    },
    paginationChange() {
      this.checked = false
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    statusFormat(row,column){
      if (row.status === 0) {
        return '已删除'
      } else {
        return '正常'
      }
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除吗？</p>',
        loading: true,
        onOk: () => {
          getUserDelete({ userName: row.userName })
            .then(res => {
              this.$Modal.remove()
              this.$Message.success('删除成功')
              this.getList()
            })
            .catch(err => {
              this.$Modal.remove()
            })
        },
        onCancel: () => {}
      })
    },
    handleToggleClick(val){
      this.activeName = val.name
      this.getRootList()
      this.getDataRootlogue()
    },
    setUserModal(row){//用户角色设置
      console.log("setUserModal -> row", row)
      this.CurrName = row.userName
      this.userRoles=[]
      this.userRolesId=[]
      this.setUserVisible=true
      if( row.realNames.length && row.sys_role_ids.length){
        row.realNames.map(v=>{
          return this.userRoles.push(v)
        })
        row.sys_role_ids.map(v=>{
          return this.userRolesId.push(v)
        })
        this.getRootList()
      }else{
        this.$Message.warning('当前用户暂未分配角色')
      }
    },
    editData(item,row){
      this.dataEditVisible=true
      this.currType=item
      if(item=='edit'){
         this.dataRuleForm = row
      }else{
        this.dataRuleForm={}
      }
    },
    ensureSetUser(){
      let _this = this
      let roleID = {
        sys_role_ids:this.userRolesId,
        userName:this.CurrName
      }
      getUserUpdate(roleID).then(res => {
        if(res.code=='000000'){
          this.$Message.success(res.message)
          this.setUserVisible=false
          this.getList()
        }
      })
    },

    // changeRole(val){
    //   this.roleValue =val
    //   let roleObj ={}
    //   roleObj=this.options.find((v,index)=>{
    //     return v.value === val
    //   }) 
    //   let currRole={
    //     createTime:this.currDate,
    //     description:roleObj.description,
    //     id:roleObj.value,
    //     name:roleObj.label
    //   }
    //   changeRole(currRole).then(res => {
    //     if(res.code==0){
    //       this.$Message.success(res.msg)
    //     }
    //   })
    //   this.getRootList(val)
    // },

    getTime(){
      var date1=new Date();
      var year=date1.getFullYear();
      var month=(date1.getMonth()+1)<10?'0'+(date1.getMonth()+1):date1.getMonth()+1;
      var day=date1.getDate()<10?'0'+date1.getDate():date1.getDate();
      var hours=date1.getHours();
      var minutes=date1.getMinutes();
      var seconds=date1.getSeconds();
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
    },
    handleCloseTag(tag) {
      // debugger
      this.options.map(v=>{//根据tag找tag对应的id
        if(tag.includes(v.label)){
          return this.userRolesId.splice(this.userRolesId.indexOf(v.value), 1);
        }
      })
      this.userRoles.splice(this.userRoles.indexOf(tag), 1);
      this.getRootList()
    },
    
    handleInputConfirm(val) {
      console.log("handleInputConfirm -> val", val)
      let inputValue = val.split(",")[1];
      let inputId = Number(val.split(',')[0])
      if(inputValue && this.userRoles.indexOf(inputValue)==-1) {
        this.userRoles.push(inputValue);
        this.userRolesId.push(inputId)
      }else if(this.userRoles.indexOf(inputValue)!=-1){
        this.$Message.warning('该角色已添加')
      }else{
      }
      this.inputVisible = false;
      this.inputValue = '';
      this.getRootList()
    },
    showInput() {
      this.inputVisible = true;
    },
    remove(node, data) {
      let removeID=[]
      removeID.push(data)
      if(removeID.length){
        // if(this.activeName=='first'){
          let aaa = this.getDelRootIds(removeID)
          let bbb = [...new Set(this.allDataID.concat(this.TreeRootId))]
          aaa.forEach(v=>{
            bbb.splice(bbb.indexOf(v),1)
          })
          // this.addRoleID = bbb
          this.currRoleSelectId = bbb
        // }else{
        //   let aaa = this.getDelRootIds(removeID)
        //   let bbb = [...new Set(this.getRootIds(this.interFaceData).concat(this.TreeRootId))]
        //   aaa.forEach(v=>{
        //     bbb.splice(bbb.indexOf(v),1)
        //   })
        //   // this.addRoleID = bbb
        //   this.currRoleSelectId = bbb
        // }
        this.addFlag = false
        this.ensureAddRoot()
      }


    },
    getDelRootIds(data) {
      let _this = this
      let delArrID=[]
      function loop(json) {
        for (var obj of json) {
          if (obj.children.length >= 1) {
            loop(obj.children)
          } else {
            delArrID.push(obj.id)
            delArrID = [...new Set(delArrID)]
          }
        }
      }
      loop(data)
      return delArrID
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>删除</el-button>
          </span>
        </span>);
    },
  submitForm(formName) {
    this.$refs[formName].validate((valid) => {
       let obj = {}
      // if(this.dataRuleForm.password) {
        const md5 = require('md5')
        obj = {...JSON.parse(JSON.stringify(this.dataRuleForm))}
        console.log(obj)
        // obj.newPassword = md5(obj.newPassword)
        // obj.password = md5(obj.password)
      // }
      if (valid) {
        if(this.currType=='edit'){
          getUserUpdate(obj).then(res => {
            if(res.code==0){
              this.dataEditVisible=false
              this.$Message.success('编辑成功')
              this.getList()
            }
          })
        }else{
          getUserAdd(obj).then(res => {
            this.dataEditVisible=false
            if(res.code==0){
              this.$Message.success('添加成功')
              this.getList()
            }else{
              this.$Message.success('添加失败')
            }
          })
        }
      }else{
        // this.currType=='edit'? this.$Message.error('编辑失败'):this.$Message.success('添加失败')
        return false;
      }
    })
  },
  resetForm(formName) {
    this.$refs[formName].resetFields();
    this.dataEditVisible=false
  },
  handleClose(){
    this.resetForm('dataRuleForm')
  },
  indexMethod(index) {
    return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + 1 + index
  },
  getList() {
    this.listLoading = true
    getUserList(this.listQuery).then(response => {
      this.list = response.data.list
      this.total = response.data.total
    })
  },
  getAllRoleList() {
    let _this=this
    this.options=[]
    getRoleList({
      pageNum:1,
      pageSize:1000
    }).then(res => {
      if(res.code=="000000"){
        res.data.list.map((v,index)=>{
          _this.options.push({
            label:v.name,
            value:v.id,
            description:v.description
          })

        })
      }
    })
  },
  getRootList(){
    let _this = this
    this.userLimits = []
    this.interFaceLimits=[]
    getRoot(_this.userRolesId.toString()).then(res => {
      if(res.code=='000000'){
        if(this.activeName=='first'){
          if(res.data !== null){
             res.data.menus.map(v=>{
            _this.userLimits.push(v)
          })
          }
          this.treeData = _this.loopTitle(_this.userLimits)
          this.getRootIds(this.treeData)
          this.allDataID = this.getRootIds(this.treeData)
        }else{
          res.data.interfaces.map(v=>{
            _this.interFaceLimits.push(v)
          })
          this.interFaceData = _this.loopTitle(_this.interFaceLimits)
          this.getRootIds(this.interFaceData)
          this.allDataID = this.allDataID.concat(this.getRootIds(this.interFaceData))
        }
      }
      
    })
  },
  getRootIds(data) {
    let _this = this
    this.idArr=[]
      function loop(json) {
        for (var obj of json) {
          if (obj.children.length >= 1) {
            loop(obj.children)
          }
          _this.idArr.push(obj.id)
          _this.idArr=[...new Set(_this.idArr)]
          
        }
      }
      loop(data)
      return this.idArr
  },
  addRoot(flag){//新增权限
    if(flag=='权限'){
      this.addRootVisible=true
      this.addRootVisible2=false
    }else{
      this.addRootVisible2=true
      this.addRootVisible=false
    }
  },
  selectTreeArchiveData(item) {
    this.TreeRootId=[]
    this.TreeRootId.push(item.id)
    // this.addRoleID = this.getRootIds(this.treeData).concat(this.TreeRootId)
    this.addFlag =  true
    if(this.activeName=='first'){
      this.currRootName = this.getParentIds(this.titleData, item.id).ids.join(' / ')
      this.currRoleSelectId = this.getParentIds(this.titleData, item.id).nameId.concat(this.allDataID )
    }else{
      this.currInterFaceName = this.getParentIds(this.FaceTitleData, item.id).ids.join(' / ')
      // this.currRoleSelectId = this.getParentIds(this.FaceTitleData, item.id).nameId.concat(this.idArr)
      this.currRoleSelectId = this.getParentIds(this.FaceTitleData, item.id).nameId.concat(this.allDataID)

    }


  },

  getDataRootlogue() {
    getAllRoot().then(res=>{
      if(res.code=='000000'){
        if(this.activeName=='first'){
          this.treeArchiveData = res.data.menus
          this.titleData = this.loopTitle(this.treeArchiveData)
        }else{
          this.treeInterFaceData = res.data.interfaces
          this.FaceTitleData = this.loopTitle(this.treeInterFaceData)
        }
      }

    })
  },
  loopTitle(arrData, id = '') {
  //递归生成title
    let _this = this
    return arrData.map((v, index) => {
    v.label = v.name
    v.id = v.id ? v.id : id + '_' + index
    v.children=v.child
    v.children && _this.loopTitle(v.children, v.id)
    return v
    })
  },
  getParentIds(data, id) {
    var ids = []
    var nameId = []
    function loop(json) {
      for (var obj of json) {
        if (JSON.stringify(obj).match(`"id":${id},`)) {
          ids.push(obj.name)
          nameId.push(obj.id)
          if (obj.children.length >= 1) {
            loop(obj.children)
          }
        }
      }
    }
    loop(data)
    return {ids:ids,nameId:nameId}
    
  },
  ensureAddRoot(){//增加删除权限
    changeRoot({
      permissionIds: this.currRoleSelectId,
      roleId: this.userRolesId.toString()
    }).then(res => {
      if(res.code=='000000'){
        if(this.activeName=='first'){
          if(this.addFlag&&this.currRootName!==''){
            this.$Message.success('权限分配成功')
            this.addRootVisible=false
          }else{
            this.$Message.success('权限删除成功')
          }
          this.currRootName = ''
        }else{
          if(this.addFlag&&this.currInterFaceName!==''){
            this.$Message.success('接口分配成功')
            this.addRootVisible2=false
          }else{
            this.$Message.success('接口删除成功')
          }
          this.currInterFaceName=''
        }
        this.TreeRootId=[]
        this.getRootList()
     
      }
    })
  }
},
  mounted(){
    let _this = this;
    this.timer = setInterval(() => {
      _this.currDate =this.getTime(); // 修改数据date
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
    clearInterval(this.timer); // 在Vue实例销毁前，清除定时器
    }
  }
}
</script>

<style lang="scss">
  .userManageBox{
    padding: 20px;
    .UserfilterSearch {
      background: #f3f3f3;
      padding: 7px;
      border: 1px solid #e4e4e4;
    }
    .UserfilterSearch div {
    }
    .UserfilterSearch span {
      margin-right: 20px;
    }
    .searchContent {
      border: 1px solid #e4e4e4;
    }
    .searchContent form.el-form {
      display: flex;
      margin: 10px 10px 10px 30px;
    }
    .searchContent .el-form-item.el-form-item--medium:nth-child(2) {
      margin-left: 200px;
    }
    .searchContent div {
      display: inline-block;
    }
    .handleLink {
      padding: 0 5px;
    }
    .tableButtom .el-button--primary,
    .el-button--primary:hover,
    .el-button--primary:focus {
      color: #64bc9c;
      background-color: transparent;
      border-color: transparent;
    }
    .tableButtom .el-button--primary,
    .el-button--primary {
      color: #64bc9c;
      background-color: transparent;
      border-color: transparent;
    }
    .demo-form-inline {
      padding-left: 15px;
      background: #f3f3f3;
      padding: 7px;
      border: 1px solid #e4e4e4;
      border-bottom: none !important;
    }
    .filter-item {
      width: 150px;
    }
    .setUserBox{
      .everyLine{
        margin-bottom: 10px;
        .el-tabs{
          .el-tabs__header{
            margin-bottom: 0;
          }
        }
        span.lableName{
          float: left;
          width:15%;
          line-height:48px;
        }
        span.lableBtn{
         float: right;
         line-height: 32px;
         background: #64bc9c;
         margin:8px 0;
         padding: 0 12px;
         color: #fff;
         cursor:pointer;
        }

        .el-tag--medium{
          margin:10px 10px 0 0;
        }
        .el-button{
          margin: 10px 0;
        }
        .el-select{
          margin:10px 0px;
        }
        .el-table{
          .el-table__header-wrapper{
            .el-table__header{
              .has-gutter{
                display: none;

              }
            }
          }
          
        }
        .rootBox{
          float: left;
          width: 100%;
          border: 1px solid rgb(17, 173, 173);
          margin-bottom: 20px;
          .el-tree{
            padding: 8px;
            .el-tree-node__content{
              height:26px;
              line-height:26px;
              .el-tree-node__content>.el-tree-node__expand-icon{
                float: left;
              }
              .custom-tree-node{
                float: left;
                width: 100%;
                span:nth-child(2){
                  float:right;
                  .el-button{
                    margin: 0 16px 0 0!important;
                    color: red;
                  }
                }
              }
            }

          }
        }
      }
      
    
    }
    .editDataBox{
      .el-form{
        color: #606266;
        .el-form-item{
          margin-bottom:15px!important;
          .el-form-item__label{
            text-align: center;
          }
          .el-form-item__content{
            .el-button{
              float: right;
              background:#fff;
              color:#515a6e;
              border:none;
            }
            .el-button.el-button--primary{
              background:#1890ff;
              color:#fff;
              margin-left:8px;
            }
          }
        }
      }
    }
    .addRootName{
      .el-dialog__body{
        padding: 15px 20px;
        h5{
          margin-bottom: 10px;
        }
      }
    }
    
  }

</style>
