<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <i class="el-icon-edit"></i>
        <span>数据列表</span>
      </el-form-item>
      <el-form-item>
        <el-button>添加</el-button>
        <el-select
          v-model="listQuery.limit"
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
        <el-select
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
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 数据显示部分 -->
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
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        align="center"
        label="序号"
        :index="indexMethod"
        width="70"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in tableMeta"
        :key="index"
        align="center"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
      />
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }" class="tableButtom">
          <el-button
            class="handleLink"
            type="primary"
            @click="handlePermissions(row)"
          >
            权限设置
          </el-button>
          <el-button class="handleLink" type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            class="handleLink"
            type="primary"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      style="margin-top: 20px;"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="paginationChange"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getMessageList } from '@/api/application'

export default {
  components: { Pagination },
  data() {
    return {
      checked: false,
      multipleSelection: [],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      numberOptions: [
        { label: '10条/页', key: 10 },
        { label: '20条/页', key: 20 },
        { label: '30条/页', key: 30 },
        { label: '50条/页', key: 50 }
      ],
      list: [],
      total: 0,
      tableMeta: [
        { key: 'area', label: '区域' },
        { key: 'name', label: '机场名称' },
        { key: 'longitude', label: '经度' },
        { key: 'latitude', label: '纬度' },
        { key: 'warning', label: '告警' },
        { key: 'time', label: '时间' },
        { key: 'attr', label: '要素' }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        area: undefined,
        startTime: undefined,
        endTime: undefined,
        attr: undefined,
        warning: undefined,
        name: undefined
      }
    }
  },
  computed: {},
  created() {
    // this.getList()
  },
  methods: {
    paginationChange() {
      this.checked = false
      // this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePermissions() {
      this.$router.push({
        path: '/backstage/departmentManage/permission-setting'
      })
    },
    handleEdit() {
      this.$router.push({ path: '/backstage/userManage/role-manage' })
    },
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
.dataList {
  padding-left: 15px;
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
  border-bottom: none !important;
}
.dataList .el-form-item.el-form-item--medium:nth-child(2) {
  float: right;
}
.filter-item {
  width: 150px;
}
.app-container {
  color: #666666;
}
.filterSearch {
  background: #f3f3f3;
  padding: 7px;
  border: 1px solid #e4e4e4;
}
.filterSearch div {
  display: inline-block;
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
  margin: 10px 10px 10px 30px;
}
.searchContent .el-input.el-input--medium {
  width: 200px;
}
.searchContent .el-form-item.el-form-item--medium:nth-child(2) {
  margin-left: 200px;
}
.el-icon-search {
  margin-right: 5px;
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
