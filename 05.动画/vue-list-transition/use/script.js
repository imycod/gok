// https://github.com/DeraIeS/AnimatedList/blob/master/src/components/AnimatedList.vue
// https://medium.com/@tkwebdev/how-to-create-a-staggered-animation-for-paginated-list-in-vue-js-3f887f201456

jQuery( document ).ready( function( $ ){
  
  $.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});
  
Vue.component('anim',{
  
  props: [ 
            'items', 
            'animateIn', 
            'animateOut',
         ],
    
  template: `<div>
               <p>{{items.length}} | {{animateIn}} | {{animateOut}}</p>
               <transition-group v-on:before-enter="beforeEnter"
                                 v-on:enter="enter"
                                 v-on:after-enter="afterEnter"
                                 v-on:before-leave="beforeLeave"
                                 v-on:leave="leave"
                                 v-on:after-leave="afterLeave">
                
                  <slot></slot>
                </transition-group>
              </div>`,
  
  methods: {
    
    // ITEMS IN
    
    beforeEnter(el){
      $(el).hide();
    },
    
    enter(el, done) {
      const delay = (this.items.length * 100) + (el.dataset.index * 100);
      setTimeout(() => {
        $(el).show();
        $(el).animateCss( this.animateIn, function() {
          done();
        });
      }, delay)
    },
        
    afterEnter(el, done) {
      console.log('afterEnter');
    },
    
    // ITEMS OUT
    
    beforeLeave( el ) {
      console.log('beforeLeave');
      $(el).show();
    },
    
    leave(el, done) {
      console.log('Leave');
      const delay = (el.dataset.index * 100);
      setTimeout(() => {
        
        $(el).animateCss( this.animateOut, function() {
          done();
        });
        
      }, delay)
    },
  
    afterLeave(el, done) {
      console.log('afterLeave');
    },
  }
});

Vue.component('posts',{
  
  template: ` <div>
                <h4>Posts</h4>
                  <anim :items="posts" animate-in="zoomIn" animate-out="bounceOut">
                    <li v-for="(post, key) in posts" :key="post.key" :data-index="key">
                      {{post.key}} - {{post.name}}
                    </li>
                  </anim>
                <hr>
                <button type="button" @click="shuffle()">Next</button>
              </div>`,
  
  data: function() {
    return {
      posts: [
        {key: 1, name: "test A"},
        {key: 2, name: "test B"},
        {key: 3, name: "test C"},
        {key: 4, name: "test D"},
        {key: 5, name: "test E"},
        {key: 6, name: "test F"},
        {key: 7, name: "test G"},
      ]
    };
  },
  
  mounted: function(){
    console.log( 'Posts Mounted' );
  },

  methods: {
    
    shuffle: function() {
    
      if(this.posts[0].name != "test A"){
        this.posts = [
        {key: 1, name: "test A"},
        {key: 2, name: "test B"},
        {key: 3, name: "test C"},
        {key: 4, name: "test D"},
        {key: 5, name: "test E"},
        {key: 6, name: "test F"},
        {key: 7, name: "test G"},
        ];
      }
      else{
        this.posts = [
        {key: 8, name: "test H"},
        {key: 9, name: "test I"},
        {key: 10, name: "test J"},
        {key: 11, name: "test K"},
        {key: 12, name: "test L"},
        {key: 13, name: "test M"},
        {key: 14, name: "test N"},
        ];
      }
      
    }
  }
});

new Vue({
  el: "#app",
  template: `<div>
              <h3>Vue App</h3>
              <hr>
              <posts></posts>
              <hr>
            </div>`,

  mounted: function(){
    console.log( 'app mounted' );
  }
});

});