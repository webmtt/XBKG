import request from '@/utils/request'

// const newIp = "10.36.28.146"
const newIp = "121.36.62.243"
// const url = '/api-li'
const url = 'http://${newIp}:8082';

// 预报数据  数据列表
export function getTypeList(params) {
  return request({
    url: `http://${newIp}:8089/grib/typelist`,
    method: 'post',
    params
  })
}

export function getDirList(params) {
  return request({
    url: `http://${newIp}:8089/grib/dirlist`,
    method: 'post',
    params
  })
}

export function getElementByTypeAndDir(params) {
  return request({
    url: `http://${newIp}:8089/grib/elementlist`,
    method: 'post',
    params
  })
}

export function getForecastList(data) {
  return request({
    url: `http://${newIp}:8082/numerical_index_search`,
    method: 'post',
    data
  })
}
// 文件详情接口
export function getDetail(query) {
  return request({
    url: `http://${newIp}:8089/grib/gribview`,
    method: 'post',
    params: query,
    responseType: 'blob'
  })
}
// 单个文件下载接口
export function getDownload(query) {
  return request({
    url: `http://${newIp}:8089/grib/download`,
    method: 'post',
    params: query
  })
}
// 多文件下载接口
export function getListsDownload(query) {
  
  return request({
    url: `http://${newIp}:8089/grib/downloads`,
    method: 'post',
    params: query
  })
}

export function deleteRowData(data) {
  return request({
    url: `http://${newIp}:8082/numerical_data_delete`,
    method: 'post',
    data
  })
}


/*预报产品数据*/
// 列表数据
export function getforecastProductList(query) {
  return request({
    url: `http://${newIp}:8089/prog/proglist`,
    method: 'post',
    params: query
  })
}
// 获取文件资源路径
export function getforecastProductDocUrl(query) {
  return request({
    url: `http://${newIp}:8089/prog/downloadurl`,
    method: 'post',
    params: query
  })
}
// 单个文件下载接口
export function getforecastProductDownload(query) {
  return request({
    url: `http://${newIp}:8089/prog/downloadfile`,
    method: 'post',
    params: query,
    responseType: 'blob'
  })
}
// 多文件下载接口
export function getforecastListDownload(query) {
  return request({
    url: `http://${newIp}:8089/prog/downloadfiles`,
    method: 'post',
    params: query
  })
}
// 文件删除接口
export function getForecasDelete(query) {
  return request({
    url: `http://${newIp}:8089/prog/deletefile`,
    method: 'post',
    params: query
  })
}