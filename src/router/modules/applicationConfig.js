import Layout from '@/layout'

/**
 * 采集配置页面的路由配置
 */

const applicationConfigRouter = [
  {
    path: 'serachDownload',
    component: Layout,
    meta: {
      title: '查询下载',
      icon: 'el-icon-search'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/application/localObserve'),
        name: 'localObserve',
        meta: { title: '本地自观数据', noCache: true, keepAlive: true }
      },
      {
        path: 'Message',
        component: () => import('@/views/application/aviationMessage'),
        name: 'aviationMessage',
        meta: { title: '民航气象报文数据', noCache: true, keepAlive: true }
      },
      {
        path: 'normal-observe',
        component: () => import('@/views/application/normalObserve'),
        name: 'normalObserve',
        meta: { title: '常规观测数据', noCache: true, keepAlive: true }
      },
      {
        path: 'airport-observe',
        component: () => import('@/views/application/airportObserve'),
        name: 'airportObserve',
        meta: { title: '非常规观测资料', noCache: true }
      },
      {
        path: 'forecast-data',
        component: () => import('@/views/application/forecastData'),
        name: 'forecastData',
        meta: { title: '模式预报资料', noCache: true }
      },
      {
        path: 'product-observe',
        component: () => import('@/views/application/productObserve'),
        name: 'productObserve',
        meta: { title: '预报产品数据', noCache: true }
      },
      {
        path: 'history-data',
        component: () => import('@/views/application/historyData'),
        name: 'historyData',
        meta: { title: '历史资料数据', noCache: true }
      },
      {
        path: 'oltpFplInfo',
        component: () => import('@/views/application/oltpFplInfo'),
        name: 'oltpFplInfo',
        meta: { title: '飞行计划信息', noCache: true }
      },
      {
        path: 'oltpAeroInfo',
        component: () => import('@/views/application/oltpAeroInfo'),
        name: 'oltpAeroInfo',
        meta: { title: '航空器信息', noCache: true }
      },
    ]
  },
  {
    path: 'dataStatistics',
    component: Layout,
    name: 'dataStatistics',
    meta: {
      title: '数据统计',
      icon: 'el-icon-coin'
    },
    children: [
      {
        path: 'climateConfiger',
        component: () => import('@/views/application/climateConfiger'),
        name: 'climateConfiger',
        meta: { title: '气候统计配置', noCache: true }
      },
      {
        path: 'weather-cases',
        component: () => import('@/views/application/weatherCases'),
        name: 'weatherCases',
        meta: { title: '重要天气个例', noCache: true }
      },
      {
        path: 'climate',
        component: () => import('@/views/application/climate.vue'),
        name: 'monitorView',
        meta: { title: '气候观测数据', noCache: true }
      },
      {
        path: 'product-statistics',
        component: () => import('@/views/application/productStatistics'),
        name: 'productStatistics',
        meta: { title: '产品生成数据量统计', noCache: true }
      }
    ]
  }
]

export default applicationConfigRouter
