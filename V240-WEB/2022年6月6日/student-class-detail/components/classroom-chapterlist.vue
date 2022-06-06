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
            <div v-for="(child,childIndex) in item.chapterDetailEntityList" :key="child.id">
              <span class="sub-title" :title="child.name">
                {{ index + 1 }}.{{ childIndex + 1 }} {{ child.name }}
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </Collapse>
  </div>
</template>
<script>
import {icon} from "../import-loader.js";
import empty from "./empty.vue";

export default {
  name: "classroom-charpterlist",
  props: ['isChapterList', 'chapterLists'],
  components: {
    empty
  },
  data() {
    return {
      collpase: [],
      active: 0,
      icon,
    };
  },
  methods: {
    // 选中节-教师/资料库
    choseSection(itemtwo, index, indextwo, itemData) {
      // >>> syh：文件上传参数补充
      this.activeMenu.chapterId = this.chapterCatalogue[index].chapterId;
      this.activeMenu.chapterName = this.chapterCatalogue[index].name;
      this.activeMenu.sectionId = itemData.id;
      this.activeMenu.sectionName = itemData.name;
      // <<< syh：文件上传参数补充
      if (this.showCreateChapter === 2 && this.editActiveTwo === null) { // 不处于新建状态、编辑状态下相关操作
        this.active = index; // 当前触发第几章
        this.activeTwo = indextwo; // 当前触发第几节
        this.showCreate = false; // 隐藏创建弹框
        this.noshowSaveBtn = true; // 隐藏保存、取消按钮
        this.showCreateChapter = 2; // 创建状态修改
        // 新建节没保存，点击章节隐藏
        if (this.chapterCatalogue[this.active].chapterDetailEntityList.length > 0 && this.chapterCatalogue[this.active].chapterDetailEntityList[0].name === null) {
          this.chapterCatalogue[this.active].chapterDetailEntityList.splice(0, this.chapterCatalogue[this.active].chapterDetailEntityList.length);
        }
        if (this.editActiveTwo !== null) {
          this.hideChapter();
        }
        const curActiveIndex = {};
        curActiveIndex.active = this.active;
        curActiveIndex.activeTwo = this.activeTwo;
        curActiveIndex.activeTwoItem = itemtwo;
        this.$emit('transferInnerValue', curActiveIndex); // 刷新教学内容列表
      }
      this.getTrackingData(itemData.id, itemData.name);
    },
    // 选中章-教师/资料库
    choseChapter(index, itemData) {
      this.activeMenu = {
        chapterId: itemData.chapterId,
        chapterName: itemData.name,
        sectionId: '',
        sectionName: '',
      };
      if (this.showCreateChapter === 2 && this.editActive === null) { // 不处于新建状态、编辑状态下相关操作
        this.active = index; // 当前触发第几章
        this.activeTwo = null; // 当前触发第几节
        this.showCreate = false; // 隐藏创建弹框
        this.noshowSaveBtn = true; // 隐藏保存、取消按钮
        this.showCreateChapter = 2; // 创建状态修改
        // 新建节没保存，点击章节隐藏
        if (this.chapterCatalogue[this.active].chapterDetailEntityList.length > 0 && this.chapterCatalogue[this.active].chapterDetailEntityList[0].name === null) {
          this.chapterCatalogue[this.active].chapterDetailEntityList.splice(0, this.chapterCatalogue[this.active].chapterDetailEntityList.length);
        }
        const curActiveIndex = {};
        curActiveIndex.chapterChose = 1;
        this.getTrackingData(itemData.chapterId, itemData.name);
      }
    },
    // 埋点数据
    getTrackingData(recordId, recordName) {
      if (this.role === 3) return;
      let sectionId = '';
      if (this.activeTwo !== null) {
        sectionId = this.chapterCatalogue[this.active].chapterDetailEntityList[this.activeTwo].id;
      }
      const TENANT_INFO = this.$one.uc.token.getCurTenant();
      const params = {
        uid: this.$one.uc.token.getUserBaseInfo().uid,
        memberId: TENANT_INFO.memberId,
        memberName: TENANT_INFO.memberName,
        tenantId: TENANT_INFO.tenantId,
        ets: [{
          recordId: recordId,
          recordName: recordName,
          classId: this.$route.query.classId,
          courseId: this.courseIdVal,
          chapterId: this.chapterCatalogue[this.active].chapterId,
          subsectionId: sectionId,
          seq: 1,
          time: new Date().getTime() + 100, // 产生事件最短的时间是0.1s
          eventType: 'click',
          pageId: 'teaching_content_page',
          inTime: new Date().getTime(),
          current: this.$route.fullPath,
          extra: {}
        }]
      };
      this.$one.log.api.tracking(params).then(res => {
      });
    },
    // 阿拉伯数字转中文数字
    Arabia_To_SimplifiedChinese(Num) {
      for (let i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(',', ''); // 替换Num中的','
        Num = Num.replace(' ', ''); // 替换Num中的空格
      }
      if (isNaN(Num)) { // 验证输入的字符是否为数字
        // alert("请检查小写金额是否正确");
        return false;
      }
      // 字符处理完毕后开始转换，采用前后两部分分别转换
      const part = String(Num).split('.');
      var newchar = '';
      // 小数点前进行转化
      for (let i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
          // alert("位数过大，无法计算");
          return '';
        }
        // 若数量超过拾亿单位，提示
        let tmpnewchar = '';
        const perchar = part[0].charAt(i);
        switch (perchar) {
          case '0':
            tmpnewchar = '零' + tmpnewchar;
            break;
          case '1':
            tmpnewchar = '一' + tmpnewchar;
            break;
          case '2':
            tmpnewchar = '二' + tmpnewchar;
            break;
          case '3':
            tmpnewchar = '三' + tmpnewchar;
            break;
          case '4':
            tmpnewchar = '四' + tmpnewchar;
            break;
          case '5':
            tmpnewchar = '五' + tmpnewchar;
            break;
          case '6':
            tmpnewchar = '六' + tmpnewchar;
            break;
          case '7':
            tmpnewchar = '七' + tmpnewchar;
            break;
          case '8':
            tmpnewchar = '八' + tmpnewchar;
            break;
          case '9':
            tmpnewchar = '九' + tmpnewchar;
            break;
        }
        const tmpnewcharTwo = tmpnewchar;
        switch (part[0].length - i - 1) {
          case 0:
            tmpnewchar = tmpnewcharTwo;
            break;
          case 1:
            if (perchar !== 0) tmpnewchar = tmpnewchar + '十';
            break;
          case 2:
            if (perchar !== 0) tmpnewchar = tmpnewchar + '百';
            break;
          case 3:
            if (perchar !== 0) tmpnewchar = tmpnewchar + '千';
            break;
          case 4:
            tmpnewchar = tmpnewchar + '万';
            break;
          case 5:
            if (perchar !== 0) tmpnewchar = tmpnewchar + '十';
            break;
          case 6:
            if (perchar !== 0) tmpnewchar = tmpnewchar + '百';
            break;
          case 7:
            if (perchar !== 0) tmpnewchar = tmpnewchar + '千';
            break;
          case 8:
            tmpnewchar = tmpnewchar + '亿';
            break;
          case 9:
            tmpnewchar = tmpnewchar + '十';
            break;
        }
        newchar = tmpnewchar + newchar;
      }
      // 替换所有无用汉字，直到没有此类无用的数字为止
      while (newchar.search('零零') !== -1 || newchar.search('零亿') !== -1 || newchar.search('亿万') !== -1 || newchar.search('零万') !== -1) {
        newchar = newchar.replace('零亿', '亿');
        newchar = newchar.replace('亿万', '亿');
        newchar = newchar.replace('零万', '万');
        newchar = newchar.replace('零零', '零');
      }
      // 替换以“一十”开头的，为“十”
      if (newchar.indexOf('一十') === 0) {
        newchar = newchar.substr(1);
      }
      // 替换以“零”结尾的，为“”
      if (newchar.lastIndexOf('零') === newchar.length - 1) {
        newchar = newchar.substr(0, newchar.length - 1);
      }
      return newchar;
    },
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
}

.sub-title {
  font-size: 13px;
  font-weight: 500;
  color: #8590A6;
}

.chapter-list-container {
  width: 100%;
  height: 100%;

  .collapse {
    padding-left 20px
  }

  /deep/ .ivu-collapse > .ivu-collapse-item.ivu-collapse-item-active > .ivu-collapse-header {
    border-bottom: none;
    padding-left: 0;
    text-indent: 16px
  }

  /deep/ .ivu-collapse > .ivu-collapse-item {
    border-top: none;
  }

  /deep/ .ivu-collapse-header {
    position: relative;
    height: 56px;
    line-height: 56px;
  }

  /deep/ .ivu-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -7px;
    transform: rotate(90deg);
    color: #666666
  }

  /deep/ .ivu-collapse-item.ivu-collapse-item-active > .ivu-collapse-header > i {
    transform: rotate(270deg);
    color: #666666
  }

  /deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
    line-height: 40px;
    font-size: 14px;
    color: #333333;
  }

  /deep/ .ivu-collapse-content > .ivu-collapse-content-box {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
