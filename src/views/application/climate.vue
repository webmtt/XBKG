<template>
  <div class="climate">
    <el-tabs v-model="editableTabsValue" type="border-card">
      <el-tab-pane label="本地自观极值统计" name="one">
        <one v-if="editableTabsValue == 'one'" />
      </el-tab-pane>
      <el-tab-pane label="自观风力风速统计" name="two">
        <two v-if="editableTabsValue == 'two'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import one from './components/1.vue'
import two from './components/2.vue'
export default {
  data() {
    return {
      editableTabsValue: 'two'
    }
  },
  components: {
    one,
    two
  }
}
</script>

<style lang="scss" scoped>
.climate {
  padding: 30px;
}
</style>
