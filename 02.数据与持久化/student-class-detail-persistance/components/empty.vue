<template>
  <!-- 首页 空状态 -->
  <div class="empty-container column">
    <img :src="typeHandle" alt="">
    <div class="text m-t-20">
      {{ text }}
    </div>
  </div>
</template>
<script>

import {icon} from "../import-loader.js";

export default {
  name: 'empty',
  props: {
    text: {
      type: String,
      required: false,
      default: '空空如也~'
    },
    type: {
      type: String,
      required: false,
      default: 'courseware'
    }
  },
  computed: {
    typeHandle() {
      switch (this.type) {
        case 'l':
          return icon.classTeaIcon;
          break;
        case 'r':
          return icon.coursewareIcon;
          break;
        default:
          break;
      }

    }
  },
  data() {
    return {
      icon
    };
  }
};
</script>
<style lang="stylus" scoped>
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin: 10px 0;

  img {
    width: 128px;
    height: 90px;
    margin-right: 14px;
  }

  .text {
    .btn {
      background-color: #FE8836;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      width: 74px;
      height: 22px;
      font-size: 14px;
      margin-top: 8px;
      cursor: pointer;
    }
  }
}
</style>
