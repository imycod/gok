<!--
 * @Author: lpj 1248708823@qq.com
 * @Date: 2022-05-24 10:31:55
 * @Description: 分组操作
-->
<template>
  <div class="wrapper">
    <div>
      <div class="edit bd cp" @click="addPartition">
        <div class="icon ">
          <Icon type="md-add" color="#FE8836"/>
        </div>
        <span>新建分组</span>
      </div>
      <Dropdown placement="bottom-end" @on-click="dropdownClick($event)" :visible="showDropdown" trigger="custom">
        <span class="btn-tip btn-add" title="新建"></span>
        <DropdownMenu slot="list">
          <DropdownItem name="Create">新分组</DropdownItem>
          <DropdownItem name="ShareCodeCreate">分享码导入</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="container">
      <!--      <input class="inputName" type="text" v-model="inputName"-->
      <!--             @blur="doneInput" @keyup.enter="doneInput" @keyup.escape="cancelInput"-->
      <!--             v-show="isInputShow" ref="inputDom"/>-->
      <div v-for="item of cloud" @click="chooseItem(item)" :key="item.id" class="group cp"
           :class="[currentId == item.id?'cr': '']">
        <div class="layout">
          <div class="name">{{ item.name }}</div>
          <div class="edit-data" v-if="showEditIcon(item)">
            <img
                class="dot"
                src="../../assets/images/class-course/dot.png"
                @click.stop="() => {}"
            >
          </div>
          <div class="edit-dialog">
            <!--                <div class="dialog-item" v-if="isMaster===true && (item.type === ACTIVITY_TYPE.COURSEWARE)" @click.stop="downLoadFile(item)">下载</div>-->
            <!--                <div class="dialog-item" @click.stop="forwardContent(item)">转发到班课</div>-->
            <div class="dialog-item" @click.stop="editThisCard(item)">编辑</div>
            <!--                <div class="dialog-item del" v-if="isMaster===true" @click.stop="deleteThisCard(item)">删除</div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ACTIVITY_TYPE from "@/global-data/activity-type";

export default {
  name: 'MyGroup',
  props: ['cloud'],
  data() {
    return {
      currentId: '',
      inputName: '',
      isInputShow: false,
      ACTIVITY_TYPE: ACTIVITY_TYPE, // 活动
      // 展示弹窗 选择新建还是分享码
      showDropdown: false,
    };
  },
  mounted() {
    this.initActions();
  },
  computed: {
    showEditIcon() {
      return item => {
        if (item.type === ACTIVITY_TYPE.VIDEO && item.transProcess !== '100') {
          return false;
        } else {
          return true;
        }
      };
    },
  },
  methods: {

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
     * @description: 点击下拉框
     * @return {*}
     */
    async dropdownClick (name) {
      const fn = this.actionMap[name];
      await fn();
    },


    // 编辑card内容
    editThisCard(item) {
      // this.curItem = item // 当前编辑的card item
      // this.curType = item.type
      // this.noEditName = false
      // this.$store.commit('classCourse/openDrawerOpen', { type: 'ADD' })
    },
    chooseItem(item) {
      this.currentId = item.id;
      this.$emit('chooseItem',item)
    },
    editItem(item) {
      this.editedItem = item;
    },
    addPartition() {
      this.isInputShow = true;
      this.$nextTick(() => {
        this.$refs.inputDom.focus();
      });
      // this.editItem(item)
    },
    doneEdit(item) {
      if (!this.editedItem) {
        return;
      }
      this.editedItem = null;
    },
    cancelInput() {
      this.isInputShow = false;
    },
    cancelEdit(item) {
      this.editedItem = null;
    },
    doneInput() {
      this.isInputShow = false;
      if (!this.inputName) return;
      this.$one.uc.http.post(this.$API.KB.postAddPartition, {
        data: {
          name: this.inputName,
          cloudType: 'activity'
        }
      }).then(res => {
        this.$emit('refreshRequest')
        this.inputName = '';
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.wrapper {
  width: 310px;
  background: #FFFFFF;
  display: flex;
  min-height: 262px;
  max-height: 662px;
  flex-direction: column;

  .edit {
    width: 310px;
    padding: 7px 0px 11px 16px;
    display: flex;
    align-items: center;

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

  .container {
    display: flex;
    flex-direction: column;

    .group {
      display: flex;
      align-items: center;
      padding-left: 16px;
      margin-top: 2px;
      width: 310px;
      height: 36px;
      background: #fff;
      font-size: 14px;
      font-weight: 500;
      color: #6A7487;

      .layout {
        position: relative;
        z-index 1
        width: 100%;
        height: 100%;
        display flex
        align-items center
        justify-content space-between
        .name{
          width: 251px;
          g-text-overflow(1)
        }
        .edit-data {
          position: absolute
          z-index 9
          right 10px
          padding 10px

          &:hover {
            background: #70b4ec;
            border-radius: 4px;

            .edit-dialog {
              display: block
              position: absolute;
              z-index: 2000;
              right 20
              width: 96px;
            }
          }

          .dot {
            display flex
            align-items center
            justify-content center
          }
        }

        .edit-dialog {
          display: none
          position: absolute;
          z-index: 999;
          padding: 6px 0;
          width: 96px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.18);
          border-radius: 2px;
          right: 210%;
          margin-right: -56px;

          .dialog-item {
            width: 96px;
            height: 30px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            text-align: center;
            line-height: 30px;
            cursor: pointer

            &:hover {
              background: rgba(244, 244, 244, 1);
            }
          }

          .del {
            color: rgba(241, 3, 3, 1);
          }
        }
      }

      &:hover {
        background: #E5F4FF;
      }
    }

    .cr {
      color: #fff !important;
      background-color: #4B7DFF !important;
    }
  }
}
</style>
