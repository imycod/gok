<template>
  <div class="carousel">
    <div class="carousel__nav">
<!--        <span id="moveLeft" class="carousel__arrow">-->
<!--          <svg class="carousel__icon" width="24" height="24" viewBox="0 0 24 24">-->
<!--            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>-->
<!--          </svg>-->
<!--        </span>-->
<!--        <span id="moveRight" class="carousel__arrow">-->
<!--          <svg class="carousel__icon" width="24" height="24" viewBox="0 0 24 24">-->
<!--            <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>-->
<!--          </svg>-->
<!--        </span>-->
      <span class="dot cp" v-for="(item,index) in list" :key="index" @click="handleDot(index)"></span>
    </div>
    <div :class="`carousel-item carousel-item--${index+1} cp`" @click="handleClick(item)" v-for="(item,index) in list" :key="item.id">
      <div class="carousel-item__image">
        <img class="img" v-image-err="item.imgUrls[0]" alt="">
      </div>
      <div class="carousel-item__info ">
        <div class="carousel-item__container">
          <h1 class="carousel-item__title">{{ item.name }}</h1>
          <p class="carousel-item__description">{{ item.remark }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// dom7 尽量不要用这个依赖，因为在首页和当前组件公用的是swiper，所以引用此可以正常执行
import { $ } from "dom7/dist/dom7.modular";
import Swiper from "swiper"
export default {
  name: "index",
  props:['list'],
  data() {
    return {
      swiper:null,
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleDot(index){
      // dom7 尽量不要用这个依赖，因为在首页和当前组件公用的是swiper，所以引用此可以正常执行
      $(".carousel-item").each((idx,dom)=> $(dom).removeClass('active'))
      $(".dot").each((idx,dom)=> $(dom).removeClass('dot__active'))
      $(".carousel-item").eq(index).addClass("active");
      $(".dot").eq(index).addClass("dot__active");
    },
    handleClick(item){
      // todo... 点击合作成果案例要干啥？

    },

    init() {
      $(".carousel-item").eq(0).addClass("active");
      $(".dot").eq(0).addClass("dot__active");
    }
  }
};
</script>

<style src="./index.css" scoped></style>