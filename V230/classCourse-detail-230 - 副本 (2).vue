<template>
	<view class="classCourseDetail" :style="{ background: backColor }">
			<u-sticky index="header1" zIndex="10001" :disabled="false">
					<view class="classCourseHeader">
						<!-- 返回列表的icon区域 -->
						<view class="classCourseDetail_img" :style="{ background: getBgColor(classId) }">
							<image :src="getBgImage(classId)" mode="aspectFill" v-if="classInfo.imgUrl"></image>
						</view>
						<view class="showSection" :style="{ top: systemHeader + 'rpx' }">
							<image src="~$image/class-230/icon_left_arrow.png" mode="aspectFill" class="smallIcon"
								@click="returnCCList"></image>
						</view>
						<!--  头部标题区 -->
						<view class="classInfo">
							<view class="title">
								<view class="className"> {{ classInfo.className }}</view>
								<view class="badge" v-if="classInfo.labelTxt">
									<image src="~$image/class-230/icon_video_camera.png" mode="aspectFill" class="videoCamera">
									</image>
									<view class="text">{{ classInfo.labelTxt }}</view>
								</view>
							</view>
							<view class="classTeacher" v-if="classInfo.classTeacher">
								任课老师： {{ classInfo.classTeacher }}
							</view>
							<view class="classAssistant" v-if="classInfo.classAssistant">
								班主任: {{ classInfo.classAssistant }}
							</view>
						</view>
					</view>
				</u-sticky>
						<u-sticky index="header2" zIndex="10001" :disabled="true">
						<!-- 滑动时定位的导航 -->
							<nav-bar :border="false" :fixed="false" :statusBar="true" :backgroundColor="getBgColor(classId)"
								:back="true" color="#ffffff" v-if="showFixedNavBar">
								<view class="titleWrap">
									<view class="titleWrap_title" :class="classInfo.labelTxt ? 'w510' : 'w648'">
										{{ classInfo.className }}
									</view>
								</view>
							</nav-bar>
						</u-sticky>
		<view  class="scrollHeight bd">
			<view class="classCourseDetail_wrap">
				<u-sticky>
					<!-- 章节、活动tab -->
					<view class="classCourseTab">
						<view class="classCourseTab_item_wrap">
							<view class="classCourseTab_item" :class="{ active: curTab === item.value }"
								v-for="item in classCourseTabList" :key="item.value" @click="changeTab(item.value)">
								{{ item.name }}
							</view>
						</view>
					</view>
				</u-sticky>
				<!-- 章节列表、活动列表组件 -->
				<view class="list-body" @touchstart="touchStart" @touchend="touchEnd"
					:style="{ 'min-height': minH + 'px' }">
					<view v-if="who==1 || who==2">
						<chaptersTeacherList :from="from" ref="chapters" :who="who" :chapterList="chapterList"
							:classId="classId" :courseId="courseId" :activeFlag="activeFlag"
							v-if="curTab === 'chapter'">
						</chaptersTeacherList>
					</view>
					<view v-if="who==0">
						<chaptersStudentList ref="chapters" :who="who" :chapterList="chapterList" :classId="classId"
							:courseId="courseId" :activeFlag="activeFlag" v-if="curTab === 'chapter'">
						</chaptersStudentList>
					</view>
					<activitiesList :from="from" :who="who" :activityList="activityList"
						:currentActState="currentActState" :classId="classId" :courseId="courseId"
						v-if="curTab === 'activity'"></activitiesList>
				</view>
				<view class="space_height_commander"></view>
			</view>
		</view>
		<view v-if="who!=0" class="commander">
			<commander :classId="classId" @signBtnClickClass="signBtnClick" @startBtnClick="startBtnClick"
				@releaseBtnClick="releaseBtnClick"></commander>
		</view>
		<mLoading v-show="loading"></mLoading>
		<!-- 已有签到的提示层 -->
		<gok-popup ref="tipsHaveSignPopup" type="single" :content="'班课已发起签到，请结束当前活动后继续'" :okText="'去结束'"
			@ok="toFinishSign" />
		<!-- 提示没有活动 或者 课件 提示层 -->
		<no-hava-class-popup ref="tipsNoPopup" type="single" :content1="tipsNoPopupTxt1" :content2="tipsNoPopupTxt2"
			:content3="tipsNoPopupTxt3" :okText="'我知道了'" />
		<!-- 开始活动弹出层 -->
		<uni-popup-gok ref="PopupStartActivity" type="bottom">
			<PopupStartActivity :activityData="activityData" :classId="classId" @cancelPopup="cancelPopupstartActivity">
			</PopupStartActivity>
		</uni-popup-gok>
		<!-- 发布课件弹出层 -->
		<uni-popup-gok ref="PopupReleaseCourseware" type="bottom">
			<PopupReleaseCourseware :coursewareData="coursewareData" :classId="classId"
				@cancelPopup="cancelPopupReleaseCourseware">
			</PopupReleaseCourseware>
		</uni-popup-gok>
		<!-- 快速签到提示层 -->
		<TipsFastSign v-if="TipsFastSignShow" :classId="classId" @handleJoin="handleFastSign">
		</TipsFastSign>
		<!--    <uni-popup ref="sheetPopup" type="bottom" @touchmove.stop="">-->
		<!--      <activityStatus @changeStatus="receptActStatus"></activityStatus>-->
		<!--    </uni-popup>-->
		<gok-popup ref="gokPopup" type="single" :content="'班课已关闭，请与班课管理员联系'" :okText="'我知道了'" @ok="close" />
	</view>
</template>
<script>
	import {
		Component,
		Prop,
		Vue
	} from "vue-property-decorator";
	import chaptersTeacherList from "$common/class/chapters-teacher-list-230.nvue";
	import chaptersStudentList from "$common/class/chapters-student-list-230.nvue";
	import activitiesList from "$common/class/activities-list-230.nvue";
	import activityStatus from "$common/class/activity-status.nvue";
	import commander from "$common/class/commander.nvue";
	import uniPopupGok from "@/components/uni-popup-gok/components/uni-popup/uni-popup.vue";
	import PopupStartActivity from "$common/teach/popup-start-activity.nvue";
	import TipsFastSign from "$common/teach/tips-fast-sign.nvue";
	import TAC from "@/api/TAC.API.js";
	import {
		GET,
		POST
	} from "@/annotation/http.annotation";
	import NavBar from "@/components/uni-nav-bar/uni-nav-bar-linear-gradient.vue";
	import systemHelper from "@/support/systemHelper";
	import GokPopup from "@/components/popup/index";
	import mLoading from "@/components/m-loading/m-loading.vue";
	import {
		Arabia_To_SimplifiedChinese
	} from "@/common/utils.js";
	import $one from "@/one-builder";
	import MEMBER_TYPE from "@/enmu/member-type-220.js";
	import PopupReleaseCourseware from "$common/teach/popup-release-courseware.nvue";
	import noHavaClassPopup from "@/components/teach/no-have-class.nvue";
	import one from '@/one-builder';
	const HEADER_BACK = Object.freeze({
		// BAR_BACkGROUND颜色列表
		BAR_COLOR_LIST: ["#F7B733", "#3AB4F5", "#6A85B6", "#FF9A9E", "#16D9E3"],
		// 颜色渐变列表s
		COLOR_LIST_BG: [
			`linear-gradient(351.84deg, #FF6B00 22.35%, #F7B733 85.89%)`,
			`linear-gradient(336.04deg, #5565FE 19.22%, #78B5FD 47.5%, #3AB4F5 68.22%)`,
			`linear-gradient(180.74deg, #6A85B6 0.67%, #BAC8E0 99.39%)`,
			`linear-gradient(174.99deg, #FF9A9E 2.39%, #FAD0C4 59.77%, #FAD0C4 60.35%)`,
			`linear-gradient(180deg, #16D9E3 0%, #30C7EC 47%, #46AEF7 100%)`,
		],
		// 图片列表
		BG_LIST_IMAGE: [
			require("$image/class-230/mask_orange.png"),
			require("$image/class-230/mask_ocean.png"),
			require("$image/class-230/mask_gray.png"),
			require("$image/class-230/mask_cherry.png"),
			require("$image/class-230/mask_sky.png"),
		],
	});
	// 公用找到对应index
	const useFindIndex = (id) => {
		return Number(id) % HEADER_BACK.COLOR_LIST_BG.length;
	};
	const getClassColor = (id) => {
		return HEADER_BACK.COLOR_LIST_BG[useFindIndex(id)];
	};
	const getStatusBarColor = (id) => {
		return HEADER_BACK.BAR_COLOR_LIST[useFindIndex(id)];
	};
	const getClassImage = (id) => {
		return HEADER_BACK.BG_LIST_IMAGE[useFindIndex(id)];
	};
	@Component({
		components: {
			chaptersTeacherList,
			chaptersStudentList,
			activitiesList,
			activityStatus,
			commander,
			NavBar,
			GokPopup,
			mLoading,
			uniPopupGok,
			PopupStartActivity,
			PopupReleaseCourseware,
			TipsFastSign,
			noHavaClassPopup,
		},
		mounted() {
			uni.$off("_startTeachActivity");
			uni.$off("refreshTeaActivityStatus");
			uni.$off("changeActivitiesStatus");
			uni.$on("_startTeachActivity", (idx, item) => this.getTeacherChapterList());
			uni.$on("refreshTeaActivityStatus", (obj) => this.getTeaActivity());
			uni.$on("changeActivitiesStatus", (val) => this.receptActStatus(val));
			uni.$on("scroll", () => {
				this.isScroll = true;
			});
			uni.$on("scroll-end", () => {
				this.isScroll = false;
			});
			this.systemHeader = systemHelper.px2Rpx(systemHelper.getStatusBarHeight() * 2);
			setTimeout(() => {
				const _this = this;
				uni.getSystemInfo({
					success(res) {
						// - 89
						_this.minH = res.windowHeight - _this.systemHeader - 49 - 16 - 130;
					},
				});
			}, 500);
		},
	})
	export default class classCourseDetail extends Vue {
		defaultIcon = "https://oss.goktech.cn/static/img/public/bg-logo-default.png";
		classCourseTabList = [{
				name: "章节",
				value: "chapter",
			},
			{
				name: "活动",
				value: "activity",
			},
		];
		curTab = "chapter";
		currentActState = "全部";
		courseId = ""; // 课程id
		classId = ""; // 班课id
		classInfo = {}; // 头部信息
		chapterList = []; // 章节列表
		activityList = []; // 活动列表
		status = 3; // 进行中 -> 1， 已结束 -> 2 ，全部(进行中与已结束活动)-> 3
		showFixedNavBar = false;
		systemHeader = 0; // 手机刘海高度
		activeFlag = 1; // 班课是否结束标识，0 结束 1 启用，已结束不埋点
		enterFlag = 1; // 是否允许进入班课 0 不允许 1 允许
		loading = false;
		touchStartX = 0; // 触屏起始点x
		touchStartY = 0; // 触屏起始点y
		minH = 0;
		curIndex = -1;
		finishSignId = ""; // 去结束的签到id
		finishSignType = ""; // 去结束的签到类型
		activityData = {}; // 点击开始活动的 数据
		coursewareData = {}; // 点击发布课件的 数据
		activityOrCoursewareListPageNo = 1; // 活动或者课程的 页数
		TipsFastSignShow = false;
		tipsNoPopupTxt1 = ""; // 提示的文字
		tipsNoPopupTxt2 = ""; // 提示的文字
		tipsNoPopupTxt3 = ""; // 提示的文字
		pageSize = 10;
		clickType = ""; // 点击的 item 的类型   5：课件 6：活动
		from = "2";
		memberType =
			$one.uc.token.getCurTenant().memberType === MEMBER_TYPE.TEACHER.value ? 1 : 0;
		isScroll = false;
		Arabia_To_SimplifiedChinese = Arabia_To_SimplifiedChinese;
		who = ''
		// 根据tab切换不同背景色
		get backColor() {
			if (this.curTab === "chapter") {
				return "#fff";
			} else {
				return "#F6F7F8";
			}
		}

		/**
		 * 触摸开始
		 **/
		touchStart(e) {
			this.touchStartX = e.touches[0].clientX;
			this.touchStartY = e.touches[0].clientY;
		}

		/**
		 * 触摸结束
		 **/
		touchEnd(e) {
			let deltaX = e.changedTouches[0].clientX - this.touchStartX;
			let deltaY = e.changedTouches[0].clientY - this.touchStartY;
			if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
				if (deltaX >= 0) {
					if (this.curTab !== "chapter") {
						this.changeTab("chapter");
					}
				} else {
					if (this.curTab !== "activity") {
						this.changeTab("activity");
					}
				}
			}
		}

		onLoad(option) {
			// option为object类型，会序列化上个页面传递的参数
			this.courseId = option.courseId;
			this.classId = option.classId;
			this.from = option.from;
			this.loading = true;
			// this.changeTab("chapter");
		}

		async onShow() {
			// 各种活动参加完回来后，返回这一页，刷新页面
			plus.navigator.setStatusBarBackground(getStatusBarColor(this.classId));
			const result = await this.judgeClassUser()
			const type = result?.data?.type
			this.who = type
			if (this.curTab === "activity") {
				if (type == 0) {
					this.getActivitiesList();
				} else if (type == 1 || type == 2) {
					this.getTeaActivity();
				}
			} else if (this.curTab === "chapter") {
				// this.curMemberSwitchByGetChapter();
				if (type == 0) {
					this.getStudentChapterList();
				} else if (type == 1 || type == 2) {
					this.getTeacherChapterList();
				}
			}
			this.loading = false
		}
		// 判断“进入班课” 是学生 或是 老师  -1脏数据 0学生 1老师 2班主任
		async judgeClassUser() {
			const result = this.$one.uc.http.get(TAC.judgeClassUser(this.classId), {})
			return result
		}
		// 区分教师还是学生因为要发布课件
		curMemberSwitchByGetChapter() {
			if (this.who == 1 || this.who == 2) {
				this.getTeacherChapterList();
			}
			if (this.who == 0) {
				this.getStudentChapterList();
			}
		}

		// 区分教师还是学生因为要发布课件
		curMemberSwitchByGetActivity() {
			// 老师
			if (this.who == 1 || this.who == 2) {
				this.getTeaActivity();
			}
			if (this.who == 0) {
				this.getActivitiesList();
			}
		}

		// 监听页面滚动
		pageScroll(e) {
			console.log('e.target.offsetTop',e.target.offsetTop)
			if (e.target.offsetTop > 280) {
				// 超过背景图
				this.showFixedNavBar = true;
			} else {
				this.showFixedNavBar = false;
			}
		}

		onPullDownRefresh(){
			console.log('onPullDownRefresh')
			if (this.curTab == "chapter") {
					this.curMemberSwitchByGetChapter()
				}
			 if (this.curTab == "activity") {
				 this.curMemberSwitchByGetActivity()
				}
				uni.stopPullDownRefresh()
		}
		// 若用户点了发布如何？
		refreshCharpterStatus(obj) {
			const target = this.chapterList[obj.cIndex].teaChapterTabDetailRes[obj.bIndex]
				.teaTeachActivityResList[obj.sIndex];
			target.status = obj.status;
		}

		// 获取章节列表
		@GET(TAC.getCourseContents, ["courseId", "classId"])
		getTeacherChapterList(params, result) {
			console.log('result----result---result', result)
			this.classInfo.imgUrl = result.data.imgUrl;
			this.classInfo.className = result.data.className;
			this.classInfo.classAssistant = result.data.classAssistant;
			this.classInfo.classTeacher = result.data.classTeacher;
			this.classInfo.type = result.data.type;
			this.activeFlag = result.data.activeFlag;
			// zzx-- 04.29 没有埋点默认展示第一章 start
			let haveBuried = false
			if(result.data.appTeaChapterTabList.length>0){
				result.data.appTeaChapterTabList.forEach((item) => {
					if (item.flag) {
						haveBuried = true
					}
				})
				if (!haveBuried) result.data.appTeaChapterTabList[0].flag = true
			}
			// zzx-- 04.29 没有埋点默认展示第一章 end
			this.chapterList = result.data.appTeaChapterTabList;
			console.log('this.chapterList-this.chapterList',this.chapterList)
			this.classInfo.labelTxt = "";
			if (result.data.type) {
				// 是否为公开课->班课类型：0普通1慕课
				this.classInfo.labelTxt = "公开课";
			}
			if (result.data.gokFlag) {
				// 是否机构班课(国科一键开课班课），默认为0->否
				this.classInfo.labelTxt = "国科";
			}
			this.enterFlag = result.data.enterFlag;
			if (!this.enterFlag) {
				// 已关闭
				// this.$refs.gokPopup.open();
			}
			this.loading = false;
		}

		// 获取章节列表
		@GET(TAC.getClassCourseChapterList, ["courseId", "classId"])
		getStudentChapterList(params, result) {
			console.log('getStudentChapterList--result', result)
			this.classInfo.imgUrl = result.data.imgUrl;
			this.classInfo.className = result.data.className;
			this.classInfo.classAssistant = result.data.classAssistant;
			this.classInfo.classTeacher = result.data.classTeacher;
			this.classInfo.type = result.data.type;
			this.activeFlag = result.data.activeFlag;
			// zzx-- 04.29 没有埋点默认展示第一章 start
			let haveBuried = false
			if(result.data.appChapterListResList.length>0){
				result.data.appChapterListResList.forEach((item) => {
					if (item.flag) {
						setTimeout(() => {
							haveBuried = true
						}, 1)
					}
				})
				if (!haveBuried) result.data.appChapterListResList[0].flag = true
			}
			// zzx-- 04.29 没有埋点默认展示第一章 end
			this.chapterList = result.data.appChapterListResList;
			console.log('getStudentChapterList this.chapterListthis.chapterListthis.chapterList', this.chapterList)
			this.classInfo.labelTxt = "";
			if (result.data.type) {
				// 是否为公开课->班课类型：0普通1慕课
				this.classInfo.labelTxt = "公开课";
			}
			if (result.data.gokFlag) {
				// 是否机构班课(国科一键开课班课），默认为0->否
				this.classInfo.labelTxt = "国科";
			}
			this.enterFlag = result.data.enterFlag;
			console.log('this.enterFlagthis.enterFlagthis.enterFlagthis.enterFlag', this.enterFlag)
			if (!this.enterFlag) {
				// 已关闭
				this.$refs.gokPopup.open();
			}
			this.loading = false;
		}

		@GET(TAC.getTeaActivity, ["status", "classId"])
		getTeaActivity(params, result) {
			this.activityList = result.data.dataResList;
			this.loading = false;
		}

		// 获取活动列表
		@GET(TAC.getClassCourseActivitiesList, ["status", "classId"])
		getActivitiesList(params, result) {
			console.log('getActivitiesList resultresultresultresult', result)
			this.activityList = result.data.appActivityDataResList;
			this.loading = false;
		}

		// 切换章节与活动tab
		changeTab(val) {
			this.loading=true
			this.curTab = val;
			if (this.curTab === "activity") {
				this.curMemberSwitchByGetActivity();
			} else if (this.curTab === "chapter") {
				this.curMemberSwitchByGetChapter();
			}
		}

		// 活动筛选状态
		// changeActivitiesStatus() {
		// this.$refs.sheetPopup.open();
		// }

		// 接收活动状态值的变化
		receptActStatus(value) {
			if (this.currentActState !== value) {
				this.currentActState = value;
				if (value === "全部") {
					this.status = 3;
				} else if (value === "进行中") {
					this.status = 1;
				} else if (value === "已结束") {
					this.status = 2;
				}
				// this.$refs.sheetPopup.close();
				this.curMemberSwitchByGetActivity();
			}
		}

		// 返回列表页
		returnCCList() {
			uni.navigateBack({
				delta: 1,
			});
		}

		// 返回班课列表页
		close() {
			uni.navigateTo({
				url: `/pages/home-230/index`,
			});
			setTimeout(() => {
				this.$bus.$emit("toggleTab", 1);
			}, 100);
		}

		/**
		 * 获取随机色的图标
		 * 注：不使用computed避免缓存导致随机色不改变
		 **/
		getBgColor(id) {
			return getClassColor(id);
		}

		getBgImage(id) {
			return getClassImage(id);
		}

		// 标签点击签到按钮
		signBtnClick() {
			this.judgeHaveSign();
		}

		// 这是没有签到
		errFunJudgeHaveSign(err) {
			let code = err.response.data.code;
			if (code == 20601) {
				return;
			}
			this.$refs.PopupSignType.open();
		}

		/* 限时签到*/
		cancelPopupLimitSign() {
			this.$refs.PopupLimitSign.close();
		}

		startLimitSign(limitTimestamp) {
			let data = {};
			data.limitTime = limitTimestamp;
			data.classId = this.signClassId;
			this.creatLimitSign(data);
		}

		errFunLimitSign(err) {
			console.log("接口报错：", err.response);
		}

		@POST(TAC.creatLimitSign, ["_classId:signClassId"], "errFunLimitSign")
		creatLimitSign(data, res) {
			// console.log(data,res)
			this.$refs.PopupLimitSign.close();
			let signId = res.data.signId;
			let classId = this.signClassId;
			// 前往签到页面
			uni.navigateTo({
				url: `/pages/teach/teach-sign?type=limit&signId=${signId}&classId=${classId}`,
			});
		}

		/* 限时签到 end */

		/* 快速签到 */
		handleFastSign(type) {
			// console.log(type)
			if (type == "ok") {
				this.createFastSign();
			} else if (type == "noHint") {
				this.createFastSign();
				this.noHint = true;
			} else if (type == "cancel") {
				this.TipsFastSignShow = false;
			}
		}

		errFunCreateFastSign(err) {
			console.log("接口报错：", err.response);
			setTimeout(() => {
				this.TipsFastSignShow = false;
			}, 1000);
		}

		@POST(TAC.createFastSign, ["_classId:signClassId"], "errFunCreateFastSign")
		createFastSign(data, res) {
			// console.log(res)
			let signId = res.data.signId;
			let classId = this.signClassId;
			// 前往签到页面
			uni.navigateTo({
				url: `/pages/teach/teach-sign?type=fast&signId=${signId}&classId=${classId}`,
			});
			this.TipsFastSignShow = false;
		}

		/* 快速签到 end*/

		// 判断是否已有签到的
		@GET(TAC.judgeHaveSign, ["_classId:signClassId"], "errFunJudgeHaveSign")
		judgeHaveSign(params, res) {
			this.finishSignId = res.data.signId;
			this.finishSignType = res.data.signType;
			this.$refs.tipsHaveSignPopup.open();
		}

		releaseBtnClick() {
			this.clickType = 5;
			this.getActivityOrCoursewareList();
		}

		startBtnClick() {
			this.clickType = 6;
			this.getActivityOrCoursewareList();
		}

		errFun(err) {
			console.log("接口报错：", err.response);
		}

		//  接口 获取 活动 或者 课件 列表
		@GET(
			TAC.getActivityOrCoursewareList,
			[
				"classId:clickClassId",
				"type:clickType",
				"pageNo:activityOrCoursewareListPageNo",
				"pageSize",
			],
			"errFun"
		)
		getActivityOrCoursewareList(params, res) {
			let listLen = 0;

			listLen = res.data?.list?.length;
			if (listLen) {
				if (this.clickType === 5) {
					// 课件
					this.coursewareData = res.data;
					// console.log('显示发布课件的弹窗')
					this.$refs.PopupReleaseCourseware.open();
				} else if (this.clickType === 6) {
					// 活动
					this.activityData = res.data;
					this.$refs.PopupStartActivity.open();
				}
			} else {
				// 没有可以开始的 活动 或 课件
				if (this.clickType == 5) {
					this.tipsNoPopupTxt1 = "班课中暂无可发布的课件";
					this.tipsNoPopupTxt2 = "请前往PC端创建";
					this.tipsNoPopupTxt3 = "edu.goktech.cn";
				} else {
					this.tipsNoPopupTxt1 = "班课中暂无可开始的活动";
					this.tipsNoPopupTxt2 = "请前往PC端创建";
					this.tipsNoPopupTxt3 = "edu.goktech.cn";
				}
				this.$refs.tipsNoPopup.open();
			}
		}

		cancelPopupstartActivity() {
			this.activityOrCoursewareListPageNo = 1;
			this.activityData = {};
			this.$refs.PopupStartActivity.close();
		}

		cancelPopupReleaseCourseware() {
			this.activityOrCoursewareListPageNo = 1;
			this.coursewareData = {};
			this.$refs.PopupReleaseCourseware.close();
		}

		// 去结束已有的签到
		toFinishSign() {
			// 前往签到页面
			uni.navigateTo({
				url: `/pages/teach/teach-sign?type=${this.finishSignType}&signId=${this.finishSignId}&classId=${this.signClassId}`,
			});
		}

		onUnload() {
			uni.$off("_startTeachActivity");
			uni.$off("refreshTeaActivityStatus");
			uni.$off("changeActivitiesStatus");
			uni.$off("scroll");
			uni.$off("scroll-end");
		}
	}
</script>
<style lang="scss" scoped>
	.classCourseDetail {
		width: px2Rpx(750);
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow-x: hidden;
		.space_height_commander {
			height: px2Rpx(114);
		}

		.commander {
			position: absolute;
			bottom: 0px;
			left: 0px;
			right: 0px;
			z-index: 999;
			background-color: #fff;
		}

		.titleWrap {
			display: flex;
			flex-direction: column;
			position: absolute;
			left: px2Rpx(74);
			right: px2Rpx(28);
			height: px2Rpx(88);

			.titleWrap_title {
				width: px2Rpx(648);
				font-size: px2Rpx(36);
				font-weight: bold;
				color: #101010;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.w510 {
				width: px2Rpx(510);
				color: #ffffff;
			}

			.w648 {
				width: px2Rpx(648);
				color: #ffffff;
			}

			.openCalss_label {
				width: px2Rpx(104);
				height: px2Rpx(40);
				background-color: #3769ff;
				border-radius: px2Rpx(8);
				font-size: px2Rpx(24);
				color: #ffffff;
				text-align: center;
				line-height: px2Rpx(40);
				position: absolute;
				right: px2Rpx(28);
				top: px2Rpx(24);
			}
		}

.classCourseHeader {
				position: relative;
				width: px2Rpx(750);
				height: px2Rpx(280);

				.classCourseDetail_img {
					width: px2Rpx(750);
					height: px2Rpx(280);
					position: relative;
					z-index: 10;

					image {
						width: px2Rpx(750);
						height: px2Rpx(280);
						display: block;
					}
				}

				.showSection {
					width: px2Rpx(750);
					height: px2Rpx(88);
					position: absolute;
					display: flex;
					flex-direction: row;
					align-items: center;
					z-index: 11;

					.smallIcon {
						position: absolute;
						left: px2Rpx(15);
						height: px2Rpx(48);
						width: px2Rpx(48);
						//border: 1px solid red;
					}
				}

				.classInfo {
					position: absolute;
					width: px2Rpx(750);
					top: px2Rpx(100);
					left: px2Rpx(30);
					z-index: 12;

					.title {
						display: flex;
						align-items: center;

						.className {
							font-size: px2Rpx(36);
							// width: px2Rpx(418);
							margin-right: px2Rpx(10);
							max-width: px2Rpx(418);
							font-weight: 800;
							@include overflowTextDot();
							height: px2Rpx(50);
							color: #ffffff;
							line-height: px2Rpx(50);
						}

						.badge {
							margin-left: px2Rpx(10);
							width: px2Rpx(94);
							display: flex;
							align-items: center;
							height: px2Rpx(38);
							background: linear-gradient(225deg, #39affd 0%, #477fff 100%);
							border-radius: px2Rpx(8) px2Rpx(8) px2Rpx(8) px2Rpx(0);

							.videoCamera {
								width: px2Rpx(24);
								height: px2Rpx(24);
								margin-left: px2Rpx(8);
							}

							.text {
								font-size: px2Rpx(18);
								font-weight: 400;
								color: #ffffff;
							}
						}
					}

					.classTeacher {
						font-size: px2Rpx(24);
						font-weight: 500;
						color: #ffffff;
						line-height: px2Rpx(24);
						margin-top: px2Rpx(18);
					}

					.classAssistant {
						margin-top: px2Rpx(8);
						font-size: px2Rpx(24);
						font-weight: 500;
						color: #ffffff;
						line-height: px2Rpx(24);
						width: px2Rpx(547);
					}
				}
			}

		.scrollHeight {
			position: relative;
			z-index: 999;
			top: px2Rpx(-1); /* ios需加，否则不会在header-bottom上 */
			height: 100%;
			overflow-x: hidden;

			.classCourseDetail_wrap {
				z-index: 101;
				flex: 1;
				width: px2Rpx(750);
				box-sizing: border-box;
				position: relative;

				.classCourseDetail_header {
					margin-top: px2Rpx(-142);
					width: px2Rpx(718);
					background: #ffffff;
					box-shadow: px2Rpx(0) px2Rpx(6) px2Rpx(20) px2Rpx(0) rgba(0, 0, 0, 0.08);
					border-radius: px2Rpx(16);
					padding: px2Rpx(40) px2Rpx(30);
					box-sizing: border-box;

					.classCourseDetail_header_top {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;

						.classCourse_name {
							margin-top: px2Rpx(-6);
							font-size: px2Rpx(38);
							font-weight: bold;
							color: #101010;

							&.classNameWidth {
								width: px2Rpx(520);
							}
						}

						.label {
							width: px2Rpx(104);
							height: px2Rpx(40);
							background-color: #3769ff;
							border-radius: px2Rpx(8);
							font-size: px2Rpx(24);
							color: #ffffff;
							text-align: center;
							line-height: px2Rpx(40);
						}
					}

					.classCourseDetail_header_bottom {
						margin-top: px2Rpx(36);

						.classCourseDetail_header_bottom_item {
							margin-bottom: px2Rpx(20);
							display: flex;
							flex-direction: row;
							align-items: center;
							font-size: px2Rpx(24);

							&:last-child {
								margin-bottom: px2Rpx(0);
							}

							.classCourseDetail_teacher {
								width: px2Rpx(96);
								display: flex;
								justify-content: flex-end;
								flex-direction: row;
								color: #a1a1a1;
							}

							.classCourseDetail_teacher_item {
								margin-left: px2Rpx(20);
								height: px2Rpx(40);
								line-height: px2Rpx(40);
								background: #f4f5f6;
								border-radius: px2Rpx(8);
								padding: px2Rpx(0) px2Rpx(16);
								color: #666666;
							}
						}
					}
				}

				.current-charpter-name {
					background: #fff;

					.border-bottom {
						position: relative;
					}

					.border-bottom:before {
						content: '';
						display: inline-block;
						position: absolute;
						width: px2Rpx(690);
						border: px2Rpx(1) solid #e5e5e5;
						margin-left: px2Rpx(30);
						left: 0;
						right: 0;
						top: 0;
						background-color: #e5e5e5;
						transform-origin: 0 0;
						transform: scaleY(1);
					}

					.border-bottom-android:before {
						transform: scaleY(0.5);
					}

					.chapterCard_header {
						height: px2Rpx(88);
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						box-sizing: border-box;
						padding: px2Rpx(20) px2Rpx(30);

						.chapterName {
							font-size: px2Rpx(28);
							color: #333333;
							font-weight: bold;
						}
					}
				}

				.classCourseTab {
					box-sizing: border-box;
					padding: px2Rpx(22) px2Rpx(162);
					width: px2Rpx(750);
					height: px2Rpx(80);
					background: #ffffff;
					//margin-top: px2Rpx(16);
					border-bottom: px2Rpx(1) solid #dddddd;

					.classCourseTab_item_wrap {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;

						.classCourseTab_item {
							font-size: px2Rpx(26);
							font-weight: 500;
							color: $gok-text-color-default-theme;

							&.active {
								color: $gok-text-color-active-theme;
								font-weight: 800;
								font-size: px2Rpx(26);
								position: relative;
							}

							&.active:before {
								content: '';
								width: px2Rpx(36);
								height: px2Rpx(6);
								border-radius: px2Rpx(5);
								position: absolute;
								bottom: px2Rpx(-14);
								left: px2Rpx(8);
								background: $gok-border-bottom-color;
							}
						}
					}

					.activities_status_wrap {
						display: flex;
						flex-direction: row;
						align-items: center;

						.activities_status_txt {
							font-size: px2Rpx(28);
							color: #101010;
						}

						.activities_status_img {
							margin-left: px2Rpx(12);
							width: px2Rpx(20);
							height: px2Rpx(22);
							display: block;
						}
					}
				}
			}
		}
	}
</style>
