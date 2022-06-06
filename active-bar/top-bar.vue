<template>
  <div class="topbar-container">
    <div class="item"
         v-for="(item,index) in topbar"
         :key="item.name"
         @click="choseTopbar(index)"
         :class="active===index ? 'active':''">
      <p
          @mouseover="(e)=>mouseover(e,index)"
          @mousedown="(e)=>mousedown(e,index)"
      >{{ item.name }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    topbar: { // top栏数组
      type: Array
    },
    curTab: { // 当前点击tab
      type: Number
    },
    gokManagerFlag: { // 1：国科管理员(国科授权的授权者),反之
      type: Number
    }
  },
  data() {
    return {
      active: '', // 当前触发tab的index
    };
  },
  watch: {
    curTab(newVal, oldVal) {
      this.active = newVal;
    }
  },
  mounted() {
    this.active = this.curTab;
  },

  methods: {
    choseTopbar(index) {
      this.active = index;
      this.$emit('choseTopTab', this.active);
    },
    mousedown(e, index) {
      e.stopPropagation();
      e.target.classList.remove('hover');
    },
    mouseover(e, index) {
      // 移除其他的active
      let plist = document.querySelectorAll('.item p');
      for (let i = 0; i < plist.length; i++) {
        plist[i].classList.remove('hover');
      }
      if (this.active === index) {
        e.target.classList.remove('hover');
      } else {
        e.target.classList.add('hover');
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.topbar-container
  display flex
  height: 32px + 16px + 16px;
  align-items center

  .item
    width: 64px;
    height: 32px;
    margin-left 40px
    line-height: 32px;
    text-align: center;

    p
      font-size: 16px;
      font-weight: 500;

  .hover
    cursor pointer
    color #333

  .active
    cursor pointer
    width: 96px;
    height: 32px;
    color: #FFFFFF;
    background #FE8836
    border-radius: 1000px 1000px 1000px 1000px;
</style>
