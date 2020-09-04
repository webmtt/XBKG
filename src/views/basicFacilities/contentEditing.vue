<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form
      style="padding-left: 15px;background: #F3F3F3;padding: 7px;border:1px solid #E4E4E4;border-bottom:none !important;"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-button @click="userBtnClick">用户详情</el-button>
        <!--<router-link tag="button" to="/backstage/userList/user-list">
                编辑资料
          </router-link>-->
        <el-button @click="meansBtnClick">编辑资料</el-button>
        <el-button @click="logBtnClick">登录日志</el-button>
      </el-form-item>
    </el-form>
    <table cellpadding="0" cellspacing="0" class="mailTable">
      <tr v-for="index in rowCount" :key="index">
        <td class="column">{{ tableData[index * 2 - 2].key }}</td>
        <td>{{ tableData[index * 2 - 2].value }}</td>
        <td class="column">
          {{
            tableData[index * 2 - 1] !== undefined
              ? tableData[index * 2 - 1].key
              : ''
          }}
        </td>
        <td>
          {{
            tableData[index * 2 - 1] !== undefined
              ? tableData[index * 2 - 1].value
              : ''
          }}
        </td>
      </tr>
    </table>

    <el-table
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
      <el-table-column
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
    </el-table>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import { getMessageList } from '@/api/application'

export default {
  name: 'ContentEditing',
  components: {},
  data() {
    return {
      tableData: [
        { key: '主机名', value: '8447466' },
        { key: 'IP地址', value: '192.168.1.11' },
        { key: '操作系统', value: 'Windir' },
        { key: '个性签名', value: '无' },
        { key: '内存', value: '1815224kb' },
        { key: '等级', value: '管理员' },
        { key: 'IP地址', value: '192.168.1.11' },
        { key: '注册时间', value: '2017-07-24 17:25:38' }
      ],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      checked: false,
      multipleSelection: [],
      modalOption: {
        show: false,
        data: null
      },
      is_show: true,
      options: [
        {
          value: '选项1',
          label: '鸡西市'
        },
        {
          value: '选项2',
          label: '伊春市'
        },
        {
          value: '选项3',
          label: '上海市'
        },
        {
          value: '选项4',
          label: '铜仁市'
        },
        {
          value: '选项5',
          label: '贺州市'
        },
        {
          value: '选项6',
          label: '北京市'
        },
        {
          value: '选项7',
          label: '西安市'
        },
        {
          value: '选项8',
          label: '长沙市'
        }
      ],
      value: '',
      value1: '',
      value2: '',
      list: [],
      total: 0,
      tableMeta: [
        { key: 'area', label: '系统状况' },
        { key: 'name', label: '是否显示' },
        { key: 'longitude', label: '基础信息' },
        { key: 'latitude', label: '是否显示' }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        area: undefined,
        startTime: undefined,
        endTime: undefined,
        attr: undefined,
        warning: undefined
      }
    }
  },
  computed: {
    rowCount: function() {
      return Math.ceil(this.tableData.length / 2)
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    userBtnClick() {
      this.$router.push({ path: '/backstage/userList/user-details' })
    },
    meansBtnClick() {
      this.$router.push({ path: '/backstage/userList/edit-profile' })
    },
    logBtnClick() {
      this.$router.push({ path: '/backstage/userList/security-log' })
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
    handleDownLoad() {},
    handleDetails() {},
    handleDelete() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getList()
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + 1 + index
    },
    getList() {
      this.listLoading = true
      getMessageList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
tr td {
  border: 1px solid #e6eaee;
  width: 150px;
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
  color: #666666;
  font-size: 14px;
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
</style>
