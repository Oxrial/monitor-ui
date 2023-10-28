<template>
  <div
    id="app"
    v-loading="requestLoading"
    class="G-home"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    requestLoading() {
      return this.$store.state.loading.requestLoading
    }
  }
}
</script>
