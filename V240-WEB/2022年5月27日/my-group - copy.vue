<!--
 * @Author: lpj 1248708823@qq.com
 * @Date: 2022-05-24 10:31:55
 * @Description: 分组操作
-->
<template>
  <div class="wrapper" @click="closeDropdown">
    <div class="create-container bd cp" v-if="!isCreate">
      <div class="addBox" @click.stop="showCreate">
        <img src="@img/material/creat.png" class="icon" @click.stop="showCreate" />
        <span>新建分组</span>
      </div>
      <!-- 选择弹窗 -->
      <Dropdown placement="bottom-end" @on-click="dropdownClick($event)" :visible="showDropdown" trigger="custom">
        <span class="btn-tip btn-add" title="新建"></span>
        <DropdownMenu slot="list">
          <DropdownItem name="Create">新分组</DropdownItem>
          <!-- <div class="hr-container">
            <div class="hr"></div>
          </div> -->
          <DropdownItem name="ShareCodeCreate">分享码导入</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <!-- 编辑区 -->
    <div v-else>
      <div class="create">
        <Input v-model="partitionName" placeholder="请输入分组名称" class="create-input" @on-enter="createPartition" />
        <div class="action">
          <div class="ok cp" @click="createPartition">
            <Icon type="md-checkmark" color="#00BB85" />
          </div>
          <div class="cancel cp" @click="cancelCreate">
            <Icon type="md-close" color="#8590A6" />
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div v-for="(group, index) of groupList" :key="group.id" class="group cp" :class="[currentId == group.id ? 'cr' : '']" @click="chooseItem(group)">
        <!-- 重命名編輯區 -->
        <div class="edit" v-if="handleActionData.index === index && isEdit">
          <Input v-model="partitionNameByEdit" placeholder="请输入分组名称" class="create-input" @on-enter="createPartition" />
          <div class="action">
            <div class="ok cp" @click="editPartition">
              <Icon type="md-checkmark" color="#00BB85" />
            </div>
            <div class="cancel cp" @click="cancelEdit">
              <Icon type="md-close" color="#8590A6" />
            </div>
          </div>
        </div>
        <div class="group-text" v-else>
          {{ group.name }}
        </div>
        <div class="right" v-show="index > 0 &&!( isEdit && handleActionData.index === index)">
          <!-- 图钉 -->
          <img src="@img/material/ding.png" class="top" v-show="group.top" />
          <Dropdown placement="bottom-start" @on-click="dropdownClick($event)" trigger="click">
            <div class="more" @click="handleMore(group, index)">
              <Icon type="md-more" />
            </div>
            <DropdownMenu slot="list">
              <DropdownItem name="Top" v-if="!group.top">置顶</DropdownItem>
              <DropdownItem name="RemoveTop" v-else>取消置顶</DropdownItem>
              <DropdownItem name="ReName">重命名</DropdownItem>
              <DropdownItem name="Up" v-show="canUp(index)">上移</DropdownItem>
              <DropdownItem name="Down" v-show="canDown(index)">下移</DropdownItem>
              <DropdownItem name="Remove">删除</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <!-- 使用分享码组件 -->
    <UseShareCode v-if="showShareCode" @close="showShareCode = false" :shareType="currentType" @refresh="refreshUseCodeCreate"></UseShareCode>
  </div>
</template>

<script>
import KBAPI from '@/api/KB.API';
import MATERIAL_TYPE from '@e/material-type.js';
import UseShareCode from '@/components/sharecode/use-shareCode';
import { cloneDeep } from 'lodash';
// 分区模型
class GroupModel {
  // 分区信息id
  id = '';
  // 分区类型
  name = '';
  // 置顶0否1是 2是默认服务
  top = 0;
  sort = 0;
}

/**
 * @description: 路由对应的类型映射
 * @key 路由名
 * @value 对应的值
 */
const routerNameMap = {
  MaterialCourse: MATERIAL_TYPE.COURSE.value,
  MaterialCloudStorage: MATERIAL_TYPE.CLOUD_STORAGE.value,
  MaterialExam: MATERIAL_TYPE.QUIZ_PAPE.value,
  MaterialQuestion: MATERIAL_TYPE.TOPIC_BANK.value
};

export default {
  name: 'MyGroup',
  props: ['groupList'],
  components: {
    UseShareCode
  },
  data () {
    return {
      currentId: '',
      // 具体分组下的数据列表
      dataList: [],
      // 是不是创建状态
      isCreate: false,
      // 是不是编辑狀態
      isEdit: false,
      // 展示弹窗 选择新建还是分享码
      showDropdown: false,
      // 展示分享码弹窗
      showShareCode: false,
      // 分区名
      partitionName: '',
      // 分区名-重命名
      partitionNameByEdit: '',
      // 对应操作映射。在mounted初始化
      actionMap: {},
      // 当前要操作的数据 //GroupModel
      handleActionData: {}
    };
  },
  computed: {
    /**
     *@description: 获取最后一个置顶分区的下标
     * @return {Number}
     */
    fGetLastTopIndex () {
      let topIndex = 0;
      this.groupList.forEach((item, index) => {
        if (item.top) {
          topIndex = index;
        }
      });
      return topIndex;
    },
    // 能不能上移
    canUp () {
      return (index) => {
        // 第一个是未分区，在一个单独也无法移动
        if (this.groupList.length < 3) {
          return false;
        }
        return index > 1 && index !== this.fGetLastTopIndex + 1;
      };
    },
    // 能不能下移
    canDown () {
      return (index) => {
        // 第一个是未分区，在一个单独也无法移动
        if (this.groupList.length < 3) {
          return false;
        }
        return (
            index < this.groupList.length - 1 && index !== this.fGetLastTopIndex
        );
      };
    }
  },
  mounted () {
    this.initActions();
  },
  methods: {

    /**
     * @description: 获取当前选中的类型
     * @return {*}
     */
    getCurrentType (routerName) {
      return routerNameMap[routerName];
    },

    /**
     * @description: 点击操作。出现弹窗
     * @param {GroupModel}
     * @return {*}
     */
    handleMore (group, index) {
      // this.restAction()
      this.cancelCreate()
      this.handleActionData = cloneDeep(group);
      this.handleActionData.index = index;
    },
    /**
     * @description: 前往详情界面
     * @param  {GroupModel } group
     */
    chooseItem (group) {
      this.currentId = group.id;
      this.$emit('chooseItem',group)
    },

    /**
     * @description: 展示创建框
     * @return {*}
     */
    showCreate () {
      this.cancelEdit()
      const type = this.currentType;
      // 展示分享码的类型
      const showShareCodeType = [
        MATERIAL_TYPE.CLOUD_STORAGE.value,
        MATERIAL_TYPE.QUIZ_PAPE.value
      ];
      if (showShareCodeType.includes(type)) {
        this.showDropdown = true;
        return;
      }
      this.isCreate = true;
    },

    /**
     * @description: 关闭下拉框
     * @return {*}
     */
    closeDropdown () {
      this.showDropdown = false;
    },

    /**
     * @description: 点击下拉框
     * @return {*}
     */
    async dropdownClick (name) {
      const fn = this.actionMap[name];
      await fn();
    },

    /**
     * @description: 创建分享码id
     * @return {*}
     */
    refreshUseCodeCreate () {
      // TODO: LPJ
    },

    /**
     * @description: 清除操作项
     * @return {*}
     */
    restAction () {
      this.showDropdown = false;
      this.showShareCode = false;
      this.cancelCreate()
      this.cancelEdit()
    },
    /**
     * @description: 新建分区创建
     * @return {*}
     */
    async createPartition () {
      if (!this.partitionName) {
        return this.$Message.error('名称不能为空');
      }
      let res;
      try {
        res = await this.$one.uc.http.post(KBAPI.postAddPartition, {
          data: {
            name: this.partitionName,
            cloudType: this.currentType
          }
        });
        if (res.status !== 200) {
          return this.$Message.error('请求失败, status =' + res.status);
        }
        // 本地变更数组
        const index = this.fGetLastTopIndex;
        this.groupList.splice(index + 1, 0, res.data);
        this.cancelCreate();
        this.$Message.success('添加成功~');
      } catch (error) {
        console.error(error);
        this.$Message.error(
            error?.response?.data?.message || error || '系统异常'
        );
      }
    },

    /**
     * @description: 分区编辑重命名
     * @return {*}
     */
    async editPartition () {
      const oldName = this.handleActionData.name
      if (!this.partitionNameByEdit) {
        return this.$Message.error('名称不能为空');
      }
      let res;
      try {
        res = await this.$one.uc.http.post(KBAPI.updateSubregion, {
          data: {
            name: this.partitionNameByEdit,
            id: this.handleActionData.id
          }
        });
        if (res.status !== 200) {
          return this.$Message.error('请求失败, status =' + res.status);
        }
        this.groupList[this.handleActionData.index].name = this.partitionNameByEdit

        this.cancelEdit()
        this.$Message.success('修改成功~');
      } catch (error) {
        console.error(error);
        this.$Message.error(
            error?.response?.data?.message || error || '系统异常'
        );
      }
    },

    /**
     * @description: 关闭输入框
     * @return {void}
     */
    cancelCreate () {
      this.isCreate = false;
      this.partitionName = '';
    },

    /**
     * @description: 关闭编辑输入框
     * @return {void}
     */
    cancelEdit () {
      this.isEdit = false;
      this.partitionNameByEdit = '';
    },
    /**
     * @description: 初始化操作映射
     * @return {*}
     */
    initActions () {
      this.actionMap = {
        Create: () => {
          this.isCreate = true;
        },
        ShareCodeCreate: () => {
          this.showShareCode = true;
        },
        Top: async () => {
          await this.doTop();
        },
        RemoveTop: async () => {
          await this.RemoveTop();
        },
        ReName: () => {
          this.showReName();
        },
        Up: async () => {
          await this.doSort(true);
        },
        Down: async () => [await this.doSort(false)],
        Remove: async () => {
          await this.doReMove();
        }
      };
    },
    /**
     * @description: 置顶： 基础逻辑：到已有置顶的后面，所有非置顶的前面
     * @return {*}
     */
    async doTop () {
      let res;
      // 保留原始数组
      const oldSort = [].concat(this.groupList);
      const index = this.fGetLastTopIndex;
      // 删除当前节点
      this.groupList.splice(this.handleActionData.index, 1);
      // 插入置顶节点
      const group = this.handleActionData;
      delete group.index;
      group.top = 1;
      this.groupList.splice(index + 1, 0, group);
      // 去掉排序字段
      const partitionIds = this.groupList?.map((el) => {
        return el.id;
      });
      try {
        res = await this.$one.uc.http.post(KBAPI.doTop, {
          data: {
            id: this.handleActionData?.id,
            partitionIds: partitionIds
          }
        });
        this.$Message.success(res?.data.message || '置顶成功~');
      } catch (error) {
        console.error(error);
        this.$Message.error(error?.response?.data?.message || '系统错误');
        // 回滚旧数据
        this.groupList = [].concat(oldSort);
      }
    },
    /**
     * @description: 取消置顶：基础逻辑：所有置顶的后面 到所有非置顶的前面
     * @return {*}
     */
    async RemoveTop () {
      let res;
      // 保留原始数组
      const oldSort = [].concat(this.groupList);
      const index = this.fGetLastTopIndex;
      // 删除当前节点
      this.groupList.splice(this.handleActionData.index, 1);
      // 插入置顶节点
      const group = cloneDeep(this.handleActionData);
      delete group.index;
      group.top = 0;
      this.groupList.splice(index, 0, group);
      // 去掉排序字段
      const partitionIds = this.groupList?.map((el) => {
        return el.id;
      });

      try {
        res = await this.$one.uc.http.post(KBAPI.removeTop, {
          data: {
            id: this.handleActionData?.id,
            partitionIds: partitionIds
          }
        });
        this.$Message.success(res?.data.message || '取消置顶成功~');
      } catch (error) {
        console.error(error);
        this.$Message.error(error?.response?.data?.message || '系统错误');
        // 回滚旧数据
        this.groupList = [].concat(oldSort);
      }
    },
    async showReName () {
      this.isEdit = true;
      this.partitionNameByEdit = this.handleActionData.name
    },

    /**
     * @description: 数组排序（上移下移功能）
     * @param {Boolean} isUp 是不是上移
     * @return {*}
     */
    async doSort (isUp) {
      let res;
      // 保留原始数组
      const oldSort = [].concat(this.groupList);
      // 判断是上移还是下移
      const index = this.handleActionData.index;
      if (isUp) {
        this.swapArray(this.groupList, index - 1, index);
      } else {
        this.swapArray(this.groupList, index, index + 1);
      }
      const partitionIds = this.groupList.map((el) => {
        return el.id;
      });
      try {
        res = await this.$one.uc.http.post(KBAPI.doSort, {
          data: {
            partitionIds: partitionIds
          }
        });
        const msg = isUp ? '上移' : '下移';
        this.$Message.success(`${msg}成功~`);
      } catch (error) {
        console.error(error);
        this.$Message.error(error?.response?.data?.message || '系统错误');
        // 回滚旧数据
        this.groupList = [].concat(oldSort);
      }
    },

    /**
     * @description: 删除当前分区。删除成功之后的下个分区
     * @return {*}
     */
    async doReMove () {
      // 默认分区
      if (this.handleActionData?.top == 2) {
        this.$Message.error('当前分区不可删除');
      }
      // 记住下个分区
      let nextIndex = new GroupModel();
      this.groupList.forEach((item, index) => {
        if (item.id === this.handleActionData?.id) {
          nextIndex = index + 1;
        }
      });
      // 记住下个分区
      let nextGroup = new GroupModel();
      if (nextIndex >= this.groupList.length) {
        nextGroup = this.groupList[0];
      } else {
        nextGroup = this.groupList[nextIndex];
      }
      // 弹窗确认
      this.$Modal.confirm({
        title: '删除提示',
        loading: true,
        content: `<p>确定删除【${this.handleActionData?.name}】分区？</p>`,
        onOk: () => {
          const data = {
            id: this.handleActionData.id
          };
          this.$one.uc.http
              .post(this.$API.KB.deleteSubregion, { data })
              .then((res) => {
                this.$Message.success(res.data.message);
                this.toDetail(nextGroup);
                this.$Modal.remove();
                this.groupList.splice(this.handleActionData.index, 1);
              })
              .catch((err) => {
                console.error(err);
                this.$Message.error(
                    err?.response?.data?.message || err || '系统异常'
                );
                this.$Modal.remove();
              });
        }
      });
    },

    /**
     * 数组元素交换位置
     * @param {array} arr 数组
     * @param {number} index1 添加项目的位置
     * @param {number} index2 删除项目的位置
     * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
     */
    swapArray (arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrapper {
  width: 310px;
  background: #FFFFFF;
  display: flex;
  min-height: 262px;
  // TODO:
  max-height: 652px;
  overflow: scroll;
  flex-direction: column;
  overflow-x: hidden;
  padding-bottom: 5px;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  .create-container {
    width: 310px;
    padding: 7px 0px 11px 16px;
    display: flex;
    align-items: center;

    .addBox {
      display: flex;
    }

    .icon {
      width: 18px;
      height: 18px;
      background: #fff;
      border: 1px solid #D4D6DD;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    span {
      margin-left: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
  }

  .create {
    width: 310px;
    height: 36px;
    background: #E5F4FF;
    display: flex;
    align-items: center;
  }

  .container {
    display: flex;
    flex-direction: column;

    .group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 16px;
      margin-top: 2px;
      width: 310px;
      height: 36px;
      background: #fff;
      font-size: 14px;
      font-weight: 500;
      color: #6A7487;

      overflow-x, &:hover {
        background: #E5F4FF;
      }

      .edit {
        display: flex;
        align-items: center;
        margin-left: -16px;
      }

      .group-text {
        max-width: 240px;
        text-overflow: ellipsis !important;
        white-space: nowrap;
        overflow: hidden;
      }

      .right {
        display: flex;
        align-items: center;
        margin-right: 2px;

        .top {
          width: 16px;
          height: 16px;
        }

        .more {
          margin-right: 20px;
        }
      }
    }

    .cr {
      color: #fff !important;
      background-color: #4B7DFF !important;
    }
  }

  /deep/ .ivu-dropdown-item {
    font-size: 12px;
    font-weight: 400;
    color: #8590A6;
  }

  /deep/ .ivu-dropdown-item:hover {
    color: #FE8836;
    background-color: #fff;
  }

  .hr-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .hr {
      width: 64px;
      height: 1px;
      opacity: 0.5;
      background-color: #D4D6DD;
    }
  }
}

.action {
  display: flex;

  .ok {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 12px;
    width: 26px;
    height: 26px;
    background: #FFFFFF;
    border-radius: 3px 3px 3px 3px;
    border: 1px solid #00BB85;
  }

  .cancel {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 6px;
    width: 26px;
    height: 26px;
    background: #FFFFFF;
    border-radius: 3px 3px 3px 3px;
    opacity: 1;
    border: 1px solid #D4D6DD;
  }
}

.create-input {
  margin-left: 10px;
  width: 220px;

  /deep/ .ivu-input {
    height: 28px;
    width: 220px;
    color: $base;
  }
}
</style>
