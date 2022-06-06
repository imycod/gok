<template>
    <!-- 班课详情侧边栏 -->
    <div class="sidebar-wrap" v-if="!material">

      <div class="wrap-one">
        <div class="class-course-name">{{classCourseInfo.className}}</div>
        <!-- 如果是慕课，并且是学生 -->
        <div class="class-course-name open" v-if="classType === 1 && role==='0'">公开课</div>
        <!-- 学生不展示班课码 -->
        <div class="class-course-code" v-if="role==='1' || role==='2'">班课码：<span>{{classCourseInfo.classCode}}</span></div>
      </div>

      <div class="wrap-two">
        <p>任课老师：<span>{{classCourseInfo.teacher}}</span></p>
        <p v-if="assistant">班主任：<span>{{assistant}}</span></p>
        <p v-if="stuAssistant">助教：<span>{{stuAssistant}}</span></p>
        <p>学员人数：<span>{{classCourseInfo.studentNum}}</span></p>
      </div>

      <div class="wrap-three" v-if="tagList.length">
        <div class="oItem" v-for="(item,index) in tagList" :key="index" :class="item.tagName.length?'':'showTag'">
          <div class="oName">{{item.tagCategory}}</div>
          <div class="oTypez">
            <div class="oType sOrange" v-for="tag in item.tagName" :key="tag">{{tag}}</div>
          </div>
        </div>
      </div>

      <div class="sign-btn" @click="toSignDetail">
        <img :src="signIcon">
        <p>签到</p>
      </div>

      <!-- 展示最新的三条活动 -->
      <div class="noticez" v-if="noticeList.length">
        <div class="title">最新活动</div>
        <div class="notice" v-for="(item,index) in noticeList" :key="index">
          <div class="notice-info">
            <!-- 除通知外显示状态 -->
            <div class="status" v-if="item.type !==3 && item.status" :class="item.status === 2?'colorRed' : ''">{{item.status | activityStatus}}</div>
            <div class="type-time">{{item.type | activityType}}
              <!-- 今天 -->
              <span v-if="computeDayTime(item.updateTime)==='today'">今天 {{item.updateTime | hourminuteFormat}}</span>
              <!-- 昨天 -->
              <span v-else-if="computeDayTime(item.updateTime)==='yesterday'">昨天 {{item.updateTime | hourminuteFormat}}</span>
              <span v-else>{{item.updateTime | dateFormat}}</span></div>
          </div>
          <div class="notice-title">
            <!-- 通知： -->
            <div v-if="item.type ===3">
              <!-- 是否是图片的处理 -->
              <div v-if="item.content.indexOf('img') === -1" class="contentz">{{item.content | escape2Html}}</div>
              <div v-else>[图片][图片]</div>
            </div>
            <!-- 除通知外： -->
            <div v-if="item.type !==3">{{item.content}}</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="more-notice" @click="checkAllActivities">查看全部 ></div>
      </div>

    </div>
    <!-- 资料库侧边栏 -->
    <div class="sidebar-wrap" v-else>

      <div class="wrap-one">
        <div class="class-course-name">{{materialCourseInfo.name}}</div>
      </div>

      <div class="wrap-two">
        <p>管理员：<span>{{materialCourseInfo.managerName}}</span></p>
        <p>编辑组：<span>{{editors}}</span></p>
        <p>授权人数：<span>{{viewsNum}}</span></p>
        <p>引用：<span class="quoted">{{materialCourseInfo.quoteVal}}</span></p>
      </div>

      <!-- 2021-7-2 v160 产品说开课按钮和课程介绍位置对换下 -->
      <div class="start-class-btn" @click="showModal">
        <img :src="startClassIcon">
        <p>开课</p>
      </div>

      <div class="noticez mt-12">
        <div class="title">课程介绍</div>
        <div class="notice">
          <div class="notice-title pb-12">
            {{materialCourseInfo.brief}}
          </div>
        </div>
      </div>

    <!-- <div class="class-init-spin"  v-show="classInit">
      <Spin size="large" fix></Spin>
      <div class="des">课件搬运中...</div>
    </div> -->
      <!-- 开课弹出层 -->
      <Modal
        v-model="modalShow"
        title="开课"
        :loading="modalLoading"
        @on-cancel='onCancel'>
        <create-class-course
          v-if="modalShow"
          :id="materialCourseInfo.id"
          :name='materialCourseInfo.name'
          :initId='initId'
          :imgUrl='materialCourseInfo.imageUrl'
          :category='materialCourseInfo.category'
          :isModal='true'
          :sourceType='sourceFlag'
          @createCancel='onCancel'>
        </create-class-course>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>
<script>
import signIcon from '@/assets/images/class-course/sign.png'
import startClassIcon from '@/assets/images/class-course/start-class.png'
import CreateClassCourse from '@/view/material/course/create-class-course'; // 开课/创建班课组件
import { computeDayTime } from '@/utils/compute' // 判断是昨天、今天
export default {
  components: { CreateClassCourse },
  data () {
    return {
      signIcon,
      startClassIcon,
      noticeList: [], // 最新三条活动
      materialCourseInfo: {
        id: '',
        name: '',
        imageUrl: '',
        category: ''
      }, // 资料库的班课信息
      classCourseInfo: {}, // 班课详情的信息
      editors: '',
      viewsNum: '',
      assistant: '',
      stuAssistant: '',
      classType: 0, // 1为慕课，0为普通班课 --- 班课详情使用
      permissionGroupData: {}, // 权限判断数据
      sourceFlag: 0, // 是否是国科授权，0：不是/1:是
      modalShow: false,
      modalLoading: false,
      classInit: false,
      initId: '',
      computeDayTime: computeDayTime,
      tagList: [] // 行业type
    }
  },
  props: ['material', 'isUpdate', 'role'],
  watch: {
    isUpdate (newVal, old) {
      if (newVal) {
        this.initData();
      }
    }
  },

  mounted () {
    this.initData();
  },

  methods: {
    /**
     * 初始化数据
     */
    initData () {
      if (this.material) {
        // 资料库班课的信息
        this.getPermissionGroup()
        this.getMaterialCourseInfo()
      } else {
        // 班课详情的信息
        this.getClassCourseInfo()
      }
    },
    // 点击开课按钮
    showModal () {
      this.modalShow = true
      // this.classInit = true
      // const params = {
      //   courseId: this.materialCourseInfo.id
      // }
      // this.$one.uc.http.post(this.$API.KB.initClassCourse, {data: params}).then(res => {
      //   this.initId = res.data.copyCourseId
      //   this.classInit = false;
      //   if (this.initId) {
      //     this.modalShow = true
      //   }
      // })
      // this.modalShow = true
    },
    // 关闭弹出
    onCancel () {
      this.modalShow = false
      this.classInit = ''
    },
    /**
     * 跳转签到详情页
     */
    toSignDetail () {
      this.$router.push({
        path: '/class-course/sign/' + this.$route.query.classId + '/' + this.$route.query.courseId
      })
    },

    // 获取资料库--授权组、编辑组信息
    getPermissionGroup () {
      const params = {
        pocType: 0,
        pocid: this.$route.query.courseId
      }
      this.$one.uc.http.post(this.$API.TAC.permissionGroup, {data: params}).then(res => {
        this.permissionGroupData = res.data
        this.sourceFlag = res.data.sourceFlag
        this.$emit('receptSource', res.data.sourceFlag)
        this.viewsNum = res.data.viewers.length // 授权人数
        this.materialCourseInfo.managerName = res.data.managerName
        if (res.data.sourceFlag) { // 国科授权
          this.editors = res.data.editorArr
          this.materialCourseInfo.quoteVal = res.data.quote
        } else {
          if (res.data.editors) {
            let str = ''
            for (var i = 0; i < res.data.editors.length; i++) {
              str += res.data.editors[i].name + '、'
            }
            str = str.substring(0, str.length - 1) // 取出去掉最后一个'、'
            this.editors = str
          }
        }
      })
    },

    // 获取课程信息-资料库
    getMaterialCourseInfo () {
      const params = {
        id: this.$route.query.courseId
      }
      this.$one.uc.http.post(this.$API.TAC.getCourseInfo, {data: params}).then(res => {
        this.$emit('update', 0, res.data.name) // 传课程名给父组件设置面包屑
        this.$emit('recept', res.data.partitionId, res.data.partitionName) // 传分区名、分区Id给父组件设置面包屑
        this.materialCourseInfo = res.data
        this.materialCourseInfo.managerName = res.data.admin
        this.materialCourseInfo.quoteVal = res.data.quote
      })
    },

    // 获取班课详情的信息
    getClassCourseInfo () {
      const params = {
        classId: this.$route.query.classId
      }
      this.$one.uc.http.post(this.$API.TAC.classCourseInfo, {data: params}).then(res => {
        this.$emit('update', 0, res.data.className)
        this.$emit('recept', res.data.type)
        this.$emit('transCourseName', res.data.courseName)
        this.classCourseInfo = res.data
        this.tagList = res.data.tagsList
        this.classType = this.classCourseInfo.type
        this.noticeList = res.data.classActivityRes
        // 班主任
        this.assistant = this.handleAssistantData(res.data.assistant)
        // 助教
        this.stuAssistant = this.handleAssistantData(res.data.stuAssistant)
      })
    },

    // 班主任/助教数据处理
    handleAssistantData (val) {
      if (val) {
        let str = ''
        for (var i = 0; i < val.length; i++) {
          str += val[i] + '、'
        }
        str = str.substring(0, str.length - 1) // 取出去掉最后一个'、'
        return str
      }
    },

    // 点击查看全部活动通知
    checkAllActivities () {
      this.$emit('choseTopTab', 2)
    }
  },

  filters: {
    // 活动类型
    activityType (type) {
      switch (type) {
        case 0:
          return '作业';
        case 1:
          return '头脑风暴';
        case 2:
          return '测试';
        case 3:
          return '通知';
        case 13:
          return '投票问卷';
      }
    },

    // 活动状态
    activityStatus (status) {
      switch (status) {
        case 1:
          return '进行中'
        case 2:
          return '已结束'
      }
    },

    // 去掉HTML样式
    escape2Html (str) {
      str = str.replace(/(\n)/g, '');
      str = str.replace(/(\t)/g, '');
      str = str.replace(/(\r)/g, '');
      str = str.replace(/<\/?[^>]*>/g, '');
      str = str.replace(/\s*/g, '');
      return str
    }
  }
}
</script>
<style lang="stylus" scoped>
/deep/ .ivu-modal-footer {
  border-top:0px solid #e8eaec !important
}
.sidebar-wrap{
    width:220px;
    margin-right:12px;
    .wrap-one{
      padding: 24px 12px 17px;
      background: #505359;
      color: #FFFFFF;
      border-radius: 3px 3px 0px 0px;
      // 班课进入的
      .class-course-name{
        font-size:17px;
        line-height:24px;
        font-weight: 700;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space: nowrap;
      }
      .open {
        font-size: 12px;
      }
      .class-course-code{
        margin-top:4px;
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
      }
    }
    .wrap-two{
      padding: 10px 0 10px 12px;
      background: #FFFFFF;
      box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.16);
      border-radius: 0px 0px 3px 3px;
      color: #7E8598;
      line-height: 18px;
      font-size: 12px;
    }
    .wrap-three {
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.16);
      padding: 20px
      height: auto;
      margin-top: 12px
      .oItem {
        display: inline-block;
        margin-bottom: 6px
        &:last-child {
          margin-bottom: 0px
        }
        .oName {
          float: left;
          font-size: 13px;
          color: #7E8598;
          font-weight: 500;
          margin-right: 8px;
          height: 22px;
          line-height: 22px;
        }
        .oTypez {
          display: inline-block;
          float: left;
          width: 145px;
        }
        .oType {
          float: left;
          height: 22px;
          padding: 0 6px;
          border: 1px solid #0091FF;
          border-radius: 2px;
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: #0091FF;
          font-weight: 500;
          line-height: 22px;
          margin-right: 6px;
          margin-bottom: 4px
        }
        .sOrange {
          color: #FA6400;
          border: 1px solid #FA6400;
        }
      }
      .showTag {
        display: none;
      }
    }
    .sign-btn,.start-class-btn{
      margin: 12px 0;
      height: 47px;
      background: #bde3ff;
      box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.16);
      border-radius: 3px;
      color: #19232C;
      font-size: 15px;
      padding: 8px 0 9px 12px;
      display: flex;
      cursor: pointer;
      img{
        width: 30px;
        height: 30px;
        display: inline-block;
      }
      p{
        margin-left: 8px;
        font-weight: 500;
        margin-top:3px;
      }
    }
    .start-class-btn{
      background: #FFD9AD;
    }
    .noticez{
        color: #7E8598;
        background: #FFFFFF;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.16);
        border-radius: 3px;
        .title{
          height:36px;
          border-bottom: 1px solid #E9E9E9;
          padding-left: 12px;
          line-height: 36px;
          font-size: 13px;
        }
        .notice{
          padding: 12px 12px 0 12px;
          font-size: 12px;
          .notice-info{
            display:flex;
            .status {
              margin-right:6px;
              font-size:12px;
              color: #057F16;
            }
            .colorRed{
              color: #E02020;
            }
          }
          .notice-title{
            margin-top: 4px;
            color: #333333;
            line-height: 17px;
          }
          .line{
            margin-top: 12px;
            height: 1px;
            background-color :#E9E9E9;
          }
        }
    }
    .more-notice{
      font-size: 12px;
      color: #0090F7;
      padding: 12px 0 12px 148px;
      cursor:pointer;
    }
    .quoted{
      background:rgba(25,142,248,0.16);
      border-radius:2px;
      padding: 0px 10px;
    }
    .mt-12{
      margin-top: 12px;
    }
    .pb-12{
      position: relative;
      max-height: 580px;
      padding-bottom: 12px;
      overflow-y: hidden;
    }
    .pb-12::after{
      content: '...';
      display: inline-block;
      position: absolute;
      right: 2px;
      top: 564px;
      width: 14px;
      height: 14px;
      line-height: 14px;
      background-color: #fff;
      font-size: 14px;
    }
}
.class-init-spin{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .des{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-top: 80px;
    z-index: 10;
    color: #2d8cf0;
  }
}
</style>
