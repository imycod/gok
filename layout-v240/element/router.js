const Foo = {template: '<div>foo</div>'};

const routes = [
  {
    path: '/',
    component: layout,
    redirect: '/foo',
    children: [
      {
        path: '/foo', component: Foo,
        meta: {title: 'Foo', icon: 'http://www.baidu.com/img/flexible/logo/pc/result.png'}
      }
    ]
  },
];


const router = new VueRouter({
  routes
});
