<template>
  <el-table
    :cell-style="{ padding: '6px 0', textAlign: 'center' }"
    :header-cell-style="{ padding: '6px 0', textAlign: 'center' }"
    :data="tableData"
    stripe
    style="width: 100%"
  >
    <el-table-column
      v-for="(item, index) in tableColumns"
      :key="index"
      :prop="item.key"
      :label="item.label"
      :width="item.width"
    />
  </el-table>
</template>

<script>
export default {
  props: {
    tableColumns: {
      type: Array,
      default() {
        return []
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>
