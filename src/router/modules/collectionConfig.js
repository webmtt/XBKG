import Layout from '@/layout'

/**
 * 采集配置页面的路由配置
 */

const collectionConfigRouter = [
  {
    path: 'monitor',
    component: Layout,
    meta: {
      title: '数据采集监控',
      icon: 'el-icon-s-opportunity'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/monitor/monitorData'),
        name: 'monitorData',
        meta: { title: '数据源状态', noCache: true }
      },
      {
        path: 'task',
        component: () => import('@/views/monitor/monitorTask'),
        name: 'monitorTask',
        meta: { title: ' 数据量信息', noCache: true }
      },
      {
        path: 'log',
        component: () => import('@/views/monitor/monitorLog'),
        name: 'monitorLog',
        meta: { title: '数据采集日志', noCache: true }
      },
      {
        path: 'warning',
        component: () => import('@/views/monitor/monitorWarning'),
        name: 'monitorWarning',
        meta: { title: '数据采集告警', noCache: true }
      }
    ]
  },
  {
    path: 'bucai',
    component: Layout,
    alwaysShow: true,
    name: 'bucai1',
    meta: {
      title: '数据补采',
      icon: 'el-icon-menu'
    },
    children: [
      {
        path: 'bucai',
        component: () => import('@/views/bucai/index'),
        name: 'bucai2',
        meta: { title: '数据补采', noCache: true }
      }
      // {
      //   path: 'bucaiLog',
      //   component: () => import('@/views/bucai/bucaiLog'),
      //   name: 'monitorTask',
      //   meta: { title: '补采日志', noCache: true }
      // }
    ]
  },
  {
    path: 'source',
    component: Layout,
    name: 'source',
    alwaysShow: true,
    meta: {
      title: '数据采集配置',
      icon: 'el-icon-s-data'
    },
    children: [
      {
        path: 'Config',
        component: () =>
          import('@/views/collectionConfig/dataCollectionConfig'),
        name: 'collectionConfig',
        meta: { title: '数据采集配置', noCache: true }
      }
    ]
  }
]

export default collectionConfigRouter
