<template>
  <div class="app-container">
    <!-- 数据列表 -->
    <el-form class="dataList" :inline="true">
      <el-form-item>
        <span>当前部门： 销售部</span>
      </el-form-item>
    </el-form>
    <el-form style="border:1px solid #E4E4E4;padding-bottom: 40px;">
      <el-form class="goodsManagement">
        <el-form-item>
          <el-checkbox
            v-model="checkAll"
            style=" width: 1075px !important;"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            商品管理
          </el-checkbox>
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox v-for="city in cities" :key="city" :label="city">{{
              city
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-form class="orderManagement">
        <el-form-item>
          <el-checkbox
            v-model="checkAll"
            style=" width: 1075px !important;"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            订单管理
          </el-checkbox>
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox v-for="city in cities" :key="city" :label="city">{{
              city
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-form class="checkAllOptions">
        <el-form-item>
          <el-checkbox
            v-model="checkAll"
            style=" width: 1075px !important;"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            选择全部
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="success">保存</el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </div>
</template>

<script>
import {} from '@/api/application'
const cityOptions = [
  '商品添加/编辑',
  '商品删除恢复',
  '分类添加/编辑',
  '分类转移删除',
  '商品属性/管理',
  '商品评价/管理',
  '商品自动/上下架',
  '图片批量/处理',
  '商品批量/导出',
  '图片库管理',
  ' 商品添加/编辑',
  '商品删除/恢复',
  '分类转移/删除',
  '商品属性管理',
  '商品评价管理',
  '商品自动上下架',
  '图片批量处理',
  '商品批量导出'
]
export default {
  components: {},
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true
    }
  },
  computed: {},
  created() {},
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>

<style lang="scss" scoped>
.goodsManagement label.el-checkbox {
  border: 1px solid #e4e4e4;
  padding: 8px 50px 8px 19px;
  width: 180px;
  border-bottom: none;
}
.goodsManagement label.el-checkbox:nth-child(18),
.goodsManagement label.el-checkbox:nth-child(17),
.goodsManagement label.el-checkbox:nth-child(16),
.goodsManagement label.el-checkbox:nth-child(15),
.goodsManagement label.el-checkbox:nth-child(14),
.goodsManagement label.el-checkbox:nth-child(13) {
  border-bottom: 1px solid #e4e4e4;
}
.goodsManagement {
  width: 1200px;
  padding: 30px;
}
.goodsManagement .el-checkbox {
  margin-right: -1px;
}
.orderManagement label.el-checkbox {
  border: 1px solid #e4e4e4;
  padding: 8px 50px 8px 19px;
  width: 180px;
  border-bottom: none;
}
.orderManagement label.el-checkbox:nth-child(18),
.orderManagement label.el-checkbox:nth-child(17),
.orderManagement label.el-checkbox:nth-child(16),
.orderManagement label.el-checkbox:nth-child(15),
.orderManagement label.el-checkbox:nth-child(14),
.orderManagement label.el-checkbox:nth-child(13) {
  border-bottom: 1px solid #e4e4e4;
}
.orderManagement {
  width: 1200px;
  padding: 0px 30px;
}
.checkAllOptions {
  width: 1136px;
  padding: 0px 30px;
  text-align: center;
}
.checkAllOptions button.el-button.el-button--success.el-button--medium {
  margin-top: 50px;
}
.checkAllOptions label.el-checkbox {
  margin-top: 30px;
  border: 1px solid #e4e4e4;
  padding: 8px 50px 8px 19px;
}
.orderManagement .el-checkbox {
  margin-right: -1px;
}
.dataList {
  background: #f3f3f3;
  padding: 7px 7px 7px 20px;
  border: 1px solid #e4e4e4;
  border-bottom: none !important;
}
.app-container {
  color: #666666;
}
</style>
