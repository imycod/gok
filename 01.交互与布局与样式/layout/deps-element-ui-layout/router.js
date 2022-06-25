const Foo = {template: '<div>foo</div>'};
const Bar = {template: '<div>bar</div>'};
const Ho = {template: '<div>ho</div>'};
const routes = [
  // {
  //   path: '/foo',
  //   component: layout,
  //   children: [
  //     {
  //       path: '', component: Foo,
  //       meta: {
  //         title: 'FOO',
  //         icon: '../../../static/img/foo.png',
  //       }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: layout,
    redirect: '/foo',
    children: [
      {
        path: '/foo', component: Foo,
        meta: {
          title: 'FOO',
          icon: '../../../static/img/foo.png',
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
          icon: '../../../static/img/foo.png',
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
          icon: '../../../static/img/foo.png',
        }
      }
    ]
  },
];


const router = new VueRouter({
  routes
});
