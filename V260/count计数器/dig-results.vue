<template>
  <div class="container h-full">
    <div class="content h-full">
      <div class="top" v-scrollReveal>
        <h3>厦门产业数字化人才培养基地成果展示数据</h3>
        <p>数据更新时间：{{ reports.recentlyUpdateTime | formatDate }}</p>
      </div>
      <div class="grid w-full">
        <div class="item hvr-grow-shadow" v-for="(item,index) in reports.list" :key="index">
          <div class="l">
            <div class="flex-align-center">
              <h3 :id="'count' +index" ref="target">{{ item.value }}</h3>
              <h3 v-if="item.unit">{{item.unit}}</h3>
            </div>
            <p>{{ item.title }}</p>
          </div>
          <div class="r">
            <img class="img" v-image-err="item.imgUrl" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CountUp } from 'countup.js'

const list = Object.freeze([
  {
    name: "合作企业",
    value: "24",
    unit:'+',
    url:require('@/assets/images/home/result-1.png'),
  }, {
    name: "院校数量",
    value: "12",
    unit:'+',
    url:require('@/assets/images/home/result-2.png'),
  }, {
    name: "计划课程量",
    value: "60",
    unit:'+',
    url:require('@/assets/images/home/result-3.png'),
  }, {
    name: "岗位数量",
    value: "273",
    unit:'+',
    url:require('@/assets/images/home/result-4.png'),
  }, {
    name: "应届总人数",
    value: "6027",
    url:require('@/assets/images/home/result-5.png'),
  }, {
    name: "完成开发",
    value: "42",
    url:require('@/assets/images/home/result-6.png'),
    unit:'+',
  }, {
    name: "已完成就业学员",
    value: "1639",
    url:require('@/assets/images/home/result-7.png'),

  }, {
    name: "平台人员资源池",
    value: "3302",
    url:require('@/assets/images/home/result-8.png'),
  }, {
    name: "平台学习资源量",
    value: "9498",
    url:require('@/assets/images/home/result-9.png'),
  }
]);
export default {
  name: "dig-results",
  props:['reports'],
  data() {
    return {
      list
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.initObserver()
  },
  methods: {
    initObserver(){
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startCount(entry)
            observer.disconnect();
          }
        })
      })
      this.$refs.target.forEach(target=>{
        observer.observe(target)
      })
    },
    startCount(){
      this.list.forEach(
        (item, index) => {
          const domName = 'count' + index
          let demo = new CountUp(
            domName,
            item.value
          )
          if (!demo.error) {
            demo.start()
          } else {
            console.error(demo.error)
          }
        }
      )
    },
    init() {

      // list.forEach(item=>{
      //   if ( item.value.includes("+")) {
      //     let val = item.value.slice(-1);
      //     item.value=item.value.slice(0,item.value.length -1)
      //     item.unit=val
      //   }
      // })
    }
  }
};
</script>

<style lang="less" scoped>
@import "common.less";

.container {

  .content {
    width: calc(1440px - 110px - 120px);
    margin-left: auto;
    margin-right: auto;

    .top {
      h3 {
        margin-top: 57px;
        font-size: 32px;
        font-family: PingFang SC-Heavy, PingFang SC;
        font-weight: 800;
        color: #333333;
      }
    }

    .grid {
      margin-top: 45px;
      height: calc(110px * 3 + 24px * 2);
      box-sizing: border-box;
      display: grid;
      grid-template-columns:repeat(3, 1fr);
      grid-template-rows:repeat(3, 1fr);
      grid-column-gap: 47px;
      grid-row-gap: 24px;

      .item {
        width: 372px;
        height: 110px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        border: 1px solid #DDDDDD;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 18px;
        padding-left: 46px;
        padding-right: 14px;

        .l {
          h3 {
            font-size: 28px;
            font-family: PingFang SC-Heavy, PingFang SC;
            font-weight: 800;
            color: #333333;
          }

          p {
            font-size: 16px;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }

        .r {
          .img{
            width: 135px;
            height: 90px;
          }
        }
      }
    }
  }
}
</style>