<template>
  <div class="container bd">
    <p class="section-title">班课信息</p>
    <div class="row">
      <Upload ref="upload"
                action="/"
                :disabled="!canEdit"
                :show-upload-list="false"
                accept=".jpg,.jpeg,.png"
                :before-upload="beforeUpload">
        <div class="class-img-container upload-hover">
          <!-- <img class="class-img" :src="classInfo.imageUrl"> -->
          <Avatar class="class-img" :src="classInfo.imageUrl"  v-image-err.child.class="classInfo.imageUrl"/>
          <div class="upload-icon" v-show="canEdit"><Icon type="ios-camera" size="25" /></div>
          <p class="img-des" v-show="canEdit">支持jpg、jpeg、png格式，文件小于4MB，建议600*400像素。</p>
        </div>
        </Upload>
    </div>
    <div class="row">
      <span class="row-title">班课名称</span>
      <div class="row-body">
        <p v-show="!editNameStatus">{{classInfo.className}}</p>
        <Input  v-show="editNameStatus" v-model="editName" maxlength="100" style="width: 350px"/>
        <div class="edit-name-container" v-show="canEdit">
          <span class="btn-edit" @click="editClassName" v-if="!editNameStatus"></span>
          <span class="btn-edit-ok" v-click-loading="{callback: () => editClassNameOk(), icon: false}" v-if="editNameStatus"></span>
          <span class="btn-edit-cancel" @click="editClassNameCancel" v-if="editNameStatus"></span>
      </div>
      </div>
    </div>
    <div class="row">
      <span class="row-title">班课码</span>
      <div class="row-body">
        {{classInfo.classCode}}
        <span class="row-btn copy-btn" v-if="classInfo.classCode" v-clipboard:copy="classInfo.classCode" v-clipboard:success="copySuccess">复制</span>
      </div>
    </div>
    <div class="row">
      <span class="row-title">任课老师</span>
      <div class="row-body">{{classInfo.teacher}}</div>
    </div>
    <div class="row" v-if="assistant">
      <span class="row-title">班主任</span>
      <div class="row-body">{{assistant}}</div>
    </div>
    <div class="row">
      <span class="row-title">学员人数</span>
      <div class="row-body">{{classInfo.studentNum}}</div>
    </div>
    <!-- v210: 空班课：空课程-基本信息-关联课程一栏不显示（教师端、学生端均不显示） -->
    <div class="row" v-if="classInfo.courseName">
      <span class="row-title">关联课程</span>
      <div class="row-body" @click="toCourseDetail">
        <div class="course-card">
          <!-- <img :src="classInfo.courseImage"> -->
          <Avatar class="img"  :src="classInfo.courseImage"  v-image-err.child.course="classInfo.courseImage"/>
          <div class="course-main">
            <p class="course-title">{{classInfo.courseName}}</p>
            <p class="course-des">管理员：{{classInfo.courseCreator}}</p>
          </div>
        </div>
      </div>
    </div>
    <p class="section-title">班课设置</p>
    <div class="row">
      <span class="row-title">班课状态</span>
      <div class="row-body">
        <Select v-model="classStatus" style="width: 350px" @on-change="reviseClassStatus">
          <Option v-for="item in classStatusObj" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
        <Button class="row-btn" type="error" v-if="canDeleteClass" @click="deleteClassCheck">删除班课</Button>
      </div>
    </div>
    <div class="row">
      <span class="row-title">班课码</span>
      <div class="row-body">
        <i-switch size="large" :true-color="'#198EF8'" :true-value="1" :false-value="0" :loading="classCodeLoading" :disabled="isGokClass || !canEdit" v-model="classCodeStatus" @on-change="reviseClassCodeStatus">
          <span slot="open">启用</span>
          <span slot="close">停用</span>
        </i-switch>
      </div>
    </div>
    <div v-if="isOpenCourse">
      <p class="section-title">公开课设置</p>
      <div class="row">
        <span class="row-title">开课时间</span>
        <div class="row-body">
          <DatePicker type="date" :disabled="!canEdit" placeholder="选择开课日期" format="yyyy-MM-dd" v-model="openCourseTime" @on-change="openCourseTimeChange"  style="width: 350px"></DatePicker>
          <span v-if="openCourseTimeEdit">
            <Button class="row-btn" type="primary" v-click-loading="{callback: () => reviseOpenCourseTimeOk()}">保存</Button>
            <Button class="row-btn" type="error" @click="reviseOpenCourseTimeCancel">取消</Button>
          </span>
        </div>
      </div>
      <div class="row">
        <span class="row-title">学习报名</span>
        <div class="row-body">
          <i-switch size="large" :disabled="!canEdit" :true-color="'#198EF8'" :true-value="1" :false-value="0" :loading="openCourseStatusLoading" v-model="openCourseStatus" @on-change="reviseOpenCourseStatus">
            <span slot="open">允许</span>
            <span slot="close">禁止</span>
          </i-switch>
        </div>
      </div>
    </div>
    <!-- 截取图片弹框 -->
    <cropper-pic v-if="showCropperPic" :fileName="fileName" :fileImg="fileImg" @refreshContent="getRefreshContent"></cropper-pic>
    <!-- 删除班课 -->
    <delete-class v-if="showModal === 'deleteClass'" :classId="classInfo.id" :className="classInfo.className" @cancel="toggleModal"></delete-class>
  </div>
</template>

<script>
/**
 * 1.添加班课状态，班课的【启用/停用/删除】功能 * V153 * 施义煌 * 2021-05-20
 * 2.添加班课进入权限功能 * V153 * 施义煌 * 2021-05-20
 * 3.修改预览方式为自定义指令【v-preview】 * 160 * 施义煌 * 2021-06-22
 * 4.基于原有组件重写该组件 * V210 * 施义煌 * 2021-12-06
 */
import CropperPic from '@/components/cropper-pic.vue'
import FinishClass from '@c/class-course/finish-class' // 结束班课
import DeleteClass from '@c/class-course/delete-class' // 删除班课
import CLASS_STATUS from '@e/class-status' // 班课状态
import CLASS_ENTER_STATUS from '@e/class-enter-status' // 是否允许进入班课
import CLASS_TYPES from '@e/class-types' // 班课类型
import { COURSE_DETAIL_ROUTE } from '@_c/page.js'
import dayjs from 'dayjs'
import { CLASS_OR_MATERIAL_CHECK } from '@_c/check-api.js' // 权限验证接口
/**
 * 不同班课状态对应的参数值
 */
const STATUS_OBJ = {
  doing: { value: 'doing', name: '教学中', activeFlag: 1, enterFlag: 1 },
  finish: { value: 'finish', name: '结课', activeFlag: 0, enterFlag: 1 },
  forbid: { value: 'forbid', name: '结课并禁止访问', activeFlag: 0, enterFlag: 0 }
}
/**
 * 根据标识获取状态
 */
const getClassStatus = (activeFlag, enterFlag) => {
  let status = '';
  for (let key in STATUS_OBJ) {
    if (STATUS_OBJ[key].activeFlag === activeFlag && STATUS_OBJ[key].enterFlag === enterFlag) status = key;
  }
  return status
}
export default {
  components: {
    CropperPic,
    FinishClass,
    DeleteClass
  },
  inject: ['PRO_CLASS_STATUS', 'PRO_CLASS_JOIN'],
  data () {
    return {
      classId: '',
      deleteLoading: false,
      classStatus: Object.freeze(CLASS_STATUS),
      classEnterStatus: Object.freeze(CLASS_ENTER_STATUS),
      showModal: '', // 需要展示的弹窗
      classInfo: {}, // 基本信息对象
      showEdit: false, // 控制班课名称编辑样式
      role: '',
      assistant: '', // 助教
      fileName: '', // 上传的文件名
      fileImg: '', // 上传的图片
      showCropperPic: false, // 显示截图弹框
      classCodeStatus: 1,
      classCodeLoading: false,
      classStatus: 0,
      classStatusObj: Object.freeze(STATUS_OBJ), // 状态下拉框
      openCourseTime: '',
      openCourseTimeEdit: false,
      openCourseStatus: 0,
      openCourseStatusLoading: false,
      openCourseJson: '',
      editNameStatus: false,
      editName: ''
    }
  },
  computed: {
    /**
     * 是否是公开课
     */
    isOpenCourse () {
      return this.classInfo.type === CLASS_TYPES.OPEN_COURSE.value;
    },
    /**
     * 是否是机构班课
     */
    isGokClass () {
      return Boolean(this.classInfo.gokFlag);
    },
    /**
     * 是否可以删除班课
     */
    canDeleteClass () {
      const curStatus = getClassStatus(this.classInfo.activeFlag, this.classInfo.enterFlag),
            deleteStatus = ['finish', 'forbid'];
      return deleteStatus.includes(curStatus) && this.classInfo.id && this.classInfo.creatorId === this.$one.uc.token.getCurTenant().memberId;
    },
    /**
     * 是否可编辑
     */
    canEdit () {
      const curStatus = getClassStatus(this.classInfo.activeFlag, this.classInfo.enterFlag),
            notEditStatus = ['finish', 'forbid'];
      return !notEditStatus.includes(curStatus);
    },
    /**
     * 班课状态转换
     */
    classStatusText () {
      for (const key in CLASS_STATUS) {
        if (CLASS_STATUS[key].value === this.classInfo.activeFlag) {
          return CLASS_STATUS[key].name;
        }
      }
    }
  },
  mounted () {
    this.role = String(this.PRO_CLASS_JOIN) // 这门课的身份：0学生，1教师，2助教
    this.getClassCourseInfo();
    this.classId = this.$route.query.classId;
  },
  methods: {
    // 获取基本信息
    getClassCourseInfo () {
      const params = {
        classId: this.$route.query.classId
      }
      this.$one.uc.http.post(this.$API.TAC.classCourseInfo, { data: params }).then(res => {
        const data = res.data;
        this.classStatus = getClassStatus(data.activeFlag, data.enterFlag);
        this.classCodeStatus = data.classCodeFlag;
        if (data.type === CLASS_TYPES.OPEN_COURSE.value) this.getOpenCourseSetting();
        this.editName = data.className;
        this.assistant = data.assistant.join('、');

        this.classInfo = data;
        this.classInfo.imageUrl || (this.classInfo.imageUrl = defaultClassImg); // 设置默认课程图片
      })
    },
    // 图片上传前
    beforeUpload (file) {
      if (file.size > 4194304) { // 4M = 1024 * 1024 * 4 = 4194304
        this.$Message.destroy();
        this.$Message.error('文件大小不能大于4M');
        return false;
      }
      this.fileName = file.name
      const data = window.URL.createObjectURL(new Blob([file]));
      this.fileImg = data
      this.showCropperPic = true
      return false;
    },
    // 接收图片截取返回值
    getRefreshContent (msg) {
      this.$refs.upload.clearFiles()
      if (msg) { // 上传成功
        this.classInfo.imageUrl = msg;
        // 更新图片后保存
        const params = {
          classId: this.$route.query.classId,
          imageUrl: this.classInfo.imageUrl
        }
        this.$one.uc.http.post(this.$API.TAC.editClassCourseInfo, { data: params }).then(res => {
          // console.log(res)
          if (res.status === 200) {
            // 不重新获取，因为上面已经展示了更新后的图片
            // this.getClassCourseInfo()
            this.$emit('update', 1)
          }
        })
      }
      this.showCropperPic = false
    },
    /**
     * 复制成功
     */
    copySuccess () {
      this.$Message.success('复制成功！');
    },
    /**
     * 模态框开关
     */
    toggleModal (name = '') {
      this.showModal = name;
    },
    /**
     * 是否允许进入班课的状态修改
     */
    enterStatusClass (value) {
      this.$Spin.show();
      const data = {
        enterFlag: value
      }
      this.$one.uc.http.put(this.$API.TAC.enterStatusClass(this.classInfo.id), {data}).then(res => {
        this.classInfo.enterFlag = value;
        this.$Message.success(res.data.message);
        this.$Spin.hide();
      }).catch(err => {
        this.classInfo.enterFlag = Boolean(!value);
        this.$Spin.hide();
      })
    },
    /**
     * V153 * 施义煌 * 2021-06-04
     */
    getStudentList () {
      const data = {
        classId: this.$route.query.classId,
        stuOrTeacher: 0,
        queryParam: ''
      }
      this.deleteLoading = true;
      this.$one.uc.http.post(this.$API.TAC.getMemberList, {data}).then(res => {
        this.deleteLoading = false;
        if (!res.data.length) {
          this.toggleModal('deleteClass');
        } else {
          this.$Modal.info({
            title: '提示',
            content: '<p style="color: #ed4014">当前班课内还有成员，无法删除</p>',
            okText: '我知道了'
          })
        }
      })
    },
    /**
     * 进入课程详情页
     * V210 * 施义煌 * 2021-12-06
     */
    toCourseDetail () {
      this.judgePermission()
    },

    // 点击关联课程的判断
    judgePermission () {
      const params = {
        type: 'course',
        dataId: this.classInfo.courseId
      }
      CLASS_OR_MATERIAL_CHECK(params).then(res => {
        const data = res.data;
        if (data.permissionGroup === 0 || data.permissionGroup === 1 || data.permissionGroup === 2) { // 0:授权组, 1:编辑组, 2:作者, -1:没权限
          COURSE_DETAIL_ROUTE(this.classInfo.courseId);
        } else {
          this.$Modal.info({
            title: '提示',
            content: '抱歉，没有访问权限'
          })
        }
      })
    },

    /**
     * 修改班课状态
     */
    reviseClassStatus (status) {
      const { activeFlag, enterFlag, name } = STATUS_OBJ[status],
            data = { activeFlag, enterFlag };
      this.$Modal.confirm({
        title: '班课状态变更',
        content: `<span style="color: #666">是否将班课状态变更为<span style="color: #ed4014">${name}</span>。</span>`,
        onOk: () => {
          this.$one.uc.http.put(this.$API.TAC.reviseClassStatus(this.classId), { data }).then(res => {
            this.$Message.success(res.data.message);
            window.location.href = window.location.href;
            // this.getClassCourseInfo();
          }).catch(err => {
            this.classStatus = getClassStatus(this.classInfo.activeFlag, this.classInfo.enterFlag);
          })
        },
        onCancel: () => {
          this.classStatus = getClassStatus(this.classInfo.activeFlag, this.classInfo.enterFlag);
        }
      })
    },
    /**
     * 修改班课码状态
     */
    reviseClassCodeStatus (status) {
      this.classCodeLoading = true;
      const data = { flag: status };
      this.$one.uc.http.put(this.$API.TAC.setClassCode(this.classId), { data }).then(res => {
        this.$Message.success(res.data.message);
        this.classCodeLoading = false;
        this.getClassCourseInfo();
      }).catch(err => {
        this.classCodeLoading = false;
        this.classCodeStatus = this.classInfo.classCodeFlag;
      })
    },
    /**
     * 获取公开课设置信息
     */
    getOpenCourseSetting () {
      this.$one.uc.http.get(this.$API.TAC.getOpenCourseSetting(this.classId), {}).then(res => {
        const data = res.data;
        this.openCourseJson = JSON.stringify(data);
        this.openCourseTime = dayjs(Number(data.openClassTime)).format('YYYY-MM-DD');
        this.openCourseStatus = data.status;
      })
    },
    /**
     * 公开课状态变化
     */
    reviseOpenCourseStatus (status) {
      this.reviseOpenCourseSetting('status', status);
    },
    reviseOpenCourseTimeOk () {
      return this.reviseOpenCourseSetting('time', this.openCourseTime.valueOf());
    },
    reviseOpenCourseTimeCancel () {
      this.openCourseTime = dayjs(Number(JSON.parse(this.openCourseJson).openClassTime)).format('YYYY-MM-DD');
      this.openCourseTimeEdit = false;
    },
    reviseOpenCourseSetting (type, value) {
      const data = {
        classId: this.classId
      }
      if (type === 'status') data.status = value;
      if (type === 'time') data.openClassTime = value;
      return this.$one.uc.http.post(this.$API.TAC.reviseOpenCourseSetting, { data }).then(res => {
        this.$Message.success(res.data.message);
        this.getOpenCourseSetting();
        this.openCourseTimeEdit = false;
      }).catch(err => {
        if (type === 'status') this.openCourseStatus = JSON.parse(this.openCourseJson).status;
        if (type === 'time') this.openCourseTime = dayjs(Number(JSON.parse(this.openCourseJson).openClassTime)).format('YYYY-MM-DD');
      })
    },
    openCourseTimeChange (value) {
      this.openCourseTimeEdit = true;
    },
    editClassName () {
      this.editNameStatus = true;
      this.editName = this.classInfo.className;
    },
    editClassNameOk () {
      const data = {
        classId: this.classId,
        className: this.editName
      }
      return this.$one.uc.http.post(this.$API.TAC.editClassCourseInfo, { data }).then(res => {
        this.getClassCourseInfo();
        this.$emit('update', 1, this.editName);
        this.editNameStatus = false;
      })
    },
    editClassNameCancel () {
      this.editNameStatus = false;
    },
    /**
     * 删除班课确认
     * 如果班课还有成员则不能删除班课
     */
    deleteClassCheck () {
      const data = {
        classId: this.classId,
        stuOrTeacher: 0,
        queryParam: ''
      }
      this.deleteLoading = true;
      this.$one.uc.http.post(this.$API.TAC.getMemberList, {data}).then(res => {
        this.deleteLoading = false;
        if (!res.data.length) {
          this.toggleModal('deleteClass');
        } else {
          this.$Modal.info({
            title: '提示',
            content: '<p style="color: #ed4014">当前班课内还有成员，无法删除</p>',
            okText: '我知道了'
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.container{
  padding: 30px 10px;
}
.section-title{
  position: relative;
  height: 36px;
  padding: 0 70px;
  line-height: 36px;
  font-size: 16px;
  font-weight: 500;
  color: #101010;
  &::before{
    content: '';
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 52px;
    width: 6px;
    height: 6px;
    margin-top: -3px;
    border-radius: 50%;
    background-color: #198EF8;
  }
}
.row{
  display: flex;
  min-height: 52px;
  max-width: 840px;
  padding: 10px 70px;
  .row-title{
    width: 70px;
    padding-right: 10px;
    text-align: right;
    font-size: 14px;
    font-weight: 400;
    color: #999;
  }
  .row-body{
    display: flex;
    flex: 1;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #101010;
  }
  .row-btn{
    margin-left: 10px;
  }
}
.class-img-container{
  position: relative;
  width: 150px;
  height: 100px;
  border-radius: 6px;
  cursor: pointer;
  .class-img{
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 6px;
  }
  .upload-icon{
    display: none;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .img-des{
    display: none;
    position: absolute;
    bottom: 0;
    right: -400px;
    width: 400px;
    padding-left: 10px;
  }
}
.upload-hover:hover{
  .upload-icon,
  .img-des{
    display: inline-block;
  }
}
.copy-btn{
  font-size: 14px;
  font-weight: 400;
  color: #198EF8;
  cursor: pointer;
}
.course-card{
  display: flex;
  width: 350px;
  height: 80px;
  padding: 10px;
  background: #F8F8F8;
  border-radius: 8px;
  cursor: pointer;
  img, .img{
    width: 92px;
    height: 60px;
    border-radius: 4px;
  }
  .course-main{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 10px;
    p{
      max-width: 230px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .course-title{
      font-size: 16px;
      font-weight: 400;
      color: #333;
    }
    .course-des{
      font-size: 12px;
      font-weight: 400;
      color: #666;
    }
  }
}
.edit-name-container{
  display: flex;
  align-items: center;
  span{
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 10px;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .btn-edit{
    margin-top: -10px;
    background-image: url('https://gok-static.goktech.cn/edu/icon/icon-edit-light.png');
  }
  .btn-edit-ok{
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABf0lEQVQ4EZWTv0/CUBDH7x6IC6CJwsCAC5MkLo4mDhqMOrk4uqmJq4srq4uDiXFxZNTopIaBP8KkmwsMDiCDoRNIz/vWvBaaItihvV+f773Xd48p8qRfL8oDGh6T0I6QFJFm4pa+6nOUuHN3L51RhK1Tdqqp91bvSoTPiMTY+PiXPWa5LRUz50652kfOF/DhpvuiHbfGgXhPV9QoraT3IOJ38jvPCEMSjcDAZuy57w3fJi8bZXEPeymTWDMD7/tkFliX/cDMj6GUGPxsQ8yVMDjBYq7lFgtH2ig7VqEnZexR2YR2amqnZ+trg1p+oXDa+fq4F6HtIK4G2ORoALawfC7nMofdjnstRPMhLPvRWvhJDIkqrQZJofVuu/e0lM8cmH5WfjvHw2CTmDBdSyigStq50m27dSJ3qOKbgXjUUNZgPPU0vWhOwY0/YWXAGsw2xjMqMM0HA9afRMy27qcxDbJ51IKB7wtgpjHbzHQTtx0LIocaew8QD26jLfrvdf4BSd2mYiRqnyUAAAAASUVORK5CYII=');
  }
  .btn-edit-cancel{
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABQUlEQVQ4EaVTsWrDMBC1RMhs/0A+IIV+RKEpyZjBU7u1Ll37Id2CwWRLJkM8JjSFfEShP+AfsOcMct8TEijXBBwqOOnu6d7d6SSpSIyiKG66rnsGPIGM3HaNda+UWmZZ9uMwuyhvlGU5bJrmA/YbRHtcrAZ2niTJe5qmR+7ZACS3bbtD5jtBOGuikkMcx1MGsZmYuS+ZEenrqo2UO/M38Etln60CoEEltyS9SLLW+hVYBfGjAsbGhkOz2ZzuQ5S6MeYBjXpEhg2FOrCZ9IM9GWDyVxXuz9HUFRr1RJA6lnno4PTRtef+E4MV1JCx2KmY3WWOqKPrvHJZRT3AGb/Qh5MAaNgWhLUnkAzsE32QAfb/v0b3tnNxhD5mTq5tIt82jnLow6IPfcmhbgPwTfNtw15A+GEuDe4t6HvymULva7/zL5b+inoSkWTSAAAAAElFTkSuQmCC');
  }
}
// 修改滚动条样式
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #E6E6E6;
  border-radius: 3px;
}
</style>
