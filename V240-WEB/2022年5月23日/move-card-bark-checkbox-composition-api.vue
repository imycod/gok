<template>
  <div class="chapter">
    <div class="chapter">
      <Collapse
          simple
          v-model="collapseIndex"
      >
        <Panel
            :name='item.chapterId'
            v-for="(item,index) in list"
            :key="index" hide-arrow>
          <p class="panel-title">
            <span>第{{ Arabia_To_SimplifiedChinese(index + 1) }}章 {{ item.name }}</span>
            <span class="status">
              <img
                  :src="collapseIndex.indexOf(item.chapterId) == '-1' ?
                    triangleDownIcon :
                    triangleTopIcon"
                  alt="">
          </span>
          </p>
          <div class="empty-section" slot="content" v-if="item.chapterDetailEntityList.length == 0">
            请创建节
          </div>
          <div slot="content" v-else>
            <div class="section" :class="item_s.selected && 'section-focus' "
                 v-for="(item_s,index_s) in item.chapterDetailEntityList" :key="index_s">
              <Checkbox :label="item_s.id" @on-change="clickSection(item_s.id,item.chapterId)"
                        v-model='item_s.selected'>
                <span class="seled">{{ index + 1 }}.{{ index_s + 1 }}  {{ item_s.name }}</span>
              </Checkbox>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>

<script>
// 用这套api可以避免 上下反复横跳，并且业务逻辑更清晰
import { defineComponent } from '@vue/composition-api';
// eslint-disable-next-line camelcase
import { useCollapse, useHttp, Arabia_To_SimplifiedChinese, ICON } from '@v/class-course/courses-content/move-card';

export default defineComponent({
  setup(props, {root}) {
    const {$store, $route} = root;
    const courseId = $route.query.courseId;
    const list = useHttp(courseId);
    // 勾选的逻辑只需要单独放到这一个函数里就可以了，这个函数，维护勾选的列表以及勾选时选中的函数
    const {collapseIndex, clickSection} = useCollapse($store);
    return {
      list,
      collapseIndex,
      clickSection,
      Arabia_To_SimplifiedChinese,
      ...ICON
    };
  }
});
</script>

<style lang="stylus" scoped>
.chapter {
  /deep/ .ivu-collapse-header {
    padding-left: 0px !important;
    height: 56px;

    .panel-title {
      width: 420px;
      height: 56px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .status {
        font-size: 14px;
        color: #606E83;

        img {
          width: 8px;
          height: 5px;
          margin-left: 10px;
          vertical-align: super;
        }
      }

      .seled {
        color: #198EF8;
      }
    }
  }

  /deep/ .ivu-collapse {
    border: none !important
  }

  /deep/ .ivu-collapse-content {
    padding: 0 0px;
    width: 95%;
    text-overflow(1);

    .section-focus {
      background: #E5F4FF;
    }

    .section {
      height: 46px;
      line-height: 46px;

      .ivu-checkbox-wrapper {
        width: 100%
      }

      .ivu-checkbox {
        margin-right: 6px;
        margin-left: 24px;
      }

      .seled {
        color: #6A7487;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
</style>
