<template>
  <div class="classroom-container flex">
    <aside class="l">
      <nav class="m-l-26 m-t-22">
        <aside-tabs :activeTab="activeTab" @tabClick="tabClick"></aside-tabs>
      </nav>
      <activity-component
        v-if="activeTab"
      >
      </activity-component>
      <list-component
          v-else
          class="p-t-50"
          :chapterLists="chapterLists"
          :isChapterList="isChapterList"
      ></list-component>
    </aside>
    <section class="r bd">
      todo...
    </section>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';

const {mapGetters} = createNamespacedHelpers('classCourse');

import ListComponent from "./components/classroom-chapterlist.vue";
import ActivityComponent from "./components/classroom-activity.vue";
import AsideTabs from "./components/aside-tabs.vue";

export default {
  name: "classroom",
  data() {
    return {
      activeTab: Number(localStorage.getItem('asideTab')) || 0
    };
  },
  components: {
    ListComponent,
    ActivityComponent,
    AsideTabs
  },
  created() {
    this.$store.dispatch('classCourse/fetchChapterData', this.$route.params);
  },
  computed: {
    ...mapGetters(['isChapterList', 'chapterLists'])
  },
  methods: {
    tabClick(idx) {
      this.activeTab = idx;
    }
  },
};
</script>

<style lang="stylus" scoped>
$base-height = 880px
$base-aside-width = 400px
$base-section-width = 880px

.classroom-container {
  padding-left 60px
  padding-top 25px
  padding-bottom 32px

  height: 100vh;

  .l {
    width: $base-aside-width;
    height: $base-height;
    margin-right 20px
    border-radius: 8px 8px 8px 8px;
    background: #FFFFFF;

    nav {
      width: 30%;
    }
  }

  .r {
    width: $base-section-width;
    height: $base-height;
  }
}
</style>
