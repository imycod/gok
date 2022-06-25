const Foo = {template: '<div>foo</div>'};
const Bar = {template: '<div>bar</div>'};
const Ho = {template: '<div>ho</div>'};

const routes = [
  {
    path: '/',
    component: layout,
    redirect: '/foo',
    children: [
      {
        path: '/foo', component: Foo,
        meta: {
          title: 'FOO',
          icon: 'https://avatar-static.segmentfault.com/202/841/2028414822-5ee1d794a820a_big64s',
        }
      }
    ]
  },
  {
    path: '/bar',
    component: layout,
    children: [
      {
        path: '', component: Bar,
        meta: {
          title: 'BAR',
          icon: 'https://avatar-static.segmentfault.com/202/841/2028414822-5ee1d794a820a_big64s',
        }
      }
    ]
  },
  {
    path: '/ho',
    component: layout,
    children: [
      {
        path: '', component: Ho,
        meta: {
          title: 'HO',
          icon: 'https://avatar-static.segmentfault.com/202/841/2028414822-5ee1d794a820a_big64s',
        }
      }
    ]
  },
];


const router = new VueRouter({
  routes
});
