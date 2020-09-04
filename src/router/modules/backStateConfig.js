import Layout from '@/layout'

/**
 * 采集配置页面的路由配置
 */

const backStageConfigRouter = [
  {
    path: 'basicFacilities',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '基础设施',
      icon: 'el-icon-guide'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/basicFacilities/facilityMonitor'),
        name: 'facility-monitor',
        meta: {
          title: '设施监控',
          noCache: true
        }
      }
    ]
  },
  {
    path: 'userList',
    component: Layout,
    name: 'userList',
    meta: {
      title: '用户权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        path: 'user-management',
        component: () => import('@/views/userlist/userManagement'),
        name: 'user-management',
        meta: { title: '用户管理', noCache: true }
      },
      {
        path: 'permission-management',
        component: () => import('@/views/userlist/permissionManagement'),
        name: 'permission-management',
        meta: { title: '角色权限管理', noCache: true }
      },
      {
        path: 'security-log',
        component: () => import('@/views/userlist/securityLog'),
        name: 'security-log',
        meta: { title: '登录日志', noCache: true }
      }
    ]
  },
  {
    path: 'statusMonitoring',
    component: Layout,
    name: 'statusMonitoring',
    alwaysShow: true,
    meta: {
      title: '应用状态监控',
      icon: 'el-icon-video-camera'
    },
    children: [
      {
        path: 'service-monitoring',
        component: () => import('@/views/userManage/serviceMonitoring'),
        name: 'service-monitoring',
        meta: {
          title: '服务接口监控',
          noCache: true
        }
      },
      {
        path: 'http-rest',
        component: () => import('@/views/userManage/httpRest'),
        name: 'service-rest',
        meta: {
          title: 'Http-Rest接口',
          noCache: true
        }
      }
      // {
      //   "path": "external-link",
      //   "component": Layout,
      //   "children": [
      //     {
      //       "path": "http://10.36.28.146:9401/server/swagger-ui.html#/",
      //       "meta": { "title": "Http-Rest接口" }
      //     }
      //   ]
      // }
    ]
  }
]

export default backStageConfigRouter
