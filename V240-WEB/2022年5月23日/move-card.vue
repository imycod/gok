<template>
  <div class="chapter">
    <Collapse
        simple
        v-model="collapseIndex"
    >
      <Panel
          :name='item.chapterId'
          v-for="(item,index) in chapterList"
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
          <RadioGroup class="group" v-model='chooseChapterId'  @on-change="clickSection(chooseChapterId)">
            <div class="section" :class="chooseChapterId===item_s.id && 'section-focus' " v-for="(item_s,index_s) in item.chapterDetailEntityList" :key="index_s" >
              <Radio :label="item_s.id" >
                <span class="seled">{{ index + 1 }}.{{ index_s + 1 }}  {{ item_s.name }}</span>
              </Radio>
            </div>
          </RadioGroup>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
export default {
  name: 'move-card',
  data() {
    return {
      collapseIndex: [],
      chapterList: [],
      triangleDownIcon: 'https://gok-static.goktech.cn/edu/images/public/triangle-down.svg',
      triangleTopIcon: 'https://gok-static.goktech.cn/edu/images/public/triangle-up.svg',
      // role: null, // 0学生 1教师 2助教
      classId: '',
      courseId: '',
      chooseChapterId:''
    };
  },
  mounted() {
    this.classId = this.$route.query.classId;
    this.courseId = this.$route.query.courseId; // 课程id
    // this.role = Number(this.PRO_CLASS_JOIN); // 0学生,1教师，3资料库(自定义)
    this.getChapterList(this.courseId);
  },
  methods: {
    // 点击右侧的 item
    clickSection(id) {
      this.$store.commit('classCourse/chooseChapterId',{value:id})
    },
    // 获取章节列表
    getChapterList(courseId) {
      const data = {
        courseId: courseId
      };
      this.$one.uc.http.post(this.$API.KB.getChapterListToCourseId, {data}).then(res => {
        // console.log('章节的列表：',res)
        this.chapterList = res.data;
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
      let newchar = '';
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
    }
  }
};
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
    .section-focus {
      background: #E5F4FF;
    }
    .group{
      width: 100% !important;
    }
    .section {
      height: 46px;
      line-height: 46px;
      text-overflow(1);

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
