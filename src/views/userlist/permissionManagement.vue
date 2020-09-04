<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <el-form ref="filter">
      <el-form-item class="searchContent">
        <el-form v-show="is_show == true">
        </el-form>
        <el-form>
          <el-button size="mini" type="warning" @click="addRoleBtn">
            添加角色
          </el-button>
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
      </el-form-item>
    </el-form>
    <!-- 数据显示部分 -->
    <el-table
      ref="multipleTable"
      :cell-style="columnStyle"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column> -->
      <el-table-column
        type="index"
        align="center"
        label="序号"
        :index="indexMethod"
        width="70"
      ></el-table-column>
      <el-table-column prop="name" label="角色" align="center">
      </el-table-column>
      <el-table-column prop="description" label="权限" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.row.id)"
          >
            查看权限
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      style="margin-top: 30px;"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="paginationChange"
    />
    <!-- 编辑/新增数据采集的模态框 -->
    <data-collection-submit
      class="inPageModal"
      :modal-data="modalOption"
      @handleSucc="getList"
    ></data-collection-submit>
    <!-- 用户角色设置弹框 -->
    <el-dialog title="权限查看设置" :visible.sync="setUserVisible" width="40%">
      <div class="setUserBox">
        <div class="everyLine">
          <el-tabs v-model="activeName" @tab-click="handleToggleClick">
            <el-tab-pane label="当前用户权限" name="first" :key="'first'">
              <span class="lableName">权限：</span>
              <span class="lableBtn" @click="addRoot('权限')">分配权限</span>
              <div class="rootBox">
                <el-tree
                  :data="treeData"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                  :render-content="renderContent"
                >
                </el-tree>
              </div>
            </el-tab-pane>
            <el-tab-pane label="当前用户接口" name="second" :key="'second'">
              <span class="lableName">接口：</span>
              <span class="lableBtn" @click="addRoot('接口')">分配接口</span>
              <div class="rootBox">
                <el-tree
                  :data="interFaceData"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                  :render-content="renderContent"
                >
                </el-tree>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureSetUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="addRootVisible"
      width="30%"
      class="addRootName"
    >
      <h5>已选择：{{ currRootName }}</h5>
      <div style="border: 1px solid lightgray;border-radius: 4px;">
        <el-scrollbar>
          <el-tree
            :data="treeArchiveData"
            @node-click="selectTreeArchiveData"
          ></el-tree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRootVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureAddRoot">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增接口 -->
    <el-dialog
      title="分配接口"
      :visible.sync="addRootVisible2"
      width="30%"
      class="addRootName"
    >
      <h5>已选择：{{ currInterFaceName }}</h5>
      <div style="border: 1px solid lightgray;border-radius: 4px;">
        <el-scrollbar>
          <el-tree
            :data="treeInterFaceData"
            @node-click="selectTreeArchiveData"
          ></el-tree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRootVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="ensureAddRoot">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleShow" width="30%">
      <el-form
        ref="addRoleForm"
        :model="addRoleForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="description"
          style="margin-top:30px;"
        >
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
        <el-form-item style="margin-top:30px;">
          <el-button type="success" @click="ensuerAdd('addRoleForm')">
            确定
          </el-button>
          <el-button @click="ensureCancel('addRoleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import GeneralOptions from '@/utils/generalOptions'
import dataCollectionSubmit from '../storageConfig/components/addUpdateLifecycleManagement'
import { getCollectionDetails } from '@/api/collection'
import {
  getRoleList,
  getRoot,
  changeRoot,
  getAllRoot,
  deleteRole,
  getAddRole
} from '@/api/userManage'
export default {
  name: 'DataCollectionConfig',
  components: { Pagination, dataCollectionSubmit },
  data() {
    return {
      rules: {
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请选择角色名称', trigger: 'blur' }]
      },
      addRoleForm: {
        name: '',
        description: ''
      },
      addRoleShow: false,
      setUserVisible: false,
      userRolesId: [],
      activeName: 'first',
      treeData: [],
      interFaceData: [],
      userLimits: [],
      interFaceLimits: [],
      allDataID: [], // 权限跟接口的id
      currRootName: null,

      addRootVisible: false,
      addRootVisible2: false,
      currInterFaceName: null,
      treeArchiveData: [], // 权限数据
      treeInterFaceData: [], // 接口数据

      startBtn: true,
      numberOptions: new GeneralOptions().numberOfPerPage(),
      sortOptions: new GeneralOptions().listSorting(),
      userName: '',
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
      listQuery: {
        page: 1,
        limit: 10,
        pageSize: 10,
        sort: '+id',
        area: undefined,
        startTime: undefined,
        endTime: undefined,
        attr: undefined,
        warning: undefined,
        // dataType: 'msg'
      }
    }
  },
  computed: {
    word() {
      return !this.is_show ? '展开筛选' : '收起筛选'
    }
  },
  created() {
    // this.getList()
    this.getDataRootlogue()
  },
  methods: {
    addRoleBtn() {
      this.addRoleShow = true
    },
    ensuerAdd(formName) {
      let _this = this
      this.$refs[formName].validate(valid => {
        if(valid){
          getAddRole({
          name: _this.addRoleForm.name,
          description: _this.addRoleForm.description
        }).then(res => {
          if (res.code == '000000') {
            this.$Message.success(res.message)
            this.getList()
          }
          this.addRoleShow = false
        })
        }
      })
    },
    ensureCancel(formName) {
      this.$refs[formName].resetFields()
      this.addRoleShow = false
    },
    // 修改列表特殊几行颜色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 4 ||
        columnIndex === 6 ||
        columnIndex === 7 ||
        columnIndex === 8
      ) {
        return 'color:#64bc9c;'
      }
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
      this.modalOption = { show: true, data: rowParam, flag: flag }
    },
    paginationChange() {
      this.checked = false
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(row) {
      const obj = { id: parseInt(row.id) }
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除吗？</p>',
        loading: true,
        onOk: () => {
          deleteRole(row.id)
            .then(res => {
              if (res.code == '000000') {
                this.$Modal.remove()
                this.$Message.success('删除成功')
                this.getList()
              } else {
                this.$Message.warning(res.data.msg)
              }
            })
            .catch(() => {
              this.$Modal.remove()
            })
        },
        onCancel: () => {}
      })
    },
    handleEdit(row) {
      this.currId = row
      this.setUserVisible = true
      const _this = this
      this.userLimits = []
      this.interFaceLimits = []
      getRoot(_this.currId.toString()).then(res => {
        if (res.code === '000000') {
          if (this.activeName === 'first') {
            res.data.menus.map(v => {
              _this.userLimits.push(v)
            })
            this.treeData = _this.loopTitle(_this.userLimits)
            this.getRootIds(this.treeData)
            this.allDataID = this.getRootIds(this.treeData)
          } else {
            res.data.interfaces.map(v => {
              _this.interFaceLimits.push(v)
            })
            this.interFaceData = _this.loopTitle(_this.interFaceLimits)
            this.getRootIds(this.interFaceData)
            this.allDataID = this.allDataID.concat(
              this.getRootIds(this.interFaceData)
            )
          }
        }
      })
    },
    getRootIds(data) {
      let _this = this
      this.idArr = []
      function loop(json) {
        for (var obj of json) {
          if (obj.children.length >= 1) {
            loop(obj.children)
          }
          _this.idArr.push(obj.id)
          _this.idArr = [...new Set(_this.idArr)]
        }
      }
      loop(data)
      return this.idArr
    },
    loopTitle(arrData, id = '') {
      //递归生成title
      let _this = this
      return arrData.map((v, index) => {
        v.label = v.name
        v.id = v.id ? v.id : id + '_' + index
        v.children = v.child
        v.children && _this.loopTitle(v.children, v.id)
        return v
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    getList() {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleToggleClick(val) {
      this.activeName = val.name
      this.handleEdit(this.currId)
      this.getDataRootlogue()
    },
    getDataRootlogue() {
      getAllRoot().then(res => {
        if (res.code == '000000') {
          if (this.activeName == 'first') {
            this.treeArchiveData = res.data.menus
            this.titleData = this.loopTitle(this.treeArchiveData)
          } else {
            this.treeInterFaceData = res.data.interfaces
            this.FaceTitleData = this.loopTitle(this.treeInterFaceData)
          }
        }
      })
    },
    addRoot(flag) {
      // 新增权限
      if (flag === '权限') {
        this.addRootVisible = true
        this.addRootVisible2 = false
      } else {
        this.addRootVisible2 = true
        this.addRootVisible = false
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      )
    },
    ensureSetUser() {
      this.setUserVisible = false
    },
    selectTreeArchiveData(item) {
      this.TreeRootId = []
      this.TreeRootId.push(item.id)
      // this.addRoleID = this.getRootIds(this.treeData).concat(this.TreeRootId)
      this.addFlag = true
      if (this.activeName === 'first') {
        this.currRootName = this.getParentIds(this.titleData, item.id).ids.join(
          ' / '
        )
        this.currRoleSelectId = this.getParentIds(
          this.titleData,
          item.id
        ).nameId.concat(this.allDataID)
      } else {
        this.currInterFaceName = this.getParentIds(
          this.FaceTitleData,
          item.id
        ).ids.join(' / ')
        // this.currRoleSelectId = this.getParentIds(this.FaceTitleData, item.id).nameId.concat(this.idArr)
        this.currRoleSelectId = this.getParentIds(
          this.FaceTitleData,
          item.id
        ).nameId.concat(this.allDataID)
      }
      this.currRoleSelectId = [...new Set(this.currRoleSelectId)]
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
      return { ids: ids, nameId: nameId }
    },
    ensureAddRoot() {
      // 增加删除权限
      changeRoot({
        permissionIds: this.currRoleSelectId,
        roleId: this.currId.toString()
      }).then(res => {
        if (res.code == '000000') {
          if (this.activeName == 'first') {
            if (this.addFlag && this.currRootName !== '') {
              this.$Message.success('权限分配成功')
              this.addRootVisible = false
            } else {
              this.$Message.success('权限删除成功')
            }
            this.currRootName = ''
          } else {
            if (this.addFlag && this.currInterFaceName !== '') {
              this.$Message.success('接口分配成功')
              this.addRootVisible2 = false
            } else {
              this.$Message.success('接口删除成功')
            }
            this.currInterFaceName = ''
          }
          this.TreeRootId = []
          this.handleEdit(this.currId)
        }
      })
    },
    remove(node, data) {
      let removeID = []
      removeID.push(data)
      if (removeID.length) {
        let aaa = this.getDelRootIds(removeID)
        // let bbb = [...new Set(this.allDataID.concat(this.TreeRootId))]
        let bbb = [...new Set(this.allDataID)]
        aaa.forEach(v => {
          bbb.splice(bbb.indexOf(v), 1)
        })
        this.currRoleSelectId = bbb
        this.addFlag = false
        this.ensureAddRoot()
      }
    },
    getDelRootIds(data) {
      let _this = this
      let delArrID = []
      function loop(json) {
        for (var obj of json) {
          if (obj.children.length >= 1) {
            loop(obj.children)
            delArrID.push(obj.id)
          } else {
            delArrID.push(obj.id)
            delArrID = [...new Set(delArrID)]
          }
        }
      }
      loop(data)
      return delArrID
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.filterSearch {
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
}
.filterSearch div {
  float: right;
}
.filterSearch span {
  margin-right: 20px;
}
.searchContent {
  border: 1px solid #e4e4e4;
}
.searchContent form.el-form {
  display: flex;
  margin: 5px 10px 10px 18px;
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
.setUserBox {
  width: 100%;
  .everyLine {
    margin-bottom: 10px;
    .el-tabs {
      .el-tabs__header {
        margin-bottom: 0;
      }
    }
    span.lableName {
      float: left;
      width: 15%;
      line-height: 48px;
    }
    span.lableBtn {
      float: right;
      line-height: 32px;
      background: #64bc9c;
      margin: 8px 0;
      padding: 0 12px;
      color: #fff;
      cursor: pointer;
    }

    .el-tag--medium {
      margin: 10px 10px 0 0;
    }
    .el-button {
      margin: 10px 0;
    }
    .el-select {
      margin: 10px 0px;
    }
    .el-table {
      .el-table__header-wrapper {
        .el-table__header {
          .has-gutter {
            display: none;
          }
        }
      }
    }
    .rootBox {
      overflow: auto;
      height: 600px;
      float: left;
      width: 100%;
      border: 1px solid rgb(17, 173, 173);
      margin-bottom: 20px;
      .el-tree {
        padding: 8px;
        /deep/ .el-tree-node {
          /deep/ .el-tree-node__content {
            height: 26px;
            line-height: 26px;

            .el-tree-node__expand-icon {
              float: left;
            }
            .custom-tree-node {
              float: left;
              width: 100%;
              span:nth-child(2) {
                float: right;
                .el-button {
                  margin: 0 16px 0 0 !important;
                  color: red;
                }
              }
            }
          }
        }
      }
    }
  }
  .addRootName {
    .el-dialog__body {
      padding: 15px 20px;
      h5 {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
