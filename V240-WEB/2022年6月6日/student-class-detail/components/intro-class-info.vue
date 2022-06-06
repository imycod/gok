<template>
  <div class="intro-class-info bd">
    <section class="section-1">
      <h2 class="title m-b-20">班课信息</h2>
      <div class="flex">
        <div class="l">
          <Upload ref="upload"
                  action="/"
                  :disabled="!canEdit"
                  :show-upload-list="false"
                  accept=".jpg,.jpeg,.png"
                  :before-upload="beforeUpload">
            <div class="class-img-container upload-hover">
              <!-- <img class="class-img" :src="classInfo.imageUrl"> -->
              <Avatar class="class-img" :src="classInfo.imageUrl" v-image-err.child.class="classInfo.imageUrl"/>
              <div class="upload-icon" v-show="canEdit">
                <Icon type="ios-camera" size="25"/>
              </div>
              <p class="img-des" v-show="canEdit">支持jpg、jpeg、png格式，文件小于4MB，建议600*400像素。</p>
            </div>
          </Upload>
        </div>
        <div class="r  m-l-20">
          <ul class="class-info">
            <li class="flex">
              <span class="row-title">班课名称:</span>
              <div class="row-body flex">
                <span class="text-center" v-show="!editNameStatus">{{ classInfo.className }}</span>
                <Input v-show="editNameStatus" v-model="editName" maxlength="100" style="width: 350px"/>
                <div class="edit-name-container center m-l-10">
                  <span class="btn-edit edit" @click.stop="editClassName" v-if="!editNameStatus"></span>
                  <span class="btn-edit-ok edit"
                        @click="editClassNameOk"
                        v-if="editNameStatus"></span>
                  <span class="btn-edit-cancel m-l-4 edit" @click="editClassNameCancel" v-if="editNameStatus"></span>
                </div>
              </div>
            </li>
            <li class="flex class-code">
              <span class="row-title">班课码:</span>
              <div class="row-body">
                {{ classInfo.classCode }}
                <span class="m-l-10 copy-btn"
                      v-if="classInfo.classCode"
                      v-clipboard:copy="classInfo.classCode"
                      v-clipboard:success="copySuccess">复制</span>
              </div>
            </li>
            <li class="flex">
              <span class="row-title">任课老师:</span>
              <div class="row-body">{{ classInfo.teacher }}</div>
            </li>
            <li class="flex" v-if="assistant">
              <span class="row-title">班主任:</span>
              <div class="row-body">{{ assistant }}</div>
            </li>
            <li class="flex">
              <span class="row-title">学员人数:</span>
              <div class="row-body">{{ classInfo.studentNum }}</div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
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
  name: "intro-class-info",
  data() {
    return {
      classInfo: {},
      assistant: '', // 助教
      editNameStatus: false,
      editName: '',
      fileImg: '', // 上传的图片
      fileName: '', // 上传的文件名
      showCropperPic: false, // 显示截图弹框
      // classCodeStatus: 1,
      // classStatus: 0,
    };
  },
  created() {
    this.getClassCourseInfo();
  },
  computed: {
    /**
     * 是否可编辑
     */
    canEdit() {
      const curStatus = getClassStatus(this.classInfo.activeFlag, this.classInfo.enterFlag);
      return !['finish', 'forbid'].includes(curStatus);
    }
  },
  methods: {
    // 获取基本信息
    getClassCourseInfo() {
      this.$one.uc.http.post(this.$API.TAC.classCourseInfo, {
        data: {
          classId: this.$route.params.classId
        }
      }).then(res => {
        const data = res.data;
        this.editName = data.className;
        this.assistant = data.assistant.join('、');
        this.classInfo = data;
        this.classInfo.imageUrl || (this.classInfo.imageUrl = defaultClassImg); // 设置默认课程图片
      });
    },
    copySuccess() {
      this.$Message.success('复制成功！');
    },
    editClassName() {
      this.editNameStatus = true;
      this.editName = this.classInfo.className;
    },
    editClassNameOk() {
      const data = {
        classId: this.classId,
        className: this.editName
      };
      return this.$one.uc.http.post(this.$API.TAC.editClassCourseInfo, {data}).then(res => {
        this.getClassCourseInfo();
        this.$emit('update', 1, this.editName);
        this.editNameStatus = false;
      });
    },
    editClassNameCancel() {
      this.editNameStatus = false;
    },
    // 图片上传前
    beforeUpload(file) {
      if (file.size > 4194304) { // 4M = 1024 * 1024 * 4 = 4194304
        this.$Message.destroy();
        this.$Message.error('文件大小不能大于4M');
        return false;
      }
      this.fileName = file.name;
      const data = window.URL.createObjectURL(new Blob([file]));
      this.fileImg = data;
      this.showCropperPic = true;
      return false;
    },
  }
};
</script>

<style lang="stylus" scoped>
.intro-class-info {
  $base-width = 390px;
  $base-height = 348px;

  width: $base-width;
  height: $base-height;

  .section-1 {
    .flex {
      display: flex;
      align-items normal

      .l {
        width 190px
        height: 110px;

        .class-img-container {
          position: relative;
          width: 190px;
          height: 110px;
          border-radius: 6px;
          cursor: pointer;

          .class-img {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 6px;
          }

          .upload-icon {
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

          .img-des {
            display: none;
            position: absolute;
            bottom: 0;
            right: -400px;
            width: 400px;
            padding-left: 10px;
          }
        }

        .upload-hover:hover {
          .upload-icon,
          .img-des {
            display: inline-block;
          }
        }
      }

      .r {
        width: 100%;
        height: 100%;

        .class-info {
          li {
            margin-bottom 13px
          }

          .class-code {
            .copy-btn {
              font-size: 14px;
              font-weight: 400;
              color: $base;
              padding 4px 6px
              border: 1px solid $base;
              border-radius: 4px 4px 4px 4px;
              cursor: pointer;
            }
          }

          .row-title {
            width: 75px;
            text-align: right;
            font-size: 14px;
            font-weight: 400;
            color: #999;
          }

          .row-body {
            flex 1
            padding-left: 10px;
            font-size: 14px;
            font-weight: 400;
            color: #101010;

            .edit-name-container {
              display flex
              justify-content center

              span {
                display inline-block
              }

              .row-btn {
                margin-left: 10px;
              }


              .edit {
                width: 16px;
                height: 16px;
                background-size: 100% 100%;
                background-repeat no-repeat
                background-position center
              }

              .btn-edit {
                background-image: url('https://gok-static.goktech.cn/edu/icon/icon-edit-light.png');
              }

              .btn-edit-ok {
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABf0lEQVQ4EZWTv0/CUBDH7x6IC6CJwsCAC5MkLo4mDhqMOrk4uqmJq4srq4uDiXFxZNTopIaBP8KkmwsMDiCDoRNIz/vWvBaaItihvV+f773Xd48p8qRfL8oDGh6T0I6QFJFm4pa+6nOUuHN3L51RhK1Tdqqp91bvSoTPiMTY+PiXPWa5LRUz50652kfOF/DhpvuiHbfGgXhPV9QoraT3IOJ38jvPCEMSjcDAZuy57w3fJi8bZXEPeymTWDMD7/tkFliX/cDMj6GUGPxsQ8yVMDjBYq7lFgtH2ig7VqEnZexR2YR2amqnZ+trg1p+oXDa+fq4F6HtIK4G2ORoALawfC7nMofdjnstRPMhLPvRWvhJDIkqrQZJofVuu/e0lM8cmH5WfjvHw2CTmDBdSyigStq50m27dSJ3qOKbgXjUUNZgPPU0vWhOwY0/YWXAGsw2xjMqMM0HA9afRMy27qcxDbJ51IKB7wtgpjHbzHQTtx0LIocaew8QD26jLfrvdf4BSd2mYiRqnyUAAAAASUVORK5CYII=');
              }

              .btn-edit-cancel {
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABQUlEQVQ4EaVTsWrDMBC1RMhs/0A+IIV+RKEpyZjBU7u1Ll37Id2CwWRLJkM8JjSFfEShP+AfsOcMct8TEijXBBwqOOnu6d7d6SSpSIyiKG66rnsGPIGM3HaNda+UWmZZ9uMwuyhvlGU5bJrmA/YbRHtcrAZ2niTJe5qmR+7ZACS3bbtD5jtBOGuikkMcx1MGsZmYuS+ZEenrqo2UO/M38Etln60CoEEltyS9SLLW+hVYBfGjAsbGhkOz2ZzuQ5S6MeYBjXpEhg2FOrCZ9IM9GWDyVxXuz9HUFRr1RJA6lnno4PTRtef+E4MV1JCx2KmY3WWOqKPrvHJZRT3AGb/Qh5MAaNgWhLUnkAzsE32QAfb/v0b3tnNxhD5mTq5tIt82jnLow6IPfcmhbgPwTfNtw15A+GEuDe4t6HvymULva7/zL5b+inoSkWTSAAAAAElFTkSuQmCC');
              }
            }
          }
        }
      }
    }

  }

}
</style>
