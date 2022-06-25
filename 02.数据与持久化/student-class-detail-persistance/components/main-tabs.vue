<template>
  <div class="tabs">
    <input type="radio" id="tab0" name="tab-control" checked>
    <input type="radio" id="tab1" name="tab-control">
    <input type="radio" id="tab2" name="tab-control">
    <ul>
      <li v-for="(tab,idx) in tabList" @click="switchTab(tab)">
        <label
            :for="`tab`+idx"
            role="button">
          <br><span>{{ tab.name }}</span>
        </label>
      </li>
    </ul>
    <div class="slider">
      <div class="indicator"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tab",
  data() {
    return {
      tabList: [{
        name:'课堂',
        path:'classroom'
      }, {
        name:'简介',
        path:'introduction'
      }, {
        name:'统计',
        path:'statistical'
      }],
    };
  },
  methods:{
    switchTab({path}){
      this.$router.push({
        params: {
          classId: this.$route.params.classId,
          courseId: this.$route.params.courseId,
        },
        query:{
          tab: path
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.tabs input[name=tab-control] {
  display: none;
}

.tabs .content section h2,
.tabs ul li label {
  font-family: "Montserrat";
  font-weight: bold;
  font-size: 18px;
  color: $base;
}

.tabs ul {
  list-style-type: none;
  padding-left: 0;
  display: flex;
  flex-direction: row;
  margin-bottom: 2px;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
}

.tabs ul li {
  box-sizing: border-box;
  flex: 1;
  width: 100px;
  padding: 0 10px;
  text-align: center;
}

.tabs ul li label {
  transition: all 0.3s ease-in-out;
  color: #929daf;
  padding: 5px auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.tabs ul li label br {
  display: none;
}

.tabs ul li label svg {
  fill: #929daf;
  height: 1.2em;
  vertical-align: bottom;
  margin-right: 0.2em;
  transition: all 0.2s ease-in-out;
}

.tabs ul li label:hover, .tabs ul li label:focus, .tabs ul li label:active {
  outline: 0;
  color: #bec5cf;
}

.tabs ul li label:hover svg, .tabs ul li label:focus svg, .tabs ul li label:active svg {
  fill: #bec5cf;
}

.tabs .slider {
  position: relative;
  width: 33%;
  transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
}

.tabs .slider .indicator {
  position: relative;
  width: 20px;
  max-width: 100%;
  margin: 0 auto;
  height: 4px;
  background: $base;
  border-radius: 1px;
}

.tabs input[name=tab-control]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label {
  cursor: default;
  color: $base;
}

.tabs input[name=tab-control]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label svg {
  fill: #428BFF;
}

@media (max-width: 600px) {
  .tabs input[name=tab-control]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label {
    background: rgba(0, 0, 0, 0.08);
  }
}

.tabs input[name=tab-control]:nth-of-type(1):checked ~ .slider {
  transform: translateX(0%);
}

.tabs input[name=tab-control]:nth-of-type(1):checked ~ .content > section:nth-child(1) {
  display: block;
}

.tabs input[name=tab-control]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label {
  cursor: default;
  color: $base;
}

.tabs input[name=tab-control]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label svg {
  fill: #428BFF;
}

@media (max-width: 600px) {
  .tabs input[name=tab-control]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label {
    background: rgba(0, 0, 0, 0.08);
  }
}

.tabs input[name=tab-control]:nth-of-type(2):checked ~ .slider {
  transform: translateX(100%);
}

.tabs input[name=tab-control]:nth-of-type(2):checked ~ .content > section:nth-child(2) {
  display: block;
}

.tabs input[name=tab-control]:nth-of-type(3):checked ~ ul > li:nth-child(3) > label {
  cursor: default;
  color: $base;
}

.tabs input[name=tab-control]:nth-of-type(3):checked ~ ul > li:nth-child(3) > label svg {
  fill: #428BFF;
}

@media (max-width: 600px) {
  .tabs input[name=tab-control]:nth-of-type(3):checked ~ ul > li:nth-child(3) > label {
    background: rgba(0, 0, 0, 0.08);
  }
}

.tabs input[name=tab-control]:nth-of-type(3):checked ~ .slider {
  transform: translateX(200%);
}

.tabs input[name=tab-control]:nth-of-type(3):checked ~ .content > section:nth-child(3) {
  display: block;
}

.tabs input[name=tab-control]:nth-of-type(4):checked ~ ul > li:nth-child(4) > label {
  cursor: default;
  color: #428BFF;
}

.tabs input[name=tab-control]:nth-of-type(4):checked ~ ul > li:nth-child(4) > label svg {
  fill: #428BFF;
}

@media (max-width: 600px) {
  .tabs input[name=tab-control]:nth-of-type(4):checked ~ ul > li:nth-child(4) > label {
    background: rgba(0, 0, 0, 0.08);
  }
}

.tabs input[name=tab-control]:nth-of-type(4):checked ~ .slider {
  transform: translateX(300%);
}

.tabs input[name=tab-control]:nth-of-type(4):checked ~ .content > section:nth-child(4) {
  display: block;
}

</style>
