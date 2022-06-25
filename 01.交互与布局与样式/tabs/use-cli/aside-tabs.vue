<template>
  <div class="aside-tabs">
    <input v-for="i in 2" type="radio" :id="`asideTab`+(i-1)" name="asideTab-control" :checked="activeTab === (i-1)">
    <ul>
      <li
          v-for="(tab,idx) in tabList"
          @click="switchTab({tab,idx})">
        <label
            :for="`asideTab`+idx"
            role="button">
          <span>{{ tab.name }}</span>
        </label>
      </li>
    </ul>
    <div class="slider">
      <div class="indicator center"></div>
    </div>
  </div>
</template>

<script>
import { stuStorage } from '../index.js';

export default {
  name: 'aside-tab',
  props: {
    activeTab: {
      type: Number,
      default: 0
    },
    tabList: {
      type: Array,
      default: () => {
        return [{
          name: '章节',
          path: 'chapter'
        }, {
          name: '活动',
          path: 'activity'
        }]
      }
    }
  },
  data () {
    return {

    };
  },
  methods: {
    switchTab ({ tab, idx }) {
      this.$emit('tabClick', idx);
      stuStorage.set('asideTab', idx);
    }
  }
};
</script>

<style lang="stylus" scoped>
.aside-tabs input[name=asideTab-control] {
  display: none;
}

.aside-tabs .content section h2,
.aside-tabs ul li label {
  font-family: "Montserrat";
  font-weight: bold;
  font-size: 18px;
  color: $base;
}

.aside-tabs ul {
  list-style-type: none;
  padding-left: 0;
  display: flex;
  flex-direction: row;
  margin-bottom: 2px;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
}

.aside-tabs ul li {
  box-sizing: border-box;
  flex: 1;
  width: 100px;
  text-align: center;
}

.aside-tabs ul li label {
  color: #929daf;
  padding: 5px auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.aside-tabs ul li label br {
  display: none;
}

.aside-tabs ul li label svg {
  fill: #929daf;
  height: 1.2em;
  vertical-align: bottom;
  margin-right: 0.2em;
  transition: all 0.2s ease-in-out;
}

.aside-tabs ul li label:hover, .aside-tabs ul li label:focus, .aside-tabs ul li label:active {
  outline: 0;
  color: #bec5cf;
}

.aside-tabs ul li label:hover svg, .aside-tabs ul li label:focus svg, .aside-tabs ul li label:active svg {
  fill: #bec5cf;
}

.aside-tabs .slider {
  position: relative;
  width: 50%;
  transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
  top: -6px;
}

.aside-tabs .slider .indicator {
  position: relative;
  width: 70%;
  left 15%;
  max-width: 100%;
  margin: -6 auto !important;
  height: 4px;
  background: $base;
  border-radius: 1px;
}

.aside-tabs input[name=asideTab-control]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label {
  cursor: default;
  color: $base;
}

.aside-tabs input[name=asideTab-control]:nth-of-type(1):checked ~ .slider {
  transform: translateX(0%);
}

.aside-tabs input[name=asideTab-control]:nth-of-type(1):checked ~ .content > section:nth-child(1) {
  display: block;
}

.aside-tabs input[name=asideTab-control]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label {
  cursor: default;
  color: $base;
}

.aside-tabs input[name=asideTab-control]:nth-of-type(2):checked ~ .slider {
  transform: translateX(100%);
}

</style>
