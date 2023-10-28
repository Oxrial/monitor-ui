<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" class="app-main-container" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  padding: 10px;
  min-height: calc(100vh - 57px);
  height: calc(100vh - 57px);
  width: 100%;
  background-image: url(~@/assets/icons/en/25.png);
  position: relative;
  overflow: auto;
  background-color:#020d2b;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
.app-main-container {
  /* overflow: auto; */
  /* height: calc(100vh - 180px); */
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
