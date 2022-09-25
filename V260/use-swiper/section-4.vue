<template>
  <div class="container" v-if="list.length">
    <div class="content">
      <div v-scrollReveal style="text-align: center">
        <div class="title">合作院校团队</div>
        <p class="sub">School-enterprise cooperation achievements case</p>
      </div>
      <div class="swiper-container4">
        <div class="swiper-wrapper">
          <div class="swiper-slide cp hvr-shadow" v-for="(item,index) in list" :key="index">
            <img class="img" :src="item.logoUrl" alt="">
            <div class="inner">
              <div class="title">{{item.name}}</div>
              <p class="sub">{{item.remark}}</p>
              <div class="sub-title" v-if="item.directions.length">团队研究方向</div>
              <div class="tags">
                <Tag class="tag" v-for="(item,index) in item.directions.slice(0,5)" :key="index">{{ item }}</Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Swiper from "swiper";
import {teams} from "@api/cooperation.js"
export default {
  name: "section-4",
  data() {
    return {
      swiper: null,
      list: [
        {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },    {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },  {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },  {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },  {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },  {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },  {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },  {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },  {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },  {
          name: "第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官",
          remark:'第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官第四届“绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官绽放杯”5G应用征集大赛福建区域赛圆满收官',
          logoUrl: "https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/banner/cooperation.png",
          directions: ["硬件开发", "运营方审核通过", "定向发送", "智能推荐", "大屏可视化"]
        },
      ]
    };
  },
  created() {
    // this.getDetail()
  },
  mounted() {
  },
  methods: {
    async getDetail(){
      const res = await teams();
      if (res.status===200){
        this.list=res.data
        this.$nextTick(()=>{
           this.initSwiper();
        })
        console.log('getDetail teams section-4',res.data);
      } else{
        console.error('getDetail teams resp get is error');
      }
    },
    initSwiper() {
      this.swiper = new Swiper(".swiper-container4", {
        // autoplay: true,//可选选项，自动滑动
        // loop:true,
        slidesPerView: 4,
        spaceBetween: 40,
        slidesOffsetBefore:0,
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./common.less";

.container {
  width: 100%;
  height: calc(48px + 18px + 686px);
  margin-top: 70px;
  overflow-x: hidden;
  .content {
    width: calc(330px + 990px);
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    position: relative;

    .swiper-container4 {
      margin-top: 50px;
      position: relative;
      width: 100%;
      .swiper-wrapper {

        .swiper-slide {

          width: 330px !important;
          height: 580px;
          background: #FFFFFF;
          box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.08);
          border-radius: 4px 4px 4px 4px;
          .img{
            width: 100%;
            object-fit: cover;
            height: 287px;
            border-radius: 0px 0px 0px 0px;
            vertical-align: bottom;
          }
          .inner{
            width: 100%;
            background: #FFFFFF;
            box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.08);
            border-radius: 4px 4px 4px 4px;
            padding-left: 21px;
            padding-right: 27px;
            padding-top: 16px;
            box-sizing: border-box;

            .title{
              font-size: 18px;
              font-family: PingFang SC-Bold, PingFang SC;
              font-weight: bold;
              color: #101010;
              .g-text-overflow(2);
            }


            .sub{
              margin-top: 9px;
              font-size: 14px;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #666666;
              .g-text-overflow(3);
            }
            .sub-title{
              margin-top: 21px;
              font-size: 16px;
              font-family: Source Han Sans CN-Medium, Source Han Sans CN;
              font-weight: 500;
              color: #000000;
            }
            .tags{
              margin-top: 11px;
              .tag{
                background: #F6F6FD !important;
                border-radius: 4px 4px 4px 4px;
                height: 32px;
                line-height: 32px;
                margin-right: 20px;
                margin-bottom: 10px;
                /deep/ .ivu-tag-text{
                  font-size: 14px;
                  font-family: PingFang SC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #3734A9;
                }
                &:nth-last-child(1){
                  margin-right: 0px;
                }
              }
            }

          }
        }
      }
    }
  }
}
</style>