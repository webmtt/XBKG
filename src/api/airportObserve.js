import request from '@/utils/requestPort98'

// const url = '/api'
// const url = 'http://121.36.62.243:8089'
const url = ''
// const newIp = "10.36.28.146"
const newIp = "121.36.62.243"

// 机场非常规数据观测数据列表
export function getAirportObserveList(query) {
  return request({
    url: `${url}/unnormal/${query.type}`,
    method: 'post',
    params: query
  })
}
export function getAirportObserveListWind(query) {
  return request({
    url: `http://${newIp}:8089/common/list`,
    // url: `http://${newIp}:8089/common/list?page=1&numperpage=10&index=wind_profiling`,
    method: 'post',
    params: query
  })
}

// 单个文件下载接口
export function getDownload(params) {
  return request({
    url: `${url}/unnormal/downloadfile?id=${params.id}&type=${params.type}`,
    method: 'post',
    responseType: 'blob'
  })
}

// 多文件下载接口
export function getListDownload(params) {
  return request({
    url: `${url}/unnormal/downloadfiles?ids=${params.ids}&type=${params.type}`,
    method: 'post',
  })
}
export function getListDownload_(params) {
  return request({
    url: `${url}/common/downloads?db=SPECIAL&ids=${params.ids}&type=${params.type}`,
    method: 'post',
  })
}

// 文件详情接口
export function getDetail(id, outtype,level) {
  return request({
    url: `${url}/unnormal/radarjpgfile/?id=${id}&outtype=${outtype}&level=${level}`,
    method: 'post',
    responseType: 'blob'
  })
}
// fy2G文件详情接口
export function getDetailfy2G(query) {
  return request({
    url: `${url}/unnormal/fy2gjpgfile`,
    method: 'post',
    params: query,
    responseType: 'blob'
  })
}
// k8list文件详情接口
export function getDetailk8list(query) {
  return request({
    url: `http://${newIp}:8089/unnormal/k8jpgfile`,
    method: 'post',
    params: query,
    responseType: 'blob'
  })
}
// 机场天气雷达与机场风廓线文件详情接口
export function cradarjpgfile(query) {
  return request({
    url: `http://${newIp}:8089/unnormal/cradarjpgfile`,
    method: 'post',
    params: query,
    responseType: 'blob'
  })
}
export function cradarjpgargs(query) {
  return request({
    url: `http://${newIp}:8089/unnormal/cradarjpgargs`,
    method: 'post',
    params: query
  })
}

//文件删除接口
export function getObserveDelete(query) {
  return request({
    url: `${url}/unnormal/deletefile?id=${query.id}&type=${query.type}`,
    method: 'post'
  })
}
export function getObserveDelete_(query) {
  return request({
    url: `${url}/common/delete?db=SPECIAL&id=${query.id}&type=${query.type}`,
    method: 'post'
  })
}
export function getObserveDeleteAll(query) {
  return request({
    url: `${url}/common/deletes`,
    method: 'post',
    params:query
  })
}

//数据类型接口
export function colleSatisticsDataType(query) {
  return request({
    url: `http://${newIp}:8084/server/colleSatisticss/getDataType?type=3`,
    method: 'get'
  })
}