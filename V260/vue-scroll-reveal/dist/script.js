const sr = ScrollReveal();
// sr.reveal('.greeting');

const mapState = Vuex.mapState;

const store = new Vuex.Store({
  state: {
    developerSkills: [
      { id: 1, className: 'devicon-webpack-plain' },
      { id: 2, className: 'devicon-vuejs-plain' },
      { id: 3, className: 'devicon-react-original' },
      { id: 4, className: 'devicon-nodejs-plain' },
      { id: 5, className: 'devicon-javascript-plain' },
      { id: 6, className: 'devicon-angularjs-plain' },
      { id: 7, className: 'devicon-html5-plain' },
      { id: 8, className: 'devicon-css3-plain' },
      { id: 9, className: 'devicon-csharp-plain' },
      { id: 11, className: 'devicon-mongodb-plain' }]
  }
});



Vue.directive('scroll-reveal-container', {
  inserted(el, binding) {
    const options = binding.value || {};
    console.log(options);
    console.log(el.childNodes);
    sr.reveal(el.childNodes, { reset: true }, options.sequenceDelay);
  }
});


const DeveloperSkill = {
  props: ['className'],
  template: `
    <div class="dev-icon">
      <i :class="className"></i>
    </div>
  ` };

const DeveloperSkillList = {
  template: `
    <div v-scroll-reveal-container="scrollRevealOptions">
      <developer-skill v-for="skill in developerSkills"  :key="skill.id" :className="skill.className"></developer-skill>
    </div>
  `,
  computed: {
    ...mapState({
      developerSkills: state => state.developerSkills
    }),

    scrollRevealOptions() {
      return {
        sequenceDelay: 100
      };

    }
  },

  components: {
    DeveloperSkill
  }
};



new Vue({
  el: '#app',
  store,
  components: {
    DeveloperSkillList
  }
});