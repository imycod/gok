<template>
  <div>
    <intro-class-info></intro-class-info>
  </div>
</template>

<script>
import IntroClassInfo from "./components/intro-class-info.vue"

/**
 * 不同班课状态对应的参数值
 */
const STATUS_OBJ = {
  doing: {value: 'doing', name: '教学中', activeFlag: 1, enterFlag: 1},
  finish: {value: 'finish', name: '结课', activeFlag: 0, enterFlag: 1},
  forbid: {value: 'forbid', name: '结课并禁止访问', activeFlag: 0, enterFlag: 0}
};
/**
 * 根据标识获取状态
 */
const getClassStatus = (activeFlag, enterFlag) => {
  let status = '';
  for (let key in STATUS_OBJ) {
    if (STATUS_OBJ[key].activeFlag === activeFlag && STATUS_OBJ[key].enterFlag === enterFlag) status = key;
  }
  return status;
};
export default {
  name: "Introduction",
  components:{
    IntroClassInfo
  },
  data() {
    return {
      classInfo: {},
      classCodeStatus: 1,
      assistant: '', // 助教
      classStatus: 0,
      editName: '',
      editNameStatus: false,
    };
  },

  methods: {
    // 获取基本信息
    getClassCourseInfo() {
      const params = {
        classId: this.$route.query.classId
      };
      this.$one.uc.http.post(this.$API.TAC.classCourseInfo, {data: params}).then(res => {
        const data = res.data;
        this.classStatus = getClassStatus(data.activeFlag, data.enterFlag);
        this.classCodeStatus = data.classCodeFlag;
        if (data.type === CLASS_TYPES.OPEN_COURSE.value) this.getOpenCourseSetting();
        this.editName = data.className;
        this.assistant = data.assistant.join('、');
        this.classInfo = data;
        this.classInfo.imageUrl || (this.classInfo.imageUrl = defaultClassImg); // 设置默认课程图片
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

</style>
