import Layout from '@/layout'

/**
 * 数据存储页面的路由配置
 */
const storageConfigRouter = [
  {
    path: 'productStatistics',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '存储统计',
      icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: '',
        component: () =>
          import('@/views/storageConfig/dataStorageMonitorMongoDB'),
        name: 'data-storage-monitoring',
        meta: {
          title: 'MongoDB存储容量统计',
          noCache: true
        }
      },
      {
        path: 'Hbase',
        component: () => import('@/views/storageConfig/dataStorageMonitor'),
        name: 'data-storage',
        meta: {
          title: 'Hbase存储容量统计',
          noCache: true
        }
      }
    ]
  },
  {
    path: 'datasetManagement',
    component: Layout,
    alwaysShow: true,
    name: 'datasetManagement1',
    meta: {
      title: '数据集管理',
      icon: 'el-icon-coordinate'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/storageConfig/datasetManagement'),
        name: 'datasetManagement2',
        meta: { title: '数据集管理', noCache: true }
      }
    ]
  },
  {
    path: 'lifecycleManagement',
    component: Layout,
    name: 'lifecycleManagement',
    alwaysShow: true,
    meta: {
      title: '生命周期管理',
      icon: 'el-icon-time'
    },
    children: [
      {
        path: 'lifecycle-management',
        component: () => import('@/views/storageConfig/lifecycleManagement'),
        name: 'lifecycle-managemente',
        meta: { title: '生命周期管理', noCache: true }
      }
    ]
  },
  {
    path: 'data_calculation',
    component: Layout,
    name: 'data_calculation',
    alwaysShow: true,
    meta: {
      title: '数据计算',
      icon: 'el-icon-time'
    },
    children: [
      {
        path: 'calculation_module',
        component: () => import('@/views/storageConfig/calculationModule'),
        name: 'calculation_module',
        meta: { title: '计算模块', noCache: true }
      },
      {
        path: 'process_engine',
        component: () => import('@/views/storageConfig/flowEngine'),
        name: 'process_engine',
        meta: { title: '流程引擎', noCache: true }
      },
      {
        path: 'process_result',
        component: () => import('@/views/storageConfig/processResult'),
        name: 'process_result',
        meta: { title: '流程执行结果', noCache: true }
      }
    ]
  },
]

export default storageConfigRouter
