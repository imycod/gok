<template>
  <div class="add-teachcontent">
    <div class="content-data">
      <div class="content-pic">
        <img :src="ICON.COUSEWARE" @click="setActivityType(5)"/>
        <p>课件</p>
      </div>
      <div class="content-pic" @click="setActivityType(2)">
        <img :src="ICON.TEST"/>
        <p>测试</p>
      </div>
      <div class="content-pic" @click="setActivityType(0)">
        <img :src="ICON.HOMEWORK"/>
        <p>作业</p>
      </div>
      <div class="content-pic" @click="setActivityType(1)">
        <img :src="ICON.BRAIN_STORM"/>
        <p>头脑风暴</p>
      </div>
      <div class="content-pic" @click="setActivityType(13)">
        <img :src="ICON.VOTE"/>
        <p>投票问卷</p>
      </div>
      <div class="content-pic" @click="setActivityType(15)" v-if="classId">
        <img :src="ICON.EXERCISES"/>
        <p>练习</p>
      </div>
    </div>
  </div>
</template>

<script>
import {useIconLoader} from '@_c/icon.js';
import {mapMutations} from "vuex";

const ICON = Object.freeze({
  COUSEWARE: useIconLoader('class-course','course-ware'),
  HOMEWORK: useIconLoader('class-course', 'homework'),
  BRAIN_STORM: useIconLoader('class-course', 'brain-storm'),
  TEST: useIconLoader('class-course', 'testing'),
  VOTE: useIconLoader('class-course', 'vote'),
  EXERCISES: useIconLoader('class-course', 'homework'),
  EXAM: useIconLoader('class-course', 'homework')
});

export default {
  name: "add-teachcontent",
  data() {
    return {
      ICON,
      classId:''
    };
  },
  mounted() {
    this.classId = this.$route.query.classId;
  },
  methods: {
    // 添加活动
    addActivitys(curtype) {
      this.showModal = 1;
      this.curType = curtype;
      // this.$emit('showAddTeach', null, this.showModal, this.curType);
    },
    setActivityType(type){
      this.$store.commit('classCourse/openDrawerOpen');
      this.$store.commit('classCourse/setActivityType', type);
    }
  },
};
</script>

<style lang="stylus" scoped>
.add-teachcontent

  .content-data
    display: grid;
    padding-top 15px
    padding-bottom  10px
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 25px;
    //grid-column-gap: 53px;
    justify-items: center;
    .content-pic
      width: 44px;
      text-align: center;

      img
        width: 40px;
        height: 40px;
        cursor: pointer;
        border-radius: 8px;

      p
        font-size: 12px;
        color: #1A8EF8;

</style>
