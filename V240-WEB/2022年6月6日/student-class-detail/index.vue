<template>
  <div class="student-class-detail-layout">
    <header class="header sticky between w-full relative t-0 r-0">
      <div class="l h-full center absolute column  flex">
        <div class="fixed">
          <h2 class="bd">1111111111111111</h2>
        </div>
      </div>
      <div class="r flex absolute h-full">
        <div class="tab center fixed">
          <main-tabs></main-tabs>
        </div>
        <container-header :bg="bgStuImg"/>
      </div>
    </header>
    <section class="body">
      <component :is="currentComponent"></component>
    </section>
  </div>
</template>

<script>
import ContainerHeader from '@c/container/container-header.vue';
import MainTabs from "./components/main-tabs.vue";

import {classroom, introduction, statistical, icon} from "./import-loader.js";

export default {
  name: "student-class-container",
  components: {
    ContainerHeader,
    MainTabs,
    classroom,
    introduction,
    statistical
  },
  data() {
    return {
      bgStuImg: icon.bgStuImg,
      currentComponent: "classroom"
    };
  },
  watch: {
    $route(to, from) {
      this.currentComponent = to.query.tab;
    }
  },
};
</script>
<style lang="stylus" scoped>
.student-class-detail-layout {
  $header-height = 87px !important
  $top-child-index = 600

  .header {
    height: $header-height;
    background #fff

    .l {
      z-index: $top-child-index;
    }

    .r {
      z-index: $top-child-index;

      .tab {
        width: 300px;
        height: $header-height;
        right 200px
        z-index: 555;
      }

      /deep/ .container-header {
        width: 100% !important;
        height: $header-height;
      }
    }
  }

  .body {
    background: #F9FAFC;
  }
}
</style>
