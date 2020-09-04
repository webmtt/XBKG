import request from '@/utils/request'

// const url = '/api'
// const url = ''
const url = 'http://121.36.62.243:8084'
const newIp = "http://121.36.62.243:8089"

/* 首页*/
// 首页全国自观数据点击机场显示详情接口
export function getAirporDetail(query) {
  return request({
    url: `${url}/server/report/changgui/latestReport`,
    method: 'get',
    params: query
  })
}
// 首页全国自观数据隔段时间显示机场信息接口
export function getAirporInfo(query) {
  return request({
    url: `${url}/server/report/changgui/AirportReport`,
    method: 'get',
    params: query
  })
}
// 首页轮播图片
export function getLoopPicture(picturetype) {
  return request({
    url: `${newIp}/loop/pictures?filetype=${picturetype}`,
    method: 'post',
    data: {
      filetype: picturetype
    }
  })
}
// 首页服务接口调用
export function getInterfaceStatistics(query) {
  return request({
    url: `${url}/server/operationLog/getInterfaceStatistics`,
    method: 'get',
    params: query
  })
}
export function pushWebsocket(query) {
  return request({
    url: `${url}/server/pushWebsocket`,
    method: 'get',
    params: query
  })
}
