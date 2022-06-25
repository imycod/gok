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
          icon: './ico-check.svg',
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
          icon: './member.png',
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
          icon: './export.svg',
        }
      }
    ]
  },
];


const router = new VueRouter({
  routes
});
