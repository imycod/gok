<template>
    <div class="teach-content" :class="{distance: ( curType === 0),nocardZ:showNoCardContent(innerSideData)==='z',nocardJ:showNoCardContent(innerSideData)==='j'}">
        <!-- 未编辑状态 -->
        <div>
            <!-- 选择时加active类 -->
            <div v-if="teachContentList.length>0">
              <!-- 批量操作 -->
              <div v-if="showCheckbox">

                <!-- 批量操作按钮是定位盖在之前的tab栏上 -->
                <div class="top">
                  <!-- 批量操作按钮 -->
                  <div class="batch-btns">
                    <Row>
                      <Col span="10" class="flex">
                        <Button class="back" @click="handle('back')">返回</Button>
                        <div class="orderTxt" v-classStatus.hide="PRO_CLASS_STATUS">拖曳卡片即可排序</div>
                      </Col>
                      <Col span="14" class="flex p-27">
                        <Checkbox
                            class="allCheck"
                            :indeterminate="indeterminate"
                            :value="checkAll"
                            @click.prevent.native="handleCheckAll">全选
                        </Checkbox>
                        <Button type="primary" size="small" ghost class="border-text-depgray" @click="handle('del')" :disabled="!this.checkBoxList.length" v-classStatus.hide="PRO_CLASS_STATUS">删除</Button>
                        <Poptip ref="MovePopTip" placement="bottom"  trigger="click">
                          <Button type="primary"
                                  size="small" ghost  :disabled="!this.checkBoxList.length"  class="move border-text-orange">移动</Button>
                          <template #content>
                            <gok-mobile @cancel="mobileCancel" @confirm="mobileConfirm">
                              <move-card></move-card>
                            </gok-mobile>
                          </template>
                        </Poptip>
                        <!-- <Button class="trans" @click="handle('trans')" :disabled="!this.checkBoxList.length">转发</Button> -->
                        <Button class="trans btn-black" @click="handle('transNew')" :disabled="!this.checkBoxList.length">转发</Button>
                        <!-- 注：只要有选中一个卡片按钮就不禁用，不管选中的卡片符不符合操作条件（可发布、可开始）都弹框告知操作结果 -->
                        <Button class="publish btn-orange" :disabled="!this.checkBoxList.length" @click="handle('publishOrStart')" v-classStatus.hide="PRO_CLASS_STATUS">发布/开始</Button>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div class="list-section">
                  <CheckboxGroup v-model="checkBoxList" @on-change="getList">
                    <draggable v-model="teachContentList" @update="datadragEnd" animation="500" :options="dragOptions">
                      <!-- 2021-6-3  transition-group 导致拖拽列表不更新-->
                      <!-- <transition-group> -->
                        <Checkbox class="card" :label="item.dataId" v-for="item in teachContentList" :key="item.id">
                          <div class="card-item" style="cursor: move">
                            <div class="left-one">
                              <!-- 图片 -->
                              <div class="icon-box" v-icon-type="{type: item.type, url: item.name}"></div>
                            </div>
                            <div class="left-two">
                              <div class="title">
                                <div class="status" :class="{ noBegin: item.status === 0, begining: item.status === 1, end: item.status === 2}" v-if="showStatusLabel(item.type, item.status)">{{activityOrQueData(item.type) ? statusList[item.status]: coursewareOrVideoBtn[item.status]}}</div>
                                <div class="status end" v-if="item.transProcess!== '100' && item.type===activityType.VIDEO">转码<span>{{parseInt(item.transProcess) ? `${item.transProcess}%` : "中"}}</span></div>
                                <div class="quote" v-if="item.permissionType===0">引用</div>
                                <div class="txt" :title="item.name">{{item.name}}</div>
                              </div>
                              <div class="desc">
                                <div class="num" v-if="item.type===activityType.TEST || item.type === activityType.EXERCISES || item.type===activityType.QUESTIONNAIRE">共{{item.topicNum}}题<div class="line"></div></div>
                                <div class="num" v-if="activityOrQueData(item.type)">共{{item.partNum}}人参与<div class="line"></div></div>
                                <!-- 视频：时长 -->
                                <div class="num" v-if="item.type===activityType.VIDEO">{{item.duration | durationChange}}<div class="line"></div></div>
                                <!-- 视频：大小 -->
                                <div class="num" v-if="item.type===activityType.VIDEO">{{item.size | sizeChange}}MB<div class="line"></div></div>
                                <div class="time">{{item.insertTime | timeFormat}}</div>
                                <div class="num" v-if="(item.type===activityType.COURSEWARE || item.type===activityType.VIDEO)&&item.partNum"><div class="line"></div>{{item.partNum}}人已查看</div>
                                <!-- 已结束不展示剩余时间 -->
                                <div class="num surplus" v-if="item.status !== 2 && surplusTime(item.deadline)"><div class="line"></div>剩余{{surplusTime(item.deadline)}}</div>
                              </div>
                            </div>
                          </div>
                        </Checkbox>
                      <!-- </transition-group> -->
                    </draggable>
                  </CheckboxGroup>
                </div>
              </div>

              <!-- 未批量操作 -->
              <div v-if="!showCheckbox">
                <div class="list-section">
                  <div class="card"
                  v-for="(item,index) in teachContentList"
                  :key="item.id" @click="goActivityDetail(item)"
                  :class="'images-' + item.docId"
                  :style="{border:(item.highLightBool == true?'1px solid #198EF8':'1px solid transparent'),color:'#8b8b8b'}"
                  v-preview="{url: item.imgUrl, docId: item.docId, name: item.docName, intercept: interceptPreview(item.type)}">
                  <div class="card-item">
                    <div class="left-one">
                      <!-- 图片 -->
                      <div class="icon-box" v-icon-type="{type: item.type, url: item.name}"></div>
                    </div>
                    <div class="left-two">
                      <div class="title">
                        <div class="status" :class="{ noBegin: item.status === 0, begining: item.status === 1, end: item.status === 2}" v-if="showStatusLabel(item.type, item.status)">{{activityOrQueData(item.type) ? statusList[item.status]: coursewareOrVideoBtn[item.status]}}</div>
                        <div class="status end" v-if="item.transProcess!== '100' && item.type===activityType.VIDEO">转码<span>{{parseInt(item.transProcess) ? `${item.transProcess}%` : "中"}}</span></div>
                        <div class="quote" v-if="item.permissionType===0">引用</div>
                        <div class="txt" :title="item.name">{{item.name}}</div>
                      </div>
                      <div class="desc">
                        <div class="num" v-if="item.type===activityType.TEST || item.type === activityType.EXERCISES || item.type===activityType.QUESTIONNAIRE">共{{item.topicNum}}题<div class="line"></div></div>
                        <div class="num" v-if="activityOrQueData(item.type)">共{{item.partNum}}人参与<div class="line"></div></div>
                        <!-- 视频：时长 -->
                        <div class="num" v-if="item.type===activityType.VIDEO">{{item.duration | durationChange}}<div class="line"></div></div>
                        <!-- 视频：大小 -->
                        <div class="num" v-if="item.type===activityType.VIDEO">{{item.size | sizeChange}}MB<div class="line"></div></div>
                        <div class="time">{{item.insertTime | timeFormat}}</div>
                        <div class="num" v-if="(item.type===activityType.COURSEWARE || item.type===activityType.VIDEO)&&item.partNum"><div class="line"></div>{{item.partNum}}人已查看</div>
                        <!-- 已结束不展示剩余时间 -->
                        <div class="num surplus" v-if="item.status !== 2 && surplusTime(item.deadline)"><div class="line"></div>剩余{{surplusTime(item.deadline)}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="actionz">

                      <div v-if="item.status!=null" id="fiveBox" @click.stop="operateActivity(index, item)">

                        <div class="action" v-if="activityOrQueData(item.type)" v-clickOutside="outsideClick" v-classStatus.hide="PRO_CLASS_STATUS">
                          <img :src="activityOrQueData(item.type) && item.status===1 ? btnIconList[2]:btnIconList[1]" class="icon">
                          <p>{{cBtnTransform(item)}}</p>
                        </div>

                        <div class="action" v-else-if="(item.type===activityType.COURSEWARE || (item.type===activityType.VIDEO && item.transProcess === '100')) && item.status===0 " v-clickOutside="outsideClick" v-classStatus.hide="PRO_CLASS_STATUS">
                          <img :src="btnIconList[0]" class="icon">
                          <p>发布</p>
                        </div>
                      </div>

                      <div class="edit-dialog" id="box" ref="box" v-if="showSetTime(item.type, item.status, editIndex, index)">
                        <div class="dialog-item" @click.stop="immediteStart(index, item)">立即开始</div>
                        <div class="dialog-item" @click.stop="setEndTimeStart(item)">设置结束时间并开始</div>
                      </div>
                    </div>
                    <div class="edit-data" v-if="showEditIcon(item)">
                      <img src="../../../assets/images/class-course/dot.png" class="edit" @click.stop="() => {}">
                      <div class="edit-dialog">
                        <div class="dialog-item" @click.stop="editThisCard(item)" v-classStatus.hide="PRO_CLASS_STATUS">编辑</div>
                        <div class="dialog-item" v-if="item.type===activityType.COURSEWARE" @click.stop="downLoadFile(item)">下载</div>
                        <!-- <div class="dialog-item" @click.stop="retransmissionContent(item)" v-if="item.type !== activityType.EXERCISES">转发</div> -->
                        <!-- v210 修改 -->
                        <div class="dialog-item" @click.stop="forwardContent(item)" v-if="item.type !== activityType.EXERCISES">转发</div>
                        <div class="dialog-item" v-if="activityOrQueData(item.type)&&item.status !== 0 && item.type !== activityType.EXERCISES" @click.stop="checkSubmit(item)">查看提交情况</div>
                        <div class="dialog-item" @click.stop="goStatistics(item)" v-if="item.type !== activityType.EXERCISES">统计</div>
                        <div class="dialog-item del" @click.stop="deleteThisCard(item)" v-if="isDelete(item.type, item.status)" v-classStatus.hide="PRO_CLASS_STATUS">删除</div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <Page class="footer-page" ref="page" :current="page.pageCurrent" :total="page.totalCount" :page-size='page.pagesize' size="small" @on-change="changePage" v-if="!showCheckbox"/>
            </div>
            <!-- 内容为空 -->
            <div v-else class="no-card">
                <div class="nocard-icon"><img src="../../../assets/images/class-course/add-source@2x.png"></div>
                <!-- innerSideData:1选中节 2 选中章 0章节为空 -->
                <div class="nocard-info" v-if="innerSideData===1">暂无教学内容<i v-classStatus.hide="PRO_CLASS_STATUS">，</i><span @click="immediateAdd" v-classStatus.hide="PRO_CLASS_STATUS">马上添加</span></div>
                <div class="nocard-info" v-else-if="innerSideData===2">
                  <p>一级目录不允许编辑内容</p>
                  <Button type="primary" size="small" @click="createSection" v-if="finish" v-classStatus.hide="PRO_CLASS_STATUS" :disabled="sideBarCreateOrEdit">新建节</Button>
                </div>
                <div v-else-if="innerSideData===0" class="nocard-info">
                  <p>请先创建目录或直接导入课程包</p>
                  <Button type="primary" size="small" @click="createChapter" v-if="finish" v-classStatus.hide="PRO_CLASS_STATUS" style="margin-right: 10px" :disabled="sideBarCreateOrEdit">新建章</Button>
                  <Button type="primary" size="small" @click="togglePanel('modalImportCourse')" v-if="finish" v-classStatus.hide="PRO_CLASS_STATUS" :disabled="sideBarCreateOrEdit">导入课程包</Button>
                </div>
            </div>
        </div>
        <!-- 编辑文件 noEditName===false && (curType!=null && (curType >= 6 && curType < 12)) -->
      <Drawer  width="700"  :closable="false"  v-model="drawerOpen">
<!--        <template #header>-->
<!--          <div class="header">-->
<!--            <div>-->
<!--              编辑-->
<!--            </div>-->
<!--            <div>-->
<!--              <Button type="primary" @click="save" class="btn-orange" :loading="loading">保存</Button>-->
<!--              <Button class="btn-gray" @click="cancel">关闭</Button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
        <template #default>
          <div>
            <filenameEdit v-if="cEditTransform(noEditName, curType) === 'FILE'" @close="transferEdit" :source="classId ? 'class' : 'course'" :classId="classId" :curItem="curItem" :curSection="curSection"></filenameEdit>
            <!-- 添加&编辑测试 noEditName===false && curType === 2 -->
            <teachtestEdit v-else-if="cEditTransform(noEditName, curType) === 'TEST'" @close="transferEdit" :source="classId ? 'class' : 'course'" :classId="classId"  :curSection="curSection" :curItem="curItem" :isClassCourse="isClassCourse" :courseName="courseName"></teachtestEdit>
            <!--添加&编辑作业 noEditName===false && curType === 0 -->
            <homeworkEdit v-else-if="cEditTransform(noEditName, curType) === 'HOMEWORK'" @close="transferEdit" :curItem="curItem" :curSection="curSection" :editor="editor" :isClassCourse="isClassCourse" :courseName="courseName"></homeworkEdit>
            <!-- 添加&编辑头脑风暴 noEditName===false && curType === 1 -->
            <brainstormEdit v-else-if="cEditTransform(noEditName, curType) === 'BRAINSTORMING'" @close="transferEdit" :curItem="curItem" :curSection="curSection" :editor="editor" :isClassCourse="isClassCourse" :courseName="courseName" :classId="classId"></brainstormEdit>
            <!-- 编辑视频 noEditName===false && curType === 12 -->
            <videoEdit v-else-if="cEditTransform(noEditName, curType) === 'VIDEO'"  @close="transferEdit" :source="classId ? 'class' : 'course'" :classId="classId" :curItem="curItem" :knowledgeRight="knowledgeRight"></videoEdit>
            <!-- syh - 投票问卷 noEditName===false && curType === 13 -->
            <edit-vote v-else-if="cEditTransform(noEditName, curType) === 'QUESTIONNAIRE'"  @close="transferEdit" :source="classId ? 'class' : 'course'" :classId="classId" :curItem="curItem" :curSection="curSection" :editor="editor" :courseName="courseName"></edit-vote>
            <!-- 课件添加 -->
            <!-- <localsourceAdd v-else-if="noEditName===false && addTeachType === 0" @close="getLocalSource" :curSection="curSection" :courseName="courseName" :from="curFile" :classId="classId"></localsourceAdd> -->
            <add-resource v-else-if="noEditName===false && addTeachType === 0" @close="getLocalSource" :curSection="curSection" :courseName="courseName" :from="curFile" :classId="classId" :origin="'class'"></add-resource>
            <!-- 视频添加 -->
            <videoUpload v-else-if="noEditName===false && addTeachType === 4 && config === 'AliyunUpload'"  @close="getLocalSource" :curSection="curSection" :knowledgeRight="knowledgeRight" :courseName="courseName"></videoUpload>
            <!-- s3视频上传 -->
            <s3video-Upload v-else-if="noEditName===false && addTeachType === 4 && config === 'S3Upload'"  @close="getLocalSource" :curSection="curSection" :knowledgeRight="knowledgeRight" :courseName="courseName"></s3video-Upload>
            <!-- 活动 - 练习 -->
            <the-exercises v-if="cEditTransform(noEditName, curType) === 'EXERCISES'" :source="classId ? 'class' : 'course'" :classId="classId" :curItem="curItem" :curSection="curSection" :editor="editor" :isClassCourse="isClassCourse" :courseName="courseName" @close="transferEdit"/>
          </div>
        </template>
      </Drawer>

        <!-- 添加 -->
<!--        <addTeachcontent v-if="getShowDialog === 'addTeachContent'" @showAddTeach="showAddTeach"></addTeachcontent>-->
        <!-- 设置结束时间并开始弹框 -->
        <set-endtime v-if="getShowDialog === 'setEndTimeStart'" @close="transferSet" :curItem="curItem"></set-endtime>

        <!-- 153修改转发 -->
        <!-- 选择班课章节信息 -->
        <chapter-sections-select ref="chapterSectionsSelect" v-if="showPanelList.includes('chapterSectionsSelect')" :title="'转发到班课'" @ok="chapterSectionOk" @cancel="showPanel('clear')"></chapter-sections-select>
        <!-- 确定转发方式 -->
        <realy-confirm ref="relayConfirm" v-if="showPanelList.includes('relayConfirm')" :relayType="relayType" @ok="relayConfirmOk" @cancel="showPanel('remove', 'relayConfirm')"></realy-confirm>

        <!-- 导入课程包弹出层 -->
        <ModalImportCourse v-if="showModal === 'modalImportCourse'" @cancel="togglePanel" @refresh="reloadPage"></ModalImportCourse>

        <!-- v210 ZHOUZHIXIONG 转发 -->
        <forward-content-pop ref="chapterSectionsSelectNew" v-if="forwardContentPop"  @ok="chapterSectionOk" @cancel='chapterSectionCancel'></forward-content-pop>
    </div>
</template>
<script>
/**
 * 1.修改预览方式为自定义指令【v-preview】 * V160 * 施义煌 * 2021-06-22
 * 2.添加实时转码进度 * V160 * 施义煌 * 2021-06-27
 * 3.阿里云下载修改为华为云下载 * V201 * 施义煌 * 2021-10-08
 * 4.合并课件/视频模块，调整上传方式 * V210 * 施义煌 * 2021-11-10
 * 5.添加测试类活动 * V210-ing * 施义煌 * 2021-11-14
 * 6.文件图标修改为指令模式 * V220 * 施义煌 * 2021-12-29
 */
// 2021-3-16 批量操作--不管之前选择什么，切换页面后，每个页面都是初始状态
import eventBus from '@/common/eventBus.js'
import ACTIVITY_TYPE from '@/global-data/activity-type' // 活动枚举类
import publishicon from '@/assets/images/class-course/publish.svg'
import beiginicon from '@/assets/images/class-course/activity-begin.svg'
import endicon from '@/assets/images/class-course/activity-end.svg'
import FilenameEdit from '@/components/class-dialog/filename-edit' // 文件名称编辑
import TeachtestEdit from '@/components/class-dialog/teachtest-edit' // 测试名称编辑
import HomeworkEdit from '@/components/class-dialog/homework-edit' // 作业名称编辑
import BrainstormEdit from '@/components/class-dialog/edit-brainstorm' // 头脑风暴编辑
import LocalsourceAdd from '@/components/class-dialog/add-localsource' // 本地资源添加
import AddTeachcontent from '@/components/class-dialog/add-teachcontent' // 添加教学内容
import SetEndtime from '@/components/class-dialog/set-endtime' // 转发
import VideoUpload from '@/view/video/upload-video' // 上传视频
import s3videoUpload from '@/view/video/s3upload-video' // s3上传视频
import VideoEdit from '@/view/video/edit-video'
import EditVote from '@/view/course-detail/vote-question/edit-vote' // 投票问卷
import ModalImportCourse from '@c/menu-bar/modal-import-course.vue'; // 导入课程包
import GokMobile from "@c/gok-components/gok-mobile.vue" // 移动
import MoveCard from "./move-card.vue" // 移动
import ForwardContentPop from '@c/forward-content';
import TheExercises from '@c/activitys/exercises/the-exercises' // 活动 - 练习
import { CLASS_TEST_ROUTE, VOTE_DETAIL_ROUTE, BRAINSTORM_ROUTE, HOMEWORK_ROUTE, CLASS_COURSE_VIDEO_DETAIL, CLASS_EXERCISES_TEACHING_ROUTE } from '@_c/page.js' // 路由跳转文件
import draggable from 'vuedraggable'
import ChapterSectionsSelect from '@c/chapter-sections-select' // 选择班课
import RealyConfirm from '@c/relay-confirm/index' // 转发班课确认弹窗
import { SINGLE_RELAY_START, SINGLE_RELAY_NO_START, BATCH_RELAY_START, BATCH_RELAY_NO_START } from '@_c/relay-api.js' // 转发班课相关接口
import RELAY_TYPE from '@e/relay-type' // 转发类型
import { FILE_DOWNLOAD } from '@_c/file-download.js' // 文件下载
import { TRANSCODE_FILTER } from '@_c/video.js' // 视频相关操作
import ACTIVITY_STATUS from '@e/activity-status' // 活动状态
import AddResource from '@c/resource/add-resource' // 添加资源入口
const TYPE_TEXT = {
  // 活动
  activity: {
    title: '开始活动',
    text: '开始',
    content: '活动'
  },
  // 课件/视频
  coursewareOrVideo: {
    title: '发布课件',
    text: '发布',
    content: '课件'
  }
}
export default {
  inject: ['PRO_IS_CLASS', 'PRO_CLASS_STATUS', 'PRO_CLASS_JOIN'],
  props: {
    finish: {
      type: Boolean,
      required: false,
      default: true
    },
    courseName: {
      require: true,
      type: String
    },
    className: {
      require: true,
      type: String
    },

    showDialog: {
      require: true,
      type: String
    },
    curSection: {
      require: true,
      type: Object
    },

    teachCardList: {
      require: true,
      type: Array
    },

    curActive: {
      require: true,
      type: Number
    },

    innerSideData: {
      require: true,
      type: Number
    },

    knowledgeRight: {
      require: true,
      type: Boolean
    },

    showCheckbox: {
      require: true,
      type: Boolean
    },

    pageFlag: {
      require: true,
      type: Number
    },

    pageNo: {
      require: true,
      type: Number
    },

    pageSize: {
      require: true,
      type: Number
    },

    totalNum: {
      require: true,
      type: Number
    }
  },
  components: {
    FilenameEdit,
    TeachtestEdit,
    HomeworkEdit,
    BrainstormEdit,
    AddTeachcontent,
    MoveCard,
    LocalsourceAdd,
    GokMobile,
    SetEndtime,
    VideoUpload,
    VideoEdit,
    EditVote,
    s3videoUpload,
    ModalImportCourse,
    draggable,
    ChapterSectionsSelect,
    RealyConfirm,
    AddResource,
    ForwardContentPop,
    TheExercises
  },
  data () {
    return {
      showModal: '',
      noEditName: true,
      teachContentList: [],
      statusList: ['未开始', '进行中', '已结束', '已发布'], // card状态列表
      coursewareOrVideoBtn: ['未发布'], // 课件和视频的状态按钮
      btnIconList: [
        publishicon,
        beiginicon,
        endicon
      ], // 按钮icon
      btnList: ['发布', '开始活动', '结束活动', '开始活动'], // 触发按钮
      curType: null, // 编辑类型
      addTeachType: null, // 添加教学内容类型
      getShowDialog: null, // 添加弹框显示
      editIndex: null, // 当前编辑的index
      curItem: null, // 当前选中card
      page: {
        // 分页大小
        pagesize: 10,
        // 当前页面
        pageCurrent: 1,
        // 总数
        totalCount: 0
      },
      editor: true, // 可以编辑
      isClassCourse: true, // true：班课进去的,false: 资料库进去
      activityType: ACTIVITY_TYPE, // 活动
      config: '', // 配置
      checkBoxList: [], // 选中的card的dataId，用于页面展示（选中），CheckboxGroup绑定
      batchTransList: [], // 选中的card封装好的入参，用于批量转发（有type、dataId）
      indeterminate: false, // 全选按钮的样式
      checkAll: false, //  是否全选
      curChooseType: 0,
      curFile: 'class',
      curPageFlag: 1, // 是否分页：1分页，0不分页
      relayType: '', // 转发的方式提示
      showPanelList: [], // 需要展示的模态框组件 * V153
      curChosedList: [], // 批量选中的数据集合，用于批量发布/开始、删除
      typetText: Object.freeze(TYPE_TEXT),
      dragOptions: {},
      classId: '', // V160 * 施义煌 * 2021-06-21 班课结束权限控制
      videoTranscodeTimer: null, // V160 * 施义煌 * 2021-06-25 转码进度实时更新
      forwardContentPop: false, //  V210 * 周志雄 * 2021-11 转发弹出成
      canPublishOrStartList: [], // 批量操作---可以发布/开始的集合
      noTopicNumList: [], // 批量操作---没有题目的集合
      noTransProcessSuccessList: [], // 批量操作---转码未完成的集合
      inProgressingList: [], // 批量操作---正在进行中的活动的集合
      canDelList: [], // 批量操作---可以删除的集合
      sideBarCreateOrEdit: false, // 侧边栏是否在新建章/节、编辑章/节
      loading:false
    }
  },
  computed: {
    // 是否展示编辑图标
    showEditIcon () {
      return item => {
        if (item.type === this.activityType.VIDEO && item.transProcess !== '100') {
          return false
        } else {
          return true
        }
      }
    },
    drawerOpen:{
      get(){
        return this.$store.state.classCourse.drawerOpen
      },
      set(){
        this.$store.commit('classCourse/closeDrawerOpen')
      }
    },
    /**
     * card中操作按键的转换
     * @params {Object} item - 当前卡片对象
     */
    cBtnTransform (item) {
      return function (item) {
        if (item.status === 1) {
          const activityType = ACTIVITY_TYPE
          const totalActiviteData = (item.type === activityType.HOMEWORK || item.type === activityType.BRAINSTORMING || item.type === activityType.TEST || item.type === activityType.EXERCISES || item.type === activityType.QUESTIONNAIRE)
          if (totalActiviteData) {
            return this.btnList[2];
          } else {
            return this.btnList[1];
          }
        } else {
          return this.btnList[1];
        }
      }
    },
    // 状态标签显示
    showStatusLabel () { // 2021-7-1 未发布的视频页要展示标签
      return (type, status) => {
        const activityType = ACTIVITY_TYPE
        const totalActiviteData = (type === activityType.HOMEWORK || type === activityType.BRAINSTORMING || type === activityType.TEST || type === activityType.QUESTIONNAIRE || type === activityType.EXERCISES)
        // (item.type>=0&&item.type<3) || item.type === 13 || ((item.type>=6&&item.type<11) && item.status!=1)
        if (totalActiviteData || ((type === activityType.COURSEWARE) && status === 0) || ((type === activityType.VIDEO) && status === 0)) {
          return true
        } else {
          return false
        }
      }
    },
    // 测试/作业/头脑风暴
    activeTypeData () {
      return (type) => {
        const activityType = ACTIVITY_TYPE
        if (type === activityType.HOMEWORK || type === activityType.BRAINSTORMING || type === activityType.TEST || type === activityType.EXERCISES) {
          return true
        } else {
          return false
        }
      }
    },
    // 测试/作业/头脑风暴/投票
    activityOrQueData () {
      return (type) => {
        const activityType = ACTIVITY_TYPE
        const activiteData = (type === activityType.HOMEWORK || type === activityType.BRAINSTORMING || type === activityType.TEST || type === activityType.EXERCISES)
        if (activiteData || type === activityType.QUESTIONNAIRE) {
          return true
        } else {
          return false
        }
      }
    },
    // 测试/作业/头脑风暴/视频
    activityOrVideoData () {
      return (type) => {
        const activityType = ACTIVITY_TYPE
        const activiteData = (type === activityType.HOMEWORK || type === activityType.BRAINSTORMING || type === activityType.TEST || type === activityType.EXERCISES)
        if (activiteData || type === activityType.VIDEO) {
          return true
        } else {
          return false
        }
      }
    },
    // 是否显示设置时间开始
    // (((item.type>=0&&item.type<3) || item.type === 13)&&(item.status==0||item.status==2)) && editIndex===index
    showSetTime () {
      return (type, status, editIndex, index) => {
        const activityType = ACTIVITY_TYPE
        const totalActiviteData = (type === activityType.HOMEWORK || type === activityType.BRAINSTORMING || type === activityType.TEST || type === activityType.EXERCISES || type === activityType.QUESTIONNAIRE)
        if ((totalActiviteData && (status === 0 || status === 2)) && editIndex === index) {
          return true
        } else {
          return false
        }
      }
    },
    // 是否删除
    // (item.type >= 6 && item.type < 13) || ((item.type >= 0 && item.type < 3)&&item.status!==1) || (item.type === 13 && (item.status === 0 || item.status === 2))
    isDelete () {
      return (type, status) => {
        const activityType = ACTIVITY_TYPE
        const activiteData = (type === activityType.HOMEWORK || type === activityType.BRAINSTORMING || type === activityType.TEST || type === activityType.EXERCISES)
        const questionare = (type === activityType.QUESTIONNAIRE && (status === 0 || status === 2))
        if ((type === activityType.COURSEWARE || type === activityType.VIDEO) || (activiteData && status !== 1) || questionare) {
          return true
        } else {
          return false
        }
      }
    },
    // 是否新增/编辑
    cEditTransform () {
      return (noEditName, curType) => {
        const activityType = ACTIVITY_TYPE
        if (!noEditName) {
          if (curType === activityType.COURSEWARE) {
            return 'FILE'
          } else if (curType === activityType.TEST) {
            return 'TEST'
          } else if (curType === activityType.HOMEWORK) {
            return 'HOMEWORK'
          } else if (curType === activityType.BRAINSTORMING) {
            return 'BRAINSTORMING'
          } else if (curType === activityType.VIDEO) {
            return 'VIDEO'
          } else if (curType === activityType.QUESTIONNAIRE) {
            return 'QUESTIONNAIRE'
          } else if (curType === activityType.EXERCISES) {
            return 'EXERCISES'
          }
        }
      }
    },
    // 非编辑状态/列表无数据,样式展示
    showNoCardContent () {
      return (innerSideData) => {
        if (this.noEditName && !this.teachContentList.length && innerSideData === 2) { // 点击章样式
          return 'z'
        } else if (this.noEditName && !this.teachContentList.length && innerSideData === 1) { // 点击节为空样式
          return 'j'
        }
      }
    },
    /**
     * 拦截预览
     */
    interceptPreview () {
      return (type) => {
        return type != ACTIVITY_TYPE.COURSEWARE
      }
    }
  },
  watch: {
    curActive (newVal) {
      // 类型,0-》全部或活动，1-》课件，2-》视频
      if (newVal === ACTIVITY_TYPE.ALL || newVal === ACTIVITY_TYPE.ACTIVITY) { // 全部或活动
        this.curChooseType = 0
      } else if (newVal === ACTIVITY_TYPE.COURSEWARE) { // 课件
        this.curChooseType = 1
      } else if (newVal === ACTIVITY_TYPE.VIDEO) { // 视频
        this.curChooseType = 2
      }
    },
    showDialog: {
      handler (value) {
        this.getShowDialog = value
      },
      immediate: true,
      deep: true
    },

    teachCardList: { // 监听父组件传过来的值
      handler (value) {
        this.teachContentList = value
      },
      immediate: true,
      deep: true
    },

    pageFlag: {
      handler (value) {
        this.curPageFlag = value
      },
      immediate: true,
      deep: true
    },

    pageSize: {
      handler (value) {
        this.page.pagesize = value
      },
      immediate: true,
      deep: true
    },

    totalNum: {
      handler (value) {
        this.page.totalCount = value
      },
      immediate: true,
      deep: true
    },

    pageNo: {
      handler (value) {
        this.page.pageCurrent = value
      },
      immediate: true,
      deep: true
    },

    showCheckbox: {
      handler (value) {
        if (value === true) {
          this.curPageFlag = 0 // 批量操作：不分页
        } else if (value === false) {
          this.curPageFlag = 1 // 分页
        }
        this.page.pageCurrent = 1
        this.getTeachList()
      },
      immediate: true,
      deep: true
    },

    curSection: {
      handler (value) {
        if (value === null) { // 切换章，编辑状态消失
          this.getShowDialog = null
          this.noEditName = true
          this.curType = null
          this.addTeachType = null
        } else { // 有值，切换节，
          if (this.showCheckbox) { // 批量操作状态，初始化
            this.batchOperationInit()
          }
        }
      },
      immediate: true,
      deep: true
    },
    noEditName: { // 监听是否是编辑状态
      handler (value) {
        if (value === false) {
          this.$emit('getTeachCard', false)
        } else {
          this.$emit('getTeachCard', true)
        }
      },
      immediate: true,
      deep: true
    },
    teachContentList: {
      handler (value) {
        TRANSCODE_FILTER(this.teachContentList, this.getVideosTranscodeById);
        if (!value.length) {
          eventBus.$emit('disable', true)
        } else {
          eventBus.$emit('disable', false)
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    // innerside-bar在编辑或新增，这边的按钮需禁用
    eventBus.$on('sideBarCreateOrEdit', (val) => {
      this.sideBarCreateOrEdit = val
    })
    this.classId = this.$route.query.classId;
    // 如果班课结束，不可拖拽 V160 * 施义煌 * 2021-06-10
    if (!this.PRO_CLASS_STATUS) {
      this.dragOptions = {
        disabled: true
      }
    } else {
      this.dragOptions = {}
    }
    // curChooseType取值：0-》全部或活动，1-》课件，2-》视频
    if (this.curActive === ACTIVITY_TYPE.ALL || this.curActive === ACTIVITY_TYPE.ACTIVITY) { // 全部或活动
      this.curChooseType = RELAY_TYPE.MIXED_OR_ACTIVITY.value
    } else if (this.curActive === ACTIVITY_TYPE.COURSEWARE) { // 课件
      this.curChooseType = RELAY_TYPE.COURSEWARE.value
    } else if (this.curActive === ACTIVITY_TYPE.VIDEO) { // 视频
      this.curChooseType = RELAY_TYPE.VIDEO.value
    }

    // 使用哪种配置
    if (this.$store.state.video.videoConfig === 'S3Upload') { // 私有化部署，s3配置
      this.config = 'S3Upload'
    } else if (this.$store.state.video.videoConfig === 'AliyunUpload') { // 阿里云配置
      this.config = 'AliyunUpload'
    }
    this.$gokBus.$off('uploaderGetOriginBase');
    this.$gokBus.$on('uploaderGetOriginBase', (callback) => {
      const originName = this.PRO_IS_CLASS ? 'class' : 'course';
      const originInfo = {
        classId: this.classId,
        className: this.className,
        courseId: this.$route.query.courseId,
        courseName: this.courseName
      }
      callback(originName, originInfo);
    })
  },
  beforeDestroy () {
    this.$gokBus.$emit('previewClose')
    this.$gokBus.$off('showAddTeach')
  },
  created(){
    this.$gokBus.$on('showAddTeach',(msg,type,curType)=>{
      // console.log('teach-card',d);
      this.showAddTeach(msg,type,curType)
    })
  },
  methods: {
    cancel(){
      this.$store.commit('classCourse/closeDrawerOpen')
    },
    mobileCancel(){
      this.$refs.MovePopTip.cancel()
    },
    mobileConfirm(){
      // console.log('checkBoxList',this.checkBoxList);
      const data = {
        classId: this.classId,
        chapterDetailId:this.$store.state.classCourse.chapterDetailId, //选中要移到那个节下的id
        dataIds:this.checkBoxList //选中要移动的资源dataId列表
      };
      console.log('mobileConfirm-data',data);
      this.$one.uc.http.put(this.$API.TAC.putCourseResMove, {data}).then(res => {
        console.log('res--------putCourseResMove------>',res);
        this.$gokBus.$emit('refreshTeachList',{
          from:"src/view/class-course/courses-content/teach-card.vue",
          to:"src/view/class-course/courses-content/index.vue",
          solve:"移动至章节状态",
          description:"调用移动至章节后，刷新该组件状态"
          // value:
        })
      this.$refs.MovePopTip.cancel()
      });
    },
    // 点击新建章
    createChapter () {
      eventBus.$emit('creatChapter')
    },

    // 点击新建节
    createSection () {
      eventBus.$emit('creatSection')
    },

    getClassChapterAndSectionInfo () {
      return this
    },
    /**
     * V160 * 施义煌 * 2021-06-25
     * 获取转码进度
     */
    getVideosTranscodeById (listData) {
      listData.forEach(item => {
        for (let i = 0; i < this.teachContentList.length; i++) {
          if (this.teachContentList[i].dataId !== item.videoId) continue;
          const temp = JSON.parse(JSON.stringify(this.teachContentList[i]));
          temp.transProcess = item.transProcess;
          this.teachContentList.splice(i, 1, temp);
        }
      })
    },
    // 章节组件点击确定，判断要不要展示选择转发方式还是直接转发
    chapterSectionOk () {
      // console.log('relayType--', this.relayType)
      if (this.relayType) {
        this.showPanel('add', 'relayConfirm')
      } else { // 批量混合时：不提示方式选择，直接批量转发不发布
        this.massTransfer('N')
      }
    },
    // 章节点击取消
    chapterSectionCancel () {
      this.forwardContentPop = false
    },
    /**
     * 模态款组件开关
     * V153 * 施义煌
     * @param {String} type 操作类型【add - 添加 / remove - 移除指定 / clear - 清除所有】
     * @param {String} name 模态框名称
     */
    showPanel (type = 'clear', name = '') {
      this.$refs.chapterSectionsSelect && this.$refs.chapterSectionsSelect.loadingInit();
      switch (type) {
        case 'add':
          !this.showPanelList.includes(name) && (this.showPanelList.push(name));
          break;
        case 'remove':
          const index = this.showPanelList.indexOf(name);
          this.showPanelList.splice(index, 1);
          break;
        case 'clear':
          this.showPanelList = [];
          this.curItem = {} // 清空
          break;
      }
    },

    // 确定转发方式
    relayConfirmOk (value) {
      // console.log(this.curItem, this.showCheckbox)
      if (this.showCheckbox) { // 批量
        this.massTransfer(value)
      } else {
        this.singleTransfer(value)
      }
    },

    // 单个卡片转发确认
    singleTransfer (value) {
      // console.log(this.$refs.chapterSectionsSelectNew, this.curItem)
      let chapterIds = null
      if (this.$refs.chapterSectionsSelect) {
        chapterIds = this.$refs.chapterSectionsSelect && this.$refs.chapterSectionsSelect.getSelectedInfo();
      } else{
        chapterIds = this.$refs.chapterSectionsSelectNew && this.$refs.chapterSectionsSelectNew.getSelectedInfo();
      }
      // const chapterIds = this.$refs.chapterSectionsSelect && this.$refs.chapterSectionsSelect.getSelectedInfo();
      const id = this.curItem.dataId; // 需要转发的内容id
      const relayTypeValue = this.curItem.type; // 转发类型值
      if (!chapterIds.length) {
        this.$Message.error('至少选择一个章节');
        return;
      }
      // 转发且开始/发布
      if (value === 'Y') {
        SINGLE_RELAY_START(id, relayTypeValue, chapterIds).then(res => {
          this.showPanel('clear');
          this.$Message.success(res.data.message);
          this.getTeachList(0)
          this.forwardContentPop = false
        })
      }
      // 转发且不开始/不发布
      if (value === 'N') {
        SINGLE_RELAY_NO_START(id, relayTypeValue, chapterIds).then(res => {
          this.showPanel('clear');
          this.$Message.success(res.data.message);
          this.getTeachList(0)
          this.forwardContentPop = false
        })
      }
    },

    // 批量转发确认
    massTransfer (value) {
      let chapterIds = null
      if (this.$refs.chapterSectionsSelect) {
        chapterIds = this.$refs.chapterSectionsSelect && this.$refs.chapterSectionsSelect.getSelectedInfo();
      } else {
        chapterIds = this.$refs.chapterSectionsSelectNew && this.$refs.chapterSectionsSelectNew.getSelectedInfo();
      }
      // const chapterIds = this.$refs.chapterSectionsSelect && this.$refs.chapterSectionsSelect.getSelectedInfo();
      const type = this.curChooseType;
      const teachContentIds = this.batchTransList
      if (!chapterIds.length) {
        this.$Message.error('至少选择一个章节');
        return;
      }
      // 转发且开始/发布
      if (value === 'Y') {
        // 如果有转码中的视频不能发布
        let isTransProgress = false
        isTransProgress = this.curChosedList.some(item => {
          return item.type === this.activityType.VIDEO && item.transProcess !== '100'
        })

        if (isTransProgress) {
          this.$Message.warning('存在转码中的视频，不能发布!');
          this.showPanel('clear');
          this.batchOperationInit()
        } else {
          BATCH_RELAY_START(teachContentIds, type, chapterIds).then(res => {
            this.showPanel('clear');
            this.$Message.success(res.data.message);
            this.batchOperationInit()
            this.$nextTick(() => {
              this.getTeachList(0)
              this.forwardContentPop = false
            })
          })
        }
      }
      // 转发且不开始/不发布
      if (value === 'N') {
        BATCH_RELAY_NO_START(teachContentIds, type, chapterIds).then(res => {
          this.showPanel('clear');
          this.$Message.success(res.data.message);
          this.batchOperationInit()
          this.$nextTick(() => {
            this.getTeachList(0)
            this.forwardContentPop = false
          })
        })
      }
    },

    // 拖拽排序 2021-11-26 需求：拖动之后立即保存排序；
    datadragEnd (evt) {
      evt.preventDefault();
      this.saveSort()
    },

    // 保存拖拽
    saveSort () {
      const ids = [] // 处理拖拽入参
      for (let i = 0; i < this.teachContentList.length; i++) {
        ids.push(this.teachContentList[i].id)
      }
      this.$one.uc.http.put(this.$API.TAC.classCourseSort, { data: { ids } }).then(res => {
        console.log(res.data.message);
      })
    },

    // 批量操作后初始化
    batchOperationInit () {
      eventBus.$emit('update', true) // 传值给innertop-bar,控制样式展示
      this.indeterminate = false // 全选状态样式清空
      this.checkAll = false
      this.checkBoxList = []
      this.batchTransList = []
      this.curChosedList = []
    },

    // 批量操作的结果展示
    showMassResult (opeType, showOtherSuccess = true) {
      const title = '执行结果';
      let content = ''
      // 判断是否有不符合条件的活动集合/视频集合？
      if ((opeType === 'publishOrStart' && (this.noTopicNumList.length || this.noTransProcessSuccessList.length)) || (opeType === 'del' && this.inProgressingList.length)) { // 有不符合条件的
        content = this.handleNoSuccessTxt(opeType, showOtherSuccess)
        // console.log(content)
      } else {
        content = '批量任务执行成功'
      }
      this.$Modal.info({
        title: title,
        content: content,
        onOk: () => {
          this.batchOperationInit()
        }
      });
    },

    // 一一展示不符合的文案
    handleNoSuccessTxt (opeType, showOtherSuccess) {
      let str = ''
      if (opeType === 'publishOrStart') {
        if (this.noTopicNumList.length) {
          for (let i = 0; i < this.noTopicNumList.length; i++) {
            if (this.noTopicNumList[i].name.length > 10) {
              const newStr = this.plusDot(this.noTopicNumList[i].name, 5, 5)
              str += `<p>${newStr}发布失败，请先设置题目；</p>`
            } else {
              str += `<p>${this.noTopicNumList[i].name}发布失败，请先设置题目；</p>`
            }
          }
        }

        if (this.noTransProcessSuccessList.length) {
          for (let i = 0; i < this.noTransProcessSuccessList.length; i++) {
            if (this.noTransProcessSuccessList[i].name.length > 10) {
              const newStr = this.plusDot(this.noTransProcessSuccessList[i].name, 5, 5)
              str += `<p>${newStr}发布失败，请等转码完成；</p>`
            } else {
              str += `<p>${this.noTransProcessSuccessList[i].name}发布失败，请等转码完成；</p>`
            }
          }
        }
      } else if (opeType === 'del') {
        if (this.inProgressingList.length) {
          for (let i = 0; i < this.inProgressingList.length; i++) {
            if (this.inProgressingList[i].name.length > 10) {
              const newStr = this.plusDot(this.inProgressingList[i].name, 5, 5)
              str += `<p>${newStr}删除失败，活动进行中不能删除</p>`
            } else {
              str += `<p>${this.inProgressingList[i].name}删除失败，活动进行中不能删除</p>`
            }
          }
        }
      }
      if (showOtherSuccess) {
        str += '<p style="margin-top:20px">其余批量任务执行成功。</p>'
      }
      return str
    },

    // 资源名太长的处理
    plusDot (str, frontLen, endLen) {
      return str.substring(0, frontLen) + '...' + str.substring(str.length - endLen);
    },

    // 批量操作事件处理
    handle (type) {
      if (type === 'back') { // 点击返回
        this.batchOperationInit()
      } else if (type === 'del') { // 批量删除
        this.massDelete()
      } else if (type === 'trans') { // 批量转发
        this.massRetransmission()
      } else if (type === 'transNew') { // 批量转发（新）
        this.massRetransmission('new')
      } else if (type === 'publishOrStart') { // 发布/开始
        this.massPublishOrStart()
      }
    },

    // 从curChosedList取数据---批量删除、发布/开始
    handlerData () {
      // 符合条件可以发布/开始的集合
      this.canPublishOrStartList = this.curChosedList.filter(item => {
        return ((item.type === this.activityType.HOMEWORK || item.type === this.activityType.BRAINSTORMING || item.type === this.activityType.QUESTIONNAIRE) && (item.status === 0 || item.status === 2)) ||
               (((item.type === this.activityType.TEST || item.type === this.activityType.EXERCISES) && item.topicNum !== '0' && (item.status === 0 || item.status === 2))) ||
               (item.type === this.activityType.VIDEO && item.transProcess === '100' && item.status === 0) ||
               (item.type === this.activityType.COURSEWARE && item.status === 0)
      })

      // 符合条件可以删除的集合
      this.canDelList = this.curChosedList.filter(item => {
        return !((item.type === this.activityType.HOMEWORK || item.type === this.activityType.BRAINSTORMING || item.type === this.activityType.QUESTIONNAIRE || item.type === this.activityType.TEST || item.type === this.activityType.EXERCISES) && item.status === 1)
      })

      // 不符合条件的集合：
      this.noTopicNumList = this.curChosedList.filter(item => { // 测试或者练习没有题目
        return (item.type === this.activityType.TEST && item.topicNum === '0') || (item.type === this.activityType.EXERCISES && item.topicNum === '0')
      })

      this.noTransProcessSuccessList = this.curChosedList.filter(item => { // 视频未转码完成
        return item.type === this.activityType.VIDEO && item.transProcess !== '100'
      })

      this.inProgressingList = this.curChosedList.filter(item => { // 正在进行中的活动
        return (item.type === this.activityType.HOMEWORK || item.type === this.activityType.BRAINSTORMING || item.type === this.activityType.TEST || item.type === this.activityType.EXERCISES || item.type === this.activityType.QUESTIONNAIRE) && item.status === 1
      })
    },

    // 批量发布/开始
    massPublishOrStart () {
      this.handlerData()
      if (this.canPublishOrStartList.length) {
        const ids = [] // 处理参数, 符合条件的数据走接口
        for (let i = 0; i < this.canPublishOrStartList.length; i++) {
          ids.push(this.canPublishOrStartList[i].id)
        }
        this.$one.uc.http.post(this.$API.TAC.batchPublishInClass, { data: { ids } }).then(res => { // 说明符合条件的操作成功了，需显示所有执行结果；
          // console.log(res)
          this.showMassResult('publishOrStart')
        })
      } else {
        this.showMassResult('publishOrStart')
      }
    },

    // 处理批量转发的入参
    handleTransData () {
      this.batchTransList = []
      // 遍历checkBoxList，取出teachContentList中对应的对象的dataId和type
      for (let i = 0; i < this.checkBoxList.length; i++) {
        const curList = this.teachContentList.filter(item => item.dataId === this.checkBoxList[i])
        const tempObj = {
          id: curList[0].dataId,
          type: curList[0].type
        }
        this.batchTransList.push(tempObj)
      }
    },

    // 批量删除: 2021-11-26 点击删除判断后置，将可删除的文件删除，不可删除的报错
    massDelete () {
      this.handlerData()
      const _this = this
      _this.$Modal.confirm({
        content: '是否删除选择的内容？',
        onOk: () => {
          if (_this.canDelList.length) {
            const batchDelList = [] // 删除接口入参
            for (let i = 0; i < _this.canDelList.length; i++) {
              const tempObj = {
                id: _this.canDelList[i].dataId,
                type: _this.canDelList[i].type
              }
              batchDelList.push(tempObj)
            }
            const params = {
              classId: _this.classId,
              type: _this.curChooseType,
              batchListReqs: batchDelList
            }
            _this.$one.uc.http.delete(_this.$API.TAC.MassDeletion, { data: params }).then(res => {
              // console.log(res)
              this.$Modal.remove()
              setTimeout(() => {
                this.showMassResult('del')
              }, 500)
            })
          } else {
            this.$Modal.remove()
            setTimeout(() => {
              this.showMassResult('del', false)
            }, 500)
          }
        }
      })
    },

    // 批量转发
    massRetransmission (type = '') {
      this.handleTransData()

      // relayType取值
      const isALLCoursewareOrVideo = this.batchTransList.every(item => {
        return item.type === ACTIVITY_TYPE.COURSEWARE || item.type === ACTIVITY_TYPE.VIDEO
      })
      const isALLActivity = this.batchTransList.every(item => {
        return item.type === ACTIVITY_TYPE.HOMEWORK || item.type === ACTIVITY_TYPE.BRAINSTORMING || item.type === ACTIVITY_TYPE.TEST || item.type === ACTIVITY_TYPE.QUESTIONNAIRE
      })
      if (isALLCoursewareOrVideo) { // 选中的都是视频、课件
        this.relayType = 'coursewareOrVideo'
      } else if (isALLActivity) { // 选中的都是活动
        this.relayType = 'activity'
      } else { // 混合
        this.relayType = ''
      }
      if (type === 'new') {
        this.forwardContentPop = true
      } else {
        this.showPanel('add', 'chapterSectionsSelect')
      }
    },

    // 在选项状态发生改变时触发，返回已选中的数组。
    getList (list) {
      this.curChosedList = []

      // 遍历已选中的卡片，取出需要得字段，放到curChosedList
      for (let i = 0; i < list.length; i++) {
        const curList = this.teachContentList.filter(item => item.dataId === list[i])
        const tempObj = {
          id: curList[0].id,
          dataId: curList[0].dataId,
          name: curList[0].name,
          type: curList[0].type,
          status: curList[0].status,
          topicNum: curList[0].topicNum,
          transProcess: curList[0].transProcess
        }
        this.curChosedList.push(tempObj)
      }

      if (list.length === this.teachContentList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (list.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
      // console.log('teach-card.vue   list',list);
    },

    // "全选"
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) { // 若全选中：checkAll为true，需遍历把所有的dataId赋值给checkAllGroup！因为label="item.dataId"
        const arr = []
        const curArr = []
        this.teachContentList.map(item => { // 当前页列表
          arr.push(item.dataId)
          const curObj = { // 处理批量发布/开始的数据
            id: item.id,
            dataId: item.dataId,
            name: item.name,
            type: item.type,
            status: item.status,
            topicNum: item.topicNum,
            transProcess: item.transProcess
          }
          curArr.push(curObj)
        })
        this.checkBoxList = arr
        this.curChosedList = curArr
      } else {
        this.checkBoxList = [];
        this.batchTransList = [];
        this.curChosedList = []
      }
      // console.log('teach-card.vue  this.checkBoxList',  this.checkBoxList);
    },

    // 改变添加弹框状态
    showAddTeach (msg, type, curtype) {
      console.log({msg, type, curtype});
      if (curtype !== null) { // 取消状态不改变
        this.noEditName = false
      }
      this.getShowDialog = msg
      this.addTeachType = type
      this.curType = curtype
      this.$emit('getTeachCard', this.getShowDialog) // 关闭添加弹框
      this.$store.commit('classCourse/openDrawerOpen');
    },
    // 接口弹框修改值 - 编辑
    transferEdit (msg, status) {
      this.$store.commit('classCourse/closeDrawerOpen');
      this.noEditName = msg
      this.curItem = null
      if (status === 1) { // 刷新列表
        this.getTeachList(0) // 表示编辑状态下分页定位
      }
    },
    // 接口弹框修改值 - 设置时间
    transferSet (msg, status) {
      this.getShowDialog = msg
      this.curItem = null // 清空
      if (status === 1) { // 刷新列表
        this.getTeachList()
      }
    },
    // 编辑card内容
    editThisCard (item) {
      this.curItem = item // 当前编辑的card item
      this.curType = item.type
      this.noEditName = false
    },
    // 删除card内容
    deleteThisCard (item) {
      this.$Modal.confirm({
        content: '是否删除' + item.name + '？',
        onOk: () => {
          if (item.type === ACTIVITY_TYPE.HOMEWORK) { // 作业
            const newId = []
            newId.push(item.dataId)
            const params = {
              classId: this.classId,
              ids: newId
            }
            this.$one.uc.http.post(this.$API.TAC.deleteHomeworkByIds, { data: params }).then(res => {
              this.$Message.success(res.data.message);
              this.getTeachList(0) // 0表示编辑删除，保留在原来操作页面
            })
          } else if (item.type === ACTIVITY_TYPE.BRAINSTORMING) { // 头脑风暴
            const newId = []
            newId.push(item.dataId)
            const params = {
              classId: this.classId,
              ids: newId
            }
            this.$one.uc.http.post(this.$API.TAC.deleteBrainstormById, { data: params }).then(res => {
              this.$Message.success(res.data.message);
              this.getTeachList(0) // 0表示编辑删除，保留在原来操作页面
            })
          } else if (item.type === ACTIVITY_TYPE.TEST || item.type === ACTIVITY_TYPE.EXERCISES) { // 测试 / 练习
            const newId = []
            newId.push(item.dataId)
            const params = {
              classId: this.classId,
              ids: newId
            }
            this.$one.uc.http.post(this.$API.TAC.batchDelete, { data: params }).then(res => {
              this.$Message.success(res.data.message);
              this.getTeachList(0) // 0表示编辑删除，保留在原来操作页面
            })
          } else if (item.type === ACTIVITY_TYPE.COURSEWARE) { // 课件
            const data = {
              classId: this.classId
            }
            this.$one.uc.http.delete(this.$API.TAC.deleteCourseware + '/' + item.dataId, { data }).then(res => {
              this.$Message.success(res.data.message);
              this.getTeachList(0) // 0表示编辑删除，保留在原来操作页面
            })
          } else if (item.type === ACTIVITY_TYPE.VIDEO) { // 视频
            const ids = []
            ids.push(item.dataId)
            const params = {
              classId: this.classId,
              ids
            }
            this.$one.uc.http.post(this.$API.TAC.deleteVideo, { data: params }).then(res => {
              this.$Message.success(res.data.message);
              this.getTeachList(0) // 0表示编辑删除，保留在原来操作页面
            })
          } else if (item.type === ACTIVITY_TYPE.QUESTIONNAIRE) {
            // 删除投票问卷
            const params = {
              classId: this.classId,
              ids: [item.dataId]
            };
            this.$one.uc.http.post(this.$API.TAC.delVoteInfo, { data: params }).then(res => {
              this.$Message.success(res.data.message);
              this.getTeachList(0)
            })
          }
        }
      });
    },
    // 跳转到统计
    goStatistics (item) {
      if (item.type === ACTIVITY_TYPE.VIDEO) { // 视频
        this.$router.push({
          path: '/statistics/class/singlevideo',
          query: {
            classId: this.classId,
            coursewareId: item.dataId
          }
        })
      } else if (item.type === ACTIVITY_TYPE.HOMEWORK) { // 作业
        this.$router.push({
          path: '/statistics/class/homework',
          query: {
            classId: this.classId,
            coursewareId: item.dataId
          }
        })
      } else if (item.type === ACTIVITY_TYPE.BRAINSTORMING) { // 头脑风暴
        this.$router.push({
          path: '/statistics/class/activity',
          query: {
            classId: this.classId,
            coursewareId: item.dataId
          }
        })
      } else if (item.type === ACTIVITY_TYPE.TEST) {
        this.$router.push({
          path: '/statistics/class/test',
          query: {
            classId: this.classId,
            coursewareId: item.dataId
          }
        })
      } else if (item.type === ACTIVITY_TYPE.QUESTIONNAIRE) {
        this.$router.push({
          path: '/statistics/class/activity',
          query: {
            classId: this.classId,
            coursewareId: item.dataId
          }
        })
      } else if (item.type === ACTIVITY_TYPE.COURSEWARE) {
        this.$router.push({
          path: '/statistics/class/novideo',
          query: {
            classId: this.classId,
            coursewareId: item.dataId
          }
        })
      }
    },
    // 马上添加
    immediateAdd () {
      this.getShowDialog = 'addTeachContent'
    },
    // 添加本地资源页面传值/添加视频
    getLocalSource (msg, status) {
      this.$store.commit('classCourse/closeDrawerOpen');
      this.noEditName = true
      this.addTeachType = msg
      if (status === 1) { // 刷新列表
        this.getTeachList()
      }
    },
    // 点击-开始/结束活动
    operateActivity (index, item) {
      this.editIndex = index
      const totalActiviteData = (item.type === ACTIVITY_TYPE.HOMEWORK || item.type === ACTIVITY_TYPE.BRAINSTORMING || item.type === ACTIVITY_TYPE.TEST || item.type === ACTIVITY_TYPE.EXERCISES || item.type === ACTIVITY_TYPE.QUESTIONNAIRE)
      if (item.type === ACTIVITY_TYPE.COURSEWARE || item.type === ACTIVITY_TYPE.VIDEO) { // 课件
        this.$Modal.confirm({
          content: '是否立即发布' + item.name + '？',
          onOk: () => {
            if (item.status === 0) { // 未发布
              this.immediteStart(index, item)
            }
          }
        });
      } else if (totalActiviteData) { // 活动
        if (item.status === 0 || item.status === 2) { // 未开始
          this.teachContentList.splice(index, 1, this.teachContentList[index])
        } else if (item.status === 1) { // 进行中，结束发布
          const paramsone = {
            dataId: item.dataId,
            type: item.type
          }
          this.$one.uc.http.post(this.$API.TAC.getPartCountActivity, { data: paramsone }).then(datas => {
            this.$Modal.confirm({
              content: '还有' + datas.data.cnt + '名同学未提交，是否立即结束？',
              onOk: () => {
                const params = {
                  id: item.id
                }
                this.$one.uc.http.post(this.$API.TAC.overTeachActivity, { data: params }).then(res => {
                  if (res.status === 200) {
                    this.$Message.success('操作成功')
                    this.getTeachList()
                  }
                })
              }
            })
          })
        }
      }
    },
    // 点击div外隐藏
    outsideClick () {
      this.editIndex = null
    },
    // 立即开始
    immediteStart (index, item) {
      if (item.type === ACTIVITY_TYPE.TEST || item.type === ACTIVITY_TYPE.EXERCISES) { // 测试 / 练习
        if (item.topicNum && item.topicNum !== '0') {
          const params = {
            classId: this.$route.query.classId,
            dataId: item.dataId,
            chapterDetailId: item.chapterDetailId,
            type: item.type,
            status: 1,
            publishTime: JSON.stringify(new Date().getTime()),
            id: item.id
          }
          this.$one.uc.http.post(this.$API.TAC.startTeachActivity, { data: params }).then(res => {
            this.editIndex = null // 隐藏按钮弹框
            this.getTeachList(0)
          })
        } else {
          this.editIndex = null // 隐藏按钮弹框
          this.$Message.warning('请先添加题目')
        }
      } else { // 测试以外
        const params = {
          classId: this.$route.query.classId,
          dataId: item.dataId,
          chapterDetailId: item.chapterDetailId,
          type: item.type,
          status: 1,
          publishTime: JSON.stringify(new Date().getTime()),
          id: item.id
        }
        this.$one.uc.http.post(this.$API.TAC.startTeachActivity, { data: params }).then(res => {
          this.editIndex = null // 隐藏按钮弹框
          this.getTeachList(0)
        })
      }
    },
    // 设置结束时间并开始
    setEndTimeStart (item) {
      this.editIndex = null // 隐藏按钮弹框
      this.curItem = item
      this.getShowDialog = 'setEndTimeStart'
    },
    // 确定设置时间
    trueSetEndTime () {},

    // 卡片点击--显示转发弹框
    retransmissionContent (item) {
      if (item.type === this.activityType.COURSEWARE || item.type === this.activityType.VIDEO) {
        this.relayType = 'coursewareOrVideo'
      } else if (item.type === this.activityType.HOMEWORK || item.type === this.activityType.BRAINSTORMING || item.type === this.activityType.TEST || item.type === this.activityType.EXERCISES || item.type === this.activityType.QUESTIONNAIRE) {
        this.relayType = 'activity'
      }
      this.curItem = item
      this.showPanel('add', 'chapterSectionsSelect')
    },


    /*
      V210 周志雄 * 转发 start
    */
    forwardContent (item) {
      if (item.type === this.activityType.COURSEWARE || item.type === this.activityType.VIDEO) {
        this.relayType = 'coursewareOrVideo'
      } else if (item.type === this.activityType.HOMEWORK || item.type === this.activityType.BRAINSTORMING || item.type === this.activityType.TEST || item.type === this.activityType.QUESTIONNAIRE) {
        this.relayType = 'activity'
      }
      this.curItem = item
      this.forwardContentPop = true
    },

    /*
      V210 周志雄 * 转发 end
    */

    // 进入 活动详情
    goActivityDetail (item) {
      // 当前点击的卡片高亮---2022-3-17
      for (let i = 0; i < this.teachContentList.length; i++) {
        if (this.teachContentList[i].dataId === item.dataId) {
          this.teachContentList[i].highLightBool = true
        } else {
          this.teachContentList[i].highLightBool = false
        }
      }
      if (item.type === ACTIVITY_TYPE.HOMEWORK) { // 作业跳转
        if (item.status !== 0) { // 除了未开始
          this.$store.commit('teach/setCurActiveIndex', this.curSection); // 获取当前触发章节,返回时调用
          HOMEWORK_ROUTE({
            homeworkId: item.dataId,
            classId: this.$route.query.classId
          })
        } else { // 未开始可以编辑作业
          this.curItem = item // 当前编辑的card item
          this.curType = item.type
          this.noEditName = false
        }
      } else if (item.type === ACTIVITY_TYPE.BRAINSTORMING) { // 头脑风暴跳转
        if (item.status !== 0) { // 除了未开始
          this.$store.commit('teach/setCurActiveIndex', this.curSection);
          BRAINSTORM_ROUTE({
            id: item.dataId,
            classId: this.$route.query.classId
          })
        } else { // 未开始可以编辑头脑风暴
          this.curItem = item // 当前编辑的card item
          this.curType = item.type
          this.noEditName = false
        }
      } else if (item.type === ACTIVITY_TYPE.TEST) { // 测试跳转
        if (item.status === 0) { // 未开始可跳转到编辑题目
          this.$store.commit('teach/setCurActiveIndex', this.curSection);
          CLASS_TEST_ROUTE(item.dataId, this.$route.query.classId)
          // CLASS_TEST_ROUTE({
          //   paperId: item.dataId,
          //   paperName: item.name,
          //   paperTime: item.insertTime,
          //   status: item.status,
          //   tabActive: 0
          // })
        } else { // 进行中/已结束 可查看批改
          this.$store.commit('teach/setCurActiveIndex', this.curSection);
          CLASS_TEST_ROUTE(item.dataId, this.$route.query.classId)
          // CLASS_TEST_ROUTE({
          //   paperId: item.dataId,
          //   paperName: item.name,
          //   paperTime: item.insertTime,
          //   status: item.status,
          //   tabActive: 2
          // })
        }
      } else if (item.type === ACTIVITY_TYPE.COURSEWARE) { // 课件 可预览
      } else if (item.type === ACTIVITY_TYPE.VIDEO) { // 视频，打开播放页
        CLASS_COURSE_VIDEO_DETAIL({
          id: item.dataId,
          courseId: this.$route.query.courseId,
          classId: this.$route.query.classId,
          chapterId: item.chapterId,
          sectionId: item.chapterDetailId
        })
      } else if (item.type === ACTIVITY_TYPE.QUESTIONNAIRE) { // 投票问卷
        // 未开始状态点击卡片进入编辑页面
        if (item.status === 0) {
          this.curItem = item // 当前编辑的card item
          this.curType = item.type
          this.noEditName = false
        } else if (item.status === 1 || item.status === 2 || item.status === 3) {
          VOTE_DETAIL_ROUTE(item.dataId, {
            quote: item.permissionType // 权限类别（编辑组/授权组）
          });
        }
      } else if (item.type === ACTIVITY_TYPE.EXERCISES) { // 练习 - syh
        CLASS_EXERCISES_TEACHING_ROUTE(this.$route.query.classId, item.dataId, { id: item.id });
      }
      this.getTrackingData(item)
    },
    // 埋点数据
    getTrackingData (item) {
      const TENANT_INFO = this.$one.uc.token.getCurTenant();
      const params = {
        uid: this.$one.uc.token.getUserBaseInfo().uid,
        memberId: TENANT_INFO.memberId,
        memberName: TENANT_INFO.memberName,
        tenantId: TENANT_INFO.tenantId,
        ets: [{
          recordId: item.dataId,
          recordName: item.name,
          classId: this.$route.query.classId,
          courseId: this.$route.query.courseId,
          chapterId: item.chapterId,
          subsectionId: item.chapterDetailId,
          seq: 1,
          time: new Date().getTime() + 100, // 产生事件最短的时间是0.1s
          eventType: 'click',
          pageId: 'teaching_content_page',
          inTime: new Date().getTime(),
          current: this.$route.fullPath,
          extra: {}
        }]
      }
      this.$one.log.api.tracking(params).then(res => {});
    },
    // 获取教学内容列表
    getTeachList (choseIndex) {
      this.teachContentList = [] // 置空下，否则darggable会报错---2021-6-3
      if (this.curSection.copId) {
        let curType;
        if (this.showCheckbox) { // 2021-11-29 批量操作时请求节下全部资源对象，不管curActive是多少，都取-1
          curType = -1
        } else {
          curType = this.curActive // -1：全部,5：课件,6：活动, 12:视频
        }
        const params = {
          pageFlag: this.curPageFlag,
          pageNo: this.page.pageCurrent,
          pageSize: this.page.pagesize,
          classId: this.$route.query.classId,
          id: this.curSection.copId, // 章节明细id
          type: curType,
          status: -1 // 老师教学内容传-1，学生传3
        }
        this.$one.uc.http.post(this.$API.TAC.getTeachContentListByPage, { data: params }).then(res => {
          this.teachContentList = res.data.list
          this.page.totalCount = Number(res.data.total)
        })
      }
    },
    // 切换分页
    changePage (e) {
      this.page.pageCurrent = e
      this.getTeachList()
    },
    // 查看提交情况
    checkSubmit (item) {
      if (item.type === ACTIVITY_TYPE.HOMEWORK) {
        if (item.status !== 0) { // 除了未开始
          HOMEWORK_ROUTE({
            homeworkId: item.dataId
          })
        }
      } else if (item.type === ACTIVITY_TYPE.BRAINSTORMING) {
        if (item.status !== 0) { // 除了未开始
          BRAINSTORM_ROUTE({
            id: item.dataId
          })
        }
      } else if (item.type === ACTIVITY_TYPE.TEST) {
        CLASS_TEST_ROUTE(item.dataId, this.$route.query.classId)
        // CLASS_TEST_ROUTE({
        //   paperId: item.dataId,
        //   paperName: item.name,
        //   paperTime: item.insertTime,
        //   status: item.status,
        //   tabActive: 2
        // })
      } else if (item.type === ACTIVITY_TYPE.QUESTIONNAIRE) { // 投票问卷
        // 未开始状态点击卡片进入编辑页面
        if (item.status === 0) {
          this.curItem = item // 当前编辑的card item
          this.curType = item.type
          this.noEditName = false
        } else if (item.status === 1 || item.status === 2 || item.status === 3) {
          VOTE_DETAIL_ROUTE(item.dataId, {
            quote: item.permissionType // 权限类别（编辑组/授权组）
          });
        }
      } else if (item.type === ACTIVITY_TYPE.EXERCISES) {
      }
    },
    // 下载文件
    downLoadFile (item) {
      this.$one.uc.http.get(this.$API.TC.getDocInfo(item.docId), {}).then(res => {
        const data = res.data;
        FILE_DOWNLOAD(data.url, data.docName);
      })
    },
    // 活动剩余时间
    surplusTime (time) {
      var now = new Date().getTime()
      var diffTime = parseInt(time) - now
      var result = '';
      // 定义变量 d,h,m,s保存倒计时的时间
      var d, h, m;
      if (diffTime > 0) {
        d = Math.floor(diffTime / 1000 / 60 / 60 / 24);
        h = Math.floor(diffTime / 1000 / 60 / 60 % 24);
        m = Math.floor(diffTime / 1000 / 60 % 60);
        // s = Math.floor(diffTime / 1000 % 60);
      }
      if (d > 0) {
        result += d + '天';
      }
      if (h > 0) {
        result += h + '小时';
      }
      if (d === 0 && m > 0) { // 有天的时候不展示分
        result += m + '分';
      }
      return result;
    },
    togglePanel (name = '') {
      this.showModal = name;
    },
    reloadPage () {
      this.$router.go(0);
    }
  },
  filters: {
    sizeChange (size) {
      return (size / (1 << 20)).toFixed(2);
    },
    durationChange (value) {
      // 传进来的是秒
      var theTime = parseInt(value);
      var result = '';
      if (theTime > 3600) {
        result += parseInt(theTime / 3600) + '小时';
        theTime = theTime % 3600;
      }
      if (theTime > 60) {
        result += parseInt(theTime / 60) + '分';
        theTime = theTime % 60;
      }
      result += theTime + '秒';
      return result;
    }
  }

}
</script>
<style lang="stylus" scoped>
.ivu-poptip-title {
   margin: 0 !important;
   padding: 8px 16px !important;
   position: relative !important;
}
.header{
  display flex;
  justify-content space-between
  align-items center
  .btn-gray, .btn-orange{
    font-size: 14px;
    font-weight: bold;
  }
  .btn-orange{
    margin-right 14px
  }
}
.teach-content{
    height:740px;
    background-color:#FFFFFF;
    position:relative;
    .top{
      width: 100%;
      height:49px;
      position: absolute;
      top: -49px;
      left: 0;
      background: #FFFFFF;
      border-bottom: 1px solid #EDEDED;
      align-items: center;
      display:flex;
      .batch-btns {
        //display: flex;
        //flex: 1;
        .p-27{
          padding-left: 27px;
        }
        width: 100%;
        font-size: 14px;
        color: #515A6E;
        .back, .del, .trans, .publish,.move {
          height: 24px;
          border-radius: 4px;
          padding: 0px 6px;
          margin-left: 12px;
        }
        .trans, .publish {
        background: #278EF8;
        color: #FFFFFF;
        border-color: #278ef8;
      }
        .orderTxt{
          margin-left: 8px;
          font-size: 12px;
          color: #000000;
          padding-top: 3px;
        }
        .allCheck{
          float: right;
          /deep/ .ivu-checkbox{
            margin-right: 5px;
          }
          ///deep/ .ivu-checkbox-inner{
          //  border: 1px solid #198EF8;
          //}
        }
      }
    }
    .list-section{
      overflow-y: scroll;
      height: 740px;
      padding:16px 10px 16px 16px;
      box-sizing:border-box;
      .card{
        width:558px;
        height:56px;
        background:rgba(248,248,248,1);
        border-radius:4px;
        display:flex;
        justify-content:space-between;
        margin-bottom:10px;
        cursor: pointer;
        position: relative;
        &:hover{
          box-shadow:2px 2px 8px 0px rgba(92,92,92,0.32);
        }
        /deep/ .ivu-checkbox{
          position: absolute;
          right: 20px;
          top: 20px;
        }
        ///deep/ .ivu-checkbox-inner{
        //  border: 1px solid #198EF8;
        //}
        .card-item
        {
            display:flex
            .left-one{
              width:40px;
              height:40px;
              margin:8px 23px 8px 28px;
              img
              {
                width:100%;
                height:100%
              }
            }
            .left-two{
                margin-top:8px;
                .title{
                    display:flex;
                    width: 330px;
                    .status{
                      width:52px;
                      height:20px;
                      border-radius: 2px;
                      box-sizing:border-box;
                      font-size: 12px;
                      text-align: center;
                      margin-right:8px;
                    }
                    .noBegin{
                      border: 1px solid #F59A23;
                      color: #F59A23;
                    }
                    .begining{
                      border: 1px solid #198EF8;
                      color: #198EF8;
                    }
                    .end{
                      width: 64px;
                      border: 1px solid #666666;
                      color: #666666;
                    }
                    .quote{
                      width: 34px;
                      height: 20px;
                      background: #FFFFFF;
                      border-radius: 2px;
                      border: 1px solid #999999;
                      line-height:20px;
                      text-align:center;
                      font-size: 12px;
                      font-weight: 400;
                      color: #999999;
                      margin-right:10px
                    }
                    .txt{
                        text-overflow:ellipsis;
                        overflow:hidden;
                        white-space: nowrap;
                        font-size: 14px;
                        color: #333333;
                        flex: 1;
                    }

                }
                .desc{
                    display flex !important;
                    margin-top:3px;
                    font-size: 12px;
                    color: #999999;
                    max-width: 330px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .num, .time{
                        display:flex;
                      .line{
                        width:1px;
                        height:11px;
                        margin:4px 8px 0 8px;
                        background-color: #999999;
                      }
                    }

                    .surplus{
                        color: orange;
                    }
                }
            }
        }
        .right{
            margin-right:21px;
            display:flex;
            align-items:center;
            .actionz {
              position:relative
              .action{
                  display:flex;
                  align-items:center;
                  font-size: 14px;
                  color: #198EF8;
                  cursor:pointer;
                  border-radius: 4px;
                  padding: 6px 8px 6px 6px;
                  &:hover{
                    background: #EDECEC;
                  }
                  .icon{
                    width: 10px;
                    height: 10px;
                    margin-right: 6px;
                    margin-top: 2px;
                  }
                  p{
                    line-height:14px
                  }
              }
              .edit-dialog
              {
                position:absolute;
                z-index:999;
                padding:6px 0;
                width:140px;
                background:rgba(255,255,255,1);
                box-shadow:0px 0px 6px 0px rgba(51,51,51,0.18);
                border-radius:2px;
                right: 50%;
                margin-right: -56px;
                margin-top: 8px;
                .dialog-item
                {
                    height:30px;
                    font-size:14px;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    text-align:center;
                    line-height:30px;
                    cursor:pointer
                    &:hover
                    {
                    background:rgba(244,244,244,1);
                    }
                }
                .del
                {
                    color:rgba(241,3,3,1);
                }
              }
            }
            .edit-data
            {
                position:relative;
                margin-left: 5px;
                &:hover{
                  background: #EDECEC;
                  border-radius: 4px;
                  .edit-dialog{
                    display:block
                  }
                }
                .edit {
                  margin-top:5px;
                  padding: 2px 10px;
                }
                .edit-dialog
                {
                  display:none
                  position:absolute;
                  z-index:999;
                  width:91px;
                  background:rgba(255,255,255,1);
                  box-shadow:0px 0px 6px 0px rgba(51,51,51,0.18);
                  border-radius:2px;
                  right: 50%;
                  margin-right: -45px;
                  .dialog-item
                  {
                      width:91px;
                      height:30px;
                      font-size:14px;
                      font-weight:400;
                      color:rgba(51,51,51,1);
                      text-align:center;
                      line-height:30px;
                      cursor:pointer
                      &:hover
                      {
                      background:rgba(244,244,244,1);
                      }
                  }
                  .del
                  {
                      color:rgba(241,3,3,1);
                  }
                }
            }
        }
    }
    }
    .page{
        position:absolute;
        right:16px;
        bottom:16px;
        /deep/ .ivu-page-item a {
            color: #101010;
        }
    }
    .active{
        box-shadow: 2px 2px 8px 0 rgba(92,92,92,0.32);
    }
    .no-card
    {
        text-align:center;
        overflow:hidden
        .nocard-icon
        {
            width:77px;
            height:54px;
            margin: 300px auto 0;
            img
            {
                width:100%;
                height:100%
            }
        }
        .nocard-info
        {
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            margin-top:24px
            span
            {
                font-size:12px;
                font-weight:400;
                color:rgba(25,142,248,1);
                cursor:pointer
            }
            p{
              padding: 10px 0 !important;
            }
        }
    }
    .footer-page
    {
      position: absolute;
      bottom: 16px;
      right: 10px;
    }
}
.distance {
  padding:9px 24 16px 0;
}
.nocardZ {
  background: #f8f8f8 !important;
  height: 100% !important;
}
.nocardJ {
  background: #f8f8f8 !important;
  height: calc(100% - 49px) !important;
}
.icon-box{
  width: 40px;
  height: 40px;
  background-size: cover;
  border-radius: 8px;
}
// 修改滚动条样式
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background:rgba(238,238,238,1);
  border-radius:3px;
}
.btn-box{
  flex: 1;
  padding-right: 16px;
  button, label{
    float: right;
  }
}
</style>
