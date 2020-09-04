import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import wrapBox from '@/layout/wrapBox'

/* Router Modules */
import collectionConfigRouter from './modules/collectionConfig'
import applicationConfigRouter from './modules/applicationConfig'
import backStateConfigRouter from './modules/backStateConfig'
import storageConfigRouter from './modules/storageConfig'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/basic-configuration',
    component: () => import('@/views/basicConfiguration/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/',
    component: wrapBox,
    redirect: '/index',
    hidden: true
  },
  {
    path: '/index',
    component: wrapBox,
    redirect: '/index',
    meta: {
      title: '首页',
      icon: 'chart'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/admin/index'),
        name: '首页',
        hidden: true,
        meta: {
          title: '首页',
          icon: 'dashboard1',
          affix: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/collection',
    component: wrapBox,
    redirect: '/collection/monitor',
    name:'collection',
    meta: {
      title: '数据采集',
      icon: 'chart'
    },
    children: collectionConfigRouter
  },
  {
    path: '/storage',
    component: wrapBox,
    redirect: '/storage/productStatistics',
    name:'storage',
    meta: {
      title: '数据存储',
      icon: 'chart'
    },
    children: storageConfigRouter
  },

  {
    path: '/application',
    component: wrapBox,
    redirect: '/application/serachDownload',
    name:'application',
    meta: {
      title: '数据应用',
      icon: 'chart'
    },
    children: applicationConfigRouter
  },
  {
    path: '/backstage',
    component: wrapBox,
    redirect: '/backstage/basicFacilities',
    name:'backstage',
    meta: {
      title: '后台管理',
      icon: 'chart'
    },
    children: backStateConfigRouter
  }
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()


// function getRoute(route) {
//   if(route.children) {
//     getRoute()
//   }

// }

router.afterEach((to, from) => {
  console.log(to, from, router)
  // console.log(store.permission.routes)
  // const fatherPath = to.redirectedFrom;
  // const fatherRoute = store.state.permission.routes.filter(item => item.path === fatherPath);

  // router.push({name: 'permission-management'})

})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
