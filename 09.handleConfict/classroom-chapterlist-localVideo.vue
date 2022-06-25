<!--
 * @Author: zhouzx zhouzx@goktech.cn
 * @Date: 2022-06-09 09:18:45
 * @LastEditors: zhouzx zhouzx@goktech.cn
 * @LastEditTime: 2022-06-15 11:55:44
 * @FilePath: \college-teaching\src\view\student-class-detail\components\classroom-chapterlist.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="chapter-list-container">
    <div class="empty" v-if="!isChapterList">
      <empty type="l" text="老师还什么都没发布呢~"></empty>
    </div>
    <Collapse class="collapse" simple v-model="collpase" accordion v-if="isChapterList">
      <div
          v-for="(item, index) in chapterLists"
          :key="item.chapterId"
          :class="{activeStyle: active === index}"
      >
        <Panel :name="index+''">
          <span class="main-title" :title="item.name">
            第{{ Arabia_To_SimplifiedChinese(index + 1) }}章 {{ item.name }}
          </span>
          <div slot="content" v-if="item.chapterDetailEntityList.length>0">
            <div class="excerpts p-l-10" v-for="(child,childIndex) in item.chapterDetailEntityList" :key="child.id">
              <div class="sub-title m-b-10" :title="child.name">
                {{ index + 1 }}.{{ childIndex + 1 }} {{ child.name }}
              </div>
              <div class="empty" v-if="!child.teachContentResList.length">
                <empty type="l" text="老师还什么都没发布呢~"></empty>
              </div>
<<<<<<< HEAD
              <ul v-else>
                <div
                    v-for="(son,sonIndex) in child.teachContentResList"
                    @click="handleClick(son)"
                    class="item flex between"
                    :key="son.id">
                  <div class="l h-full flex center">
                    <div class="center">
                      <img
                          v-if="helper.useIcon(son.courseWareType, son.type)"
                          :src="helper.useIcon(son.courseWareType, son.type)"
                          mode="aspectFill"
                          class="icon"
                      >
                      <span v-else class="badge text-center">{{ helper.useActivityName(son.type) }}</span>
=======
            </div>
            <div slot="content" v-else>
              <div class="excerpts p-l-10" v-for="(child,childIndex) in item.chapterDetailEntityList" :key="child.id">
                <div class="sub-title m-b-10" :title="child.name">
                  {{ index + 1 }}.{{ childIndex + 1 }} {{ child.name }}
                </div>
                <div class="empty" v-if="!child.teachContentResList.length">
                  <empty type="l" text="老师还什么都没发布呢~"></empty>
                </div>
                <ul v-else>
                  <div
                      v-for="(son,sonIndex) in child.teachContentResList"
                      @click="handleClick(son)"
                      :class="{'active':(!isClickChapterItem && (son.dataId===activeChapter.source.dataId)) || (isClickChapterItem && son.dataId===currentChapterItem.dataId)}"
                      class="item flex between"
                      :key="sonIndex+''"
                      :data-index="sonIndex+''"
                      v-preview-stu-iframe="{url: son.imgUrl, docId: son.docId, name: son.name, updateTime: currUpdateTime(son.updateTime), intercept: interceptPreview(son)}"
                  >
                    <div class="l h-full flex center">
                      <div class="center">
                        <img
                            v-if="helper.useIcon(son.courseWareType, son.type)"
                            :src="helper.useIcon(son.courseWareType, son.type)"
                            mode="aspectFill"
                            class="icon"
                        >
                        <span v-else class="badge text-center"
                              :class="[son.status===1?'start':'over']">{{ helper.useActivityName(son.type) }}</span>
                      </div>
                      <div class="m-l-10 name" :class="{'light-hight':son.flag}"> {{ son.name }}</div>
>>>>>>> wxs-dev-240
                    </div>
                    <!-- <div class="m-l-10 name" :class="{'light-hight':son.flag}"> {{ son.name }}</div> -->
                    <div class="m-l-10 name" :class="{'light-hight':son.flag}"> {{ son.dataId }}</div>
                  </div>
                  <div class="r">
                    <!--活动-->
                    <div class="" :class="son.status === 1?'noJoin':'end'"
                         v-if="helper.useActivity(son.type,son.typeStr)">
                      <span class="activity" v-if="!isGrowth && !Number(son.isParted)">{{ son.status === 1 ? '未参与' : '已结束' }}</span>
                      <!-- 成长课特殊展示 -->
                      <span class="activity" v-if="isGrowth && !Number(son.isParted)">未参与</span>
                      <img class="icon" v-if="Number(son.isParted)" src="~@img/class-course/icon_right.png" alt="">
                    </div>
                    <!--视频-->
                    <div class="com flex" v-if="helper.useCourseWare(son.type,son.courseWareType) ==='video'">
                      <!-- <span> {{ durationChange(son.videoTime) }} </span> -->
                      <span style="color:#fff">{{sss}}</span>
                      <!-- <span>{{useStorageObj[son.dataId] ?  Number(useStorageObj[son.dataId])*100/Number(son.videoTime) :  son.videoStudyRate}}</span> -->
                      <v-charts :key="son.dataId" class="m-l-8 icon" :rate="rateFn(son)"></v-charts>
                    </div>
                    <!--课件-->
                    <div class="com flex"
                         v-if="helper.useCourseWare(son.type,son.courseWareType) ==='courseWare'">
                      <span>{{ fileSizeFormat(son.size) }}</span>
                      <img v-if="Number(son.isParted)" class="m-l-8 icon" src="~@img/class-course/icon_right.png"
                           alt="">
                      <!--                      <span v-else class="icon"></span>-->
                    </div>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </Panel>
      </div>
    </Collapse>
  </div>
</template>
<script>
import empty from './empty.vue';
import VCharts from './progress-pie-chart.vue';
<<<<<<< HEAD
import { icon } from '../import-loader.js';
=======
import SkeletonListComponent from './classroom-skeletonlist.vue';
import { icon } from '../import-loader.js';
import preview from '../preview.js';
>>>>>>> wxs-dev-240
import {
  useIcon,
  useActivityName,
  useActivity,
  useCourseWare,
  Arabia_To_SimplifiedChinese,
  durationChange,
<<<<<<< HEAD
  usePathRoute, stuStorage
=======
  usePathRoute,
  stuStorage,
  useFindChapterItem,
  ACTIVITY_TYPE
>>>>>>> wxs-dev-240
} from '../index.js';
import { fileSizeFormat, timestampFormat } from '@u/filters/index.js';
import { fileFormat } from '@/utils/index.js';
import PREWVIEW_ACTIVITY_TYPE from '@/global-data/activity-type.js'
import { createNamespacedHelpers } from 'vuex';
const IMG_TYPE = ['png', 'jpg', 'jpeg', 'svg', 'bmp', 'gif', 'webp', 'bmp']; // 图片类型
import videoStorage from '@_c/video-storage.js' // 视频 缓存
const helper = {
  useIcon,
  useActivityName,
  useActivity,
  useCourseWare
};
const { mapGetters, mapState } = createNamespacedHelpers('classCourse');

export default {
  name: 'classroom-charpterlist',
  // props: ['isChapterList', 'chapterLists', 'isLoading'],
  props: ['isChapterList', 'chapterLists', 'isLoading'],
  components: {
    empty,
    VCharts
  },
  data () {
    return {
      collpase: ['0'],
      active: 0,
      currentTime: 60, // 当前播放的时间
      duration: 100, // 总的时长
      icon,
      helper,
<<<<<<< HEAD
      tenantId: this.$one.uc.token.getCurTenant().tenantId,
      uid: this.$one.uc.token.getUserBaseInfo().uid,
      useStorageObj: {}, // 使用 storage 的对象
      sss:0,
=======
      isClickChapterItem: stuStorage.get('isClickChapterItem') || false, // 是否点击
      // 跳转路由函数根据成长课/班课决定
>>>>>>> wxs-dev-240
      pageFn: () => {

      }
    };
  },
  watch: {
    // 处理列表数据 --- zx 6.13
    chapterLists(newVal){
      this.handleChapterLists()
    },
    useStorageObj: {
      handler(n){
        console.log('watch--->',n)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapState({
      activeChapter: state => state.stuCourse.activeChapter,
    }),
    ...mapGetters(['isChapterList', 'chapterLists', 'currentChapterItem']),
    activeCollpase: {
      get () {
        return this.activeChapter.index;
      },
      set (val) {
        this.$store.commit('stuCourse/setActiveChapter', {
          index: val,
          // chapter: this.chapterLists[val]
        });
        // return val;
      }
    },
    rate () {
      return (videoStudyRate) => videoStudyRate / this.duration;

    },
    isGrowth () {
<<<<<<< HEAD
      const routePath = this.$route.path
=======
      const routePath = this.$route.path;
>>>>>>> wxs-dev-240
      if (routePath.includes('growth-path-details')) {
        return true
      }
      return false
    },
    rateFn() {
        return (son)=>{
          return this.useStorageObj[son.dataId] ?  Number(this.useStorageObj[son.dataId])/Number(son.videoTime) :  son.videoStudyRate / 100
        }
      // return (dataId, videoTime, videoStudyRate)=>{
      //  return this.useStorageObj[dataId] ?  Number(this.useStorageObj[dataId])*100/Number(videoTime) :  videoStudyRate;
      // }
      // return '1'
      // useStorageObj[son.dataId] ?  Number(useStorageObj[son.dataId])*100/Number(son.videoTime) :  son.videoStudyRate
      // console.log(this.useStorageObj[dataId] ?  Number(this.useStorageObj[dataId])*100/Number(videoTime) :  videoStudyRate)
    },
  },
  mounted () {
<<<<<<< HEAD
    // 修改列表的 使用 storage 数据    dataId 就是 videoId
    this.$gokBus.$off('reviseVideoStorageData');
    this.$gokBus.$on('reviseVideoStorageData', (dataId) => {
      console.log('dataId--->>>',dataId)
      let storageName = `gokV_${this.uid}_${this.tenantId}_${dataId}`
      this.useStorageObj[dataId] =  JSON.parse(JSON.stringify(videoStorage.get(storageName)?.time))
      this.sss++
      console.log('this.useStorageObj变化了--->>>', this.useStorageObj)
    })
=======
>>>>>>> wxs-dev-240
    // 初始化跳转
    this.initPageFn();
    const item = useFindChapterItem.call(this, this.chapterLists);
    if (item) {
      this.pageFn(item, true);
    }
  },
  methods: {

    /*
      处理列表数据 --- zx 6.13
    */
    handleChapterLists(){
      let sectionAll = []
      let handleData = []
      let chapterLists = this.chapterLists
      this.useStorageObj = {}
      console.log('this.chapterLists--->>>',this.chapterLists)
      for(let i=0; i<chapterLists.length; i++){
        for(let j=0; j<chapterLists[i].chapterDetailEntityList.length; j++){
          sectionAll = sectionAll.concat(chapterLists[i].chapterDetailEntityList[j].teachContentResList)
        }
      }
      // console.log('小节结合--->>>',sectionAll)
      sectionAll.forEach(item => {
        if(item.type === 12){ // 是视频 且 观看时间不为0 时候 设置
          let storageName = `gokV_${this.uid}_${this.tenantId}_${item.dataId}`
          // console.log(storageName,videoStorage.get(storageName))
          if(videoStorage.get(storageName) == null || videoStorage.get(storageName)?.time < item.validDuration) {
            videoStorage.set(storageName,{'time': item.validDuration})
          }else if(videoStorage.get(storageName) != null && videoStorage.get(storageName)?.time > item.validDuration){
            this.useStorageObj[item.dataId] = videoStorage.get(storageName)?.time
          }
        }
      })
      console.log('useStorageObj--->',this.useStorageObj)
    },

    /**
     * @description: 初始化跳转函数
     * @return {*}
     */
    initPageFn () {
      if (this.isGrowth) {
        this.growthPage()
      } else {
        this.classPage()
      }
    },

    /**
     * @description: 成长课解析跳转
     * @return {*}
     */
    growthPage () {
      this.pageFn = (item) => {
<<<<<<< HEAD
        const baseRoute = '/growth-path-details/class-room'
=======
        const baseRoute = '/growth-path-details/class-room';
>>>>>>> wxs-dev-240
        const { typing, currentPath } = usePathRoute(item);
        const targetPath = baseRoute + currentPath;
        this.$router.push({
          path: targetPath,
          query: {
            ...this.$route.query,
            typing,
            dataId: item.dataId
          }
        });
      }
    },

    /**
     * @description: 班课解析跳转
     * @return {*}
     */
    classPage () {
      this.pageFn = (item, isFirst = false) => {
        const { typing, currentPath } = usePathRoute(item);
        const targetPath = this.$route.matched[0].path + currentPath;
        if (isFirst) {
          this.$router.push({
            path: targetPath,
            query: {
              ...this.$route.query,
              typing,
              dataId: item.dataId
            }
          });
        } else {
          this.$router.push({
            path: targetPath,
            query: {
              classId: this.$route.query.classId,
              courseId: this.$route.query.courseId,
              typing,
              dataId: item.dataId
            }
          });
        }
      };
    },
    handleClick (item) {
      this.$store.commit('classCourse/setStuCourseCurrentChapterItem', { item: item });
      stuStorage.set('chapterCurrentItem', item);
      this.isClickChapterItem = true
      stuStorage.set('isClickChapterItem', true);
      this.pageFn(item);
    },
    interceptPreview (item) {
      // 压缩包超过100M 需进行下载
      const PREVIEW_TYPE = fileFormat(item.name.split('?')[0]); const FILE_TYPE = ['zip', 'rar'];
      if (IMG_TYPE.includes(PREVIEW_TYPE)) { // 图片类型，拦截预览，走侧边弹窗
        return true;
      }
      if (FILE_TYPE.includes(PREVIEW_TYPE)) { // 压缩包超过100M,拦截预览，去下载
        return item.size > 104857600; // 超过100M
      } else {
        return item.type != PREWVIEW_ACTIVITY_TYPE.COURSEWARE;

      }
    },
<<<<<<< HEAD
    handleClick (item) {
      this.$store.commit('classCourse/setStuCourseCurrentChapterItem', { item: item });
      stuStorage.set('chapterCurrentItem', item)
      this.pageFn(item)
=======
    currUpdateTime (currTime) {
      return timestampFormat(currTime);
>>>>>>> wxs-dev-240
    },
    Arabia_To_SimplifiedChinese,
    durationChange,
    fileSizeFormat
  }
};
</script>

<style lang="stylus" scoped>
.activeStyle {
  background: #fff !important;
  font-size: 14px;
  font-weight: 400;
  color: #fff !important;
}

.main-title {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  g-text-overflow(1)
  cursor pointer
  border-top: 1px solid #dfe1e7;
}

.sub-title {
  font-size: 13px;
  font-weight: 500;
  color: #8590A6;
  g-text-overflow(1)
}

.chapter-list-container {
  height: 100%;

  .collapse {
    width: 370px;
    .excerpts {
      .active{
        color $base
      }
      .item {
        height: 40px;
        cursor: pointer;

        .badge {
          width: 31px;
          height: 22px;
          font-size 12px
          background: #FE8836;
          color #fff
          border-radius: 4px 4px 0px 4px;
        }

        .icon {
          width: 24px;
          height: 24px;
        }

        .name {
          width: 230px;
          g-text-overflow(1)
        }
        .light-hight{
          color $base
        }
      }
    }

    .excerpts:not(:first-child) {
      margin-top 10px
      border-top: 1px solid #F0F2F7;

      .sub-title {
        margin-top 20px
      }
    }

    .r {
      width: 100px;
      display flex
      justify-content right
      align-items center
      overflow hidden

      .activity {
        width: 44px;
        height: 22px;
        color #8590A6
        font-size: 12px;
        background: #EFEEEE;
        border-radius: 4px 4px 4px 4px;
      }

      .icon {
        width: 16px !important;
        height: 16px !important;
      }
    }
  }

  reset-collapse()
  ///deep/ .ivu-collapse > .ivu-collapse-item.ivu-collapse-item-active > .ivu-collapse-header {
  //  border-bottom: none;
  //  padding-left: 0;
  //  text-indent: 16px
  //}
  //
  ///deep/ .ivu-collapse > .ivu-collapse-item {
  //  border-top: none;
  //}
  //
  ///deep/ .ivu-collapse-header {
  //  position: relative;
  //  height: 56px;
  //  line-height: 56px;
  //}
  //
  ///deep/ .ivu-icon {
  //  position: absolute;
  //  right: 0px;
  //  top: 50%;
  //  margin-top: -7px;
  //  transform: rotate(90deg);
  //  color: #666666
  //}
  //
  ///deep/ .ivu-collapse-item.ivu-collapse-item-active > .ivu-collapse-header > i {
  //  transform: rotate(270deg);
  //  color: #666666
  //}
  //
  ///deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  //  line-height: 40px;
  //  font-size: 14px;
  //  color: #333333;
  //}
  //
  ///deep/ .ivu-collapse-content {
  //  padding 0px !important
  //}
  //
  ///deep/ .ivu-collapse-content > .ivu-collapse-content-box {
  //  padding-top: 0;
  //  padding-bottom: 0;
  //}
}
</style>
