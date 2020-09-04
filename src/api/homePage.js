import request from '@/utils/request'
// const url = '/api'
const url = ''

// 年月日统计接口
export function getStatics() {
  return request({
    url: `${url}/server/colleSatisticss/getStatistical`,
    method: 'get'
  })
}

// // 六种报文数据接口
// export function getFileDataLists(query) {
//   return request({
//     url: '/server/colleSatisticss/getColleSatisticssByHour',
//     method: 'get',
//     params: query
//   })
// }

// 自观报文数据接口
export function getWindOrVisEhartsData(query) {
  return request({
    url: `${url}/server/pvVisWinds/getPvVisWind`,
    method: 'get',
    params: query
  })
}
