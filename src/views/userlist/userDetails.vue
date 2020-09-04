<!-- <template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <i class="el-icon-edit"></i>
            <span style="color:#666666">数据列表</span>
        </el-form-item>
        <el-form-item style="float: right;">
            <el-button @click="openModal('insert')">添加</el-button>
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
    </div>
</template>
<script>
export default {
    data(){
        return{
            listQuery: {
                pageNum: 1,
                pageSize: 20,
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
            }
        }
    },
    methods:{
        handleFilter() {
            this.listQuery.pageNum = 1
            this.getList()
        },
    }
}
</script>
<style lang="scss" scoped>
    .demo-form-inline {
    padding-left: 15px;
    background: #f3f3f3;
    padding: 7px;
    border: 1px solid #e4e4e4;
    border-bottom: none !important;
    }
</style> -->