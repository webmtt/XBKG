<template>
  <div ref="httpRest" class="app-container">
    <div :height="buttonHeight" id="btn">确认</div>
  </div>
</template>

<script>
export default {
  props: {
    fatherHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      buttonHeight: ''
    }
  },
  created() {},
  mounted() {
    // this.buttonHeight = this.$refs.httpRest.offsetHeight
    this.load_home()
  },
  methods: {
    load_home() {
      document.getElementById('btn').innerHTML =
        // '<object type="text/html" data="http://10.36.28.147:9401/server/swagger-ui.html#/" width="100%" height="800px"></object>'
        '<object type="text/html" data="http://121.36.62.243:9401/server/swagger-ui.html#/" width="100%" height="800px"></object>'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  height: 100%;
  flex-direction: column;
}
</style>
