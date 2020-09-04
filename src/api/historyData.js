import request from '@/utils/request'
// const url = '/api'
const url = 'http://121.36.62.243:8084'

// 历史数据列表

export function getHistoryList(query) {
  return request({
    url: `${url}/server/logs/getPageListFileLog`,
    method: 'get',
    params: query
  })
}
// 单个文件下载接口
export function getHistoryDownload(query) {
  return request({
    url: `${url}/server/file/downloadHbase`,
    method: 'get',
    params: query,
  })
}
// 多文件下载接口
export function getHistoryListDownload(query) {
  return request({
    url: `${url}/server/file/downloadBatchZip`,
    method: 'get',
    params: query
  })
}
// 文件删除接口
export function getHistoryListDelete(query) {
  return request({
    url: `${url}/server/logs/batchDeleteFileLog`,
    method: 'delete',
    params: query
  })
}
// 文件解析接口
export function getAnalysisHistory(query) {
  return request({
    url: `${url}/server/file/analysisHistory`,
    method: 'get',
    params: query
  })
}

// 飞行计划列表
export function getOltpFplInfos(query) {
  return request({
    url: `${url}/server/oltpFplInfo/getOltpFplInfos`,
    method: 'post',
    params: query
  })
}
// 航空器信息列表
export function getOltpAeroInfos(query) {
  return request({
    url: `${url}/server/oltpAeroInfo/getOltpAeroInfos`,
    method: 'post',
    params: query
  })
}
