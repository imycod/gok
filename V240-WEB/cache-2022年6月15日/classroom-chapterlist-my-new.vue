<template>
  <div class="chapter-list-container">
    <div v-if="!isLoading" class="m-t-30 m-l-20">
      <SkeletonListComponent></SkeletonListComponent>
    </div>
    <div class="container-root p-l-10" v-else>
      <div class="empty h-full m-t-40" v-if="!isChapterList">
        <empty type="l" text="老师还什么都没发布呢~"></empty>
      </div>
      <Collapse class="collapse" simple v-model="activeCollpase" accordion v-if="isChapterList">
        <div
            v-for="(item, index) in chapterLists"
            :key="item.chapterId"
            :class="{activeStyle: active === index}"
            class="border-top"
        >
          <Panel :name="index+''">
          <span class="main-title" :title="item.name">
            第{{ Arabia_To_SimplifiedChinese(index + 1) }}章 {{ item.name }}
          </span>
            <div slot="content" v-if="!item.chapterDetailEntityList.length">
              <div class="empty">
                <empty type="l" text="老师还什么都没发布呢~"></empty>
              </div>
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
                    </div>
                    <div class="r">
                      <!--活动-->
                      <div class="" :class="son.status === 1?'noJoin':'end'"
                           v-if="helper.useActivity(son.type,son.typeStr)">
                        <div class="activity center"
                             v-if="!isGrowth && !Number(son.isParted) && son.status===1">
                          <!--                          {{ son.status === 1 ? '未参与' : '已结束' }}-->
                          未参与
                        </div>
                        <!-- 成长课特殊展示 -->
                        <div class="activity center" v-if="isGrowth && !Number(son.isParted)">未参与</div>
                        <img class="icon" v-if="Number(son.isParted)" src="~@img/class-course/icon_right.png" alt="">
                      </div>
                      <!--视频-->
                      <div class="com flex" v-if="helper.useCourseWare(son.type,son.courseWareType) ==='video'">
                        <span v-if="son.videoTime!=='-1'"> {{ durationChange(son.videoTime) }} </span>
                        <img v-if="son.videoStudyRate===100" class="m-l-8 icon" src="~@img/class-course/icon_right.png"
                             alt="">
                        <v-charts v-if="son.videoStudyRate!==0 && son.videoStudyRate!==100" class="m-l-8 icon"
                                  :rate="rate(son.videoStudyRate)"></v-charts>
                        <span v-if="son.videoStudyRate===0" class="icon"></span>
                      </div>
                      <!--课件-->
                      <div class="com flex"
                           v-if="helper.useCourseWare(son.type,son.courseWareType) ==='courseWare'">
                        <span>{{ fileSizeFormat(son.size) }}</span>
                        <img v-if="Number(son.isParted)" class="m-l-8 icon" src="~@img/class-course/icon_right.png"
                             alt="">
                        <span v-else class="icon"></span>
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
  </div>
</template>
<script>
import empty from './empty.vue';
import VCharts from './progress-pie-chart.vue';
import SkeletonListComponent from './classroom-skeletonlist.vue';
import { icon } from '../import-loader.js';
import preview from '../preview.js';
import {
  useIcon,
  useActivityName,
  useActivity,
  useCourseWare,
  Arabia_To_SimplifiedChinese,
  durationChange,
  usePathRoute,
  stuStorage,
  useFindChapterItem,
  ACTIVITY_TYPE
} from '../index.js';
import { fileSizeFormat, timestampFormat } from '@u/filters/index.js';
import { fileFormat } from '@/utils/index.js';
import PREWVIEW_ACTIVITY_TYPE from '@/global-data/activity-type.js'
import { createNamespacedHelpers } from 'vuex';
const IMG_TYPE = ['png', 'jpg', 'jpeg', 'svg', 'bmp', 'gif', 'webp', 'bmp']; // 图片类型

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
  props: ['isLoading'],
  components: {
    empty,
    VCharts,
    SkeletonListComponent
  },
  data () {
    return {
      active: 0,
      duration: 100, // 总的时长
      icon,
      helper,
      isClickChapterItem: stuStorage.get('isClickChapterItem') || false, // 是否点击
      // 跳转路由函数根据成长课/班课决定
      pageFn: () => {
      }
    };
  },
  // 指令
  directives: {
    'preview-stu-iframe': preview
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
      const routePath = this.$route.path;
      if (routePath.includes('growth-path-details')) {
        return true;
      }
      return false;
    }
  },
  mounted () {
    // 初始化跳转
    this.initPageFn();
    const item = useFindChapterItem.call(this, this.chapterLists);
    if (item) {
      this.pageFn(item, true);
    }
  },
  methods: {
    /**
     * @description: 初始化跳转函数
     * @return {*}
     */
    initPageFn () {
      if (this.isGrowth) {
        this.growthPage();
      } else {
        this.classPage();
      }
    },

    /**
     * @description: 成长课解析跳转
     * @return {*}
     */
    growthPage () {
      this.pageFn = (item) => {
        const baseRoute = '/growth-path-details/class-room';
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
      };
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
    currUpdateTime (currTime) {
      return timestampFormat(currTime);
    },
    Arabia_To_SimplifiedChinese,
    durationChange,
    fileSizeFormat
  }
};
</script>

<style lang="stylus" scoped>
@import "../common.styl"

.activeStyle {
  background: #fff !important;
  font-size: 14px;
  font-weight: 400;
  color: #fff !important;
}

.border-top:not(:first-child) {
  border-top: 1px solid #dfe1e7;
}

.main-title {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  g-text-overflow(1)
  cursor pointer
}

.sub-title {
  font-size: 13px;
  font-weight: 500;
  color: #8590A6;
  g-text-overflow(1)
}

.chapter-list-container {
  height: 100%;

  .container-root {
    width: 380px;
  }

  .empty {
    width: 100%;
  }

  .collapse {
    width: 370px;

    .excerpts {
      .active{
        color $base
      }
      .item {
        height: 40px;
        cursor: pointer;

        &:hover {
          color: #2f2f2f;
        }

        //.start{
        //  background: #FE8836;
        //}
        //.over{
        //  background: #FFC69E;
        //}
        //.badge {
        //  width: 31px;
        //  height: 22px;
        //  font-size 12px
        //  background: #FE8836;
        //  color #fff
        //  border-radius: 4px 4px 0px 4px;
        //}

        .icon {
          width: 24px;
          height: 24px;
        }

        .name {
          width: 230px;
          g-text-overflow(1)
        }

        .light-hight {
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
