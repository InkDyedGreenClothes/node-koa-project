import Vue from 'vue';
import VueRouter from 'vue-router';
import util from '../utils/util';
import Index from '../views/index/index.vue';
import Login from '../views/login/login.vue';
import Registered from '../views/login/registered.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index 
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/registered',
    name: 'Registered',
    component: Registered
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: 'about' */ '../views/About.vue')
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

const whiteList = ['/login', '/registered'] // 白名单页面
// 路由拦截
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  // 是否已经登陆
  if (util.getToken()) {
    if (from.path === '/system') {
      next()
    }
    // else if (to.path === '/login') {
    //   next({
    //     path: '/'
    //   })
    // }
    else {
      next()
    }
  } else {
    // 在免登录白名单，直接进入
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})
export default router;
