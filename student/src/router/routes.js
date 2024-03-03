import { lazy } from 'react';
import Home from '../views/Home';

const routes = [{
  path: '/',
  name: 'home',
  component: Home,
  meta: {
    title: '校园活动平台-WebApp'
  }
},
{
  path: '/detail/:id',
  name: 'detail',
  component: lazy(() => import('../views/Detail')),
  meta: {
    title: '活动详情-校园活动平台'
  }
},
{
  path: '/personal',
  name: 'personal',
  component: lazy(() => import('../views/Personal')),
  meta: {
    title: '个人中心-校园活动平台'
  }
},
{
  path: '/store',
  name: 'store',
  component: lazy(() => import('../views/Store')),
  meta: {
    title: '我的活动-校园活动平台'
  }
},
{
  path: '/login',
  name: 'login',
  component: lazy(() => import('../views/Login')),
  meta: {
    title: '登录-校园活动平台'
  }
},
{
  path: '/update',
  name: 'update',
  component: lazy(() => import('../views/Update')),
  meta: {
    title: '更新个人信息-校园活动平台'
  }
},
{
  path: '*',
  name: '404',
  component: lazy(() => import('../views/Page404')),
  meta: {
    title: '404页面-校园活动平台'
  }
}];

export default routes;