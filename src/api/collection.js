import request from '@/utils/request'
// import Cookies from 'js-cookie'
// const t = Cookies.get('token')
// http://${newIp}:8084
// const urlOther = ''
const urlOther = 'http://121.36.62.243:8084'
// const url = ''
const url = 'http://121.36.62.243:8084'
// const newIp = "10.36.28.146"
const newIp = "121.36.62.243"

/* 数据采集配置*/
// 获取数据列表
export function getCollectionList(query) {
  return request({
    url: `${urlOther}/server/propsconfigs/selectAll`,
    method: 'post',
    data: query
  })
}
export function getResionInfo(query) {
  return request({
    url: `${urlOther}/server/propsconfigs/resionInfo`,
    method: 'get',
    data: query
  })
}

// 数据详情
export function getCollectionDetails(query) {
  return request({
    url: `${urlOther}/server/propsconfigs/${query}`,
    method: 'get',
    params: query
  })
}

// 数据删除
export function getCollectionDelete(query) {
  return request({
    url: `${urlOther}/server/propsconfigs/delete`,
    method: 'get',
    params: query
  })
}

// 数据添加
export function getCollectionAdd(query) {
  return request({
    url: `${urlOther}/server/propsconfigs/save`,
    // url: `http://192.168.1.162:8084/server/propsconfigs/save`,
    method: 'post',
    data: query
  })
}
// 保存路径属性
export function getDirectoryLevels(query) {
  return request({
    url: `${urlOther}/server/directoryLevels/save`,
    method: 'post',
    data: query
  })
}
// 修改路径属性
export function updateDirectoryLevels(query) {
  return request({
    url: `${urlOther}/server/directoryLevels/update`,
    method: 'post',
    data: query
  })
}

// 数据编辑
export function doSwitch(query) {
  return request({
    url: `http://${newIp}:8083/doSwitch`,
    // url: `http://192.168.1.162:8083/doSwitch`,
    method: 'get',
    data: query
  })
}
// 数据编辑
export function getCollectionUpdate(query) {
  return request({
    url: `${urlOther}/server/propsconfigs/update`,
    // url: `http://192.168.1.162:8084/server/propsconfigs/update`,
    method: 'post',
    data: query
  })
}
// 设置生命周期
export function getLifecycle(query) {
  return request({
    url: `${urlOther}/server/lifeCycleController/setLifeCycle`,
    // url: `http://192.168.1.162:8084/server/lifeCycleController/setLifeCycle`,
    method: 'post',
    data: query
  })
}
// 重置生命周期
export function deleteLifecycle(query) {
  return request({
    url: `${urlOther}/server/lifeCycleController/deleteLifeCycle`,
    method: 'get',
    params: query
  })
}

// 获取本地FTP配置信息
export function getLocalFtpInfo(query) {
  return request({
    url: `${urlOther}/server/propsconfigs/getLocalFtpInfo`,
    method: 'get',
    params: query
  })
}

/* 采集日志查看*/
export function getCollectLogList(query) {
  return request({
    url: `${url}/server/collect/getList`,
    method: 'get',
    params: query
  })
}

/* 采集统计*/
// 列表数据
export function getCollectTaskList(query) {
  return request({
    url: `${url}/server/colleSatisticss/getColleSatisticsByTimeAndType`,
    method: 'get',
    params: query
  })
}
// 柱状图数据
export function getCollectTaskBarList(query) {
  return request({
    url: `${url}/server/colleSatisticss/getStatisticalWithParams`,
    method: 'get',
    params: query
  })
}

// 饼状图数据
export function getCollectTaskPieList(query) {
  return request({
    url: `${url}/server/colleSatisticss/getMsgcountByDate`,
    method: 'get',
    params: query
  })
}
// 数据类型选择(大类型)
export function getDataTypeClassify() {
  return request({
    url: `${url}/server/colleSatisticss/getDataClassify`,
    method: 'get'
  })
}
// 数据类型选择(小类型)
export function getDataType() {
  return request({
    url: `${url}/server/colleSatisticss/getDataType`,
    method: 'get'
  })
}
// 数据类型选择(小类型)
export function getDataTypes(query) {
  return request({
    url: `${url}/server/colleSatisticss/getDataType`,
    method: 'get',
    params: query
  })
}
// 获取类型路径属性
export function getTypepath(query) {
  return request({
    url: `${url}/server/colleSatisticss/getTypepathByDataTypeCode`,
    method: 'get',
    params: query
  })
}
// 获取机场编号信息
export function getAirportCode(query) {
  return request({
    url: `${url}/server/colleSatisticss/getAirportCode`,
    method: 'get',
    params: query
  })
}
// 获取雷达编号
export function getRadarcode(query) {
  return request({
    url: `${url}/server/colleSatisticss/getRadarcodeByDataTypeCode`,
    method: 'get',
    params: query
  })
}

/* 数据采集告警*/
// 数据列表
export function getCollectionWarningList(query) {
  return request({
    url: `${url}/server/colleFileFailds/selectAll`,
    method: 'get',
    params: query
  })
}
// 数据列表详情
export function getWeatherCasesDetail(id) {
  return request({
    url: `${url}/server/colleFileFailds/${id}`,
    method: 'get'
  })
}

/* 数据补采*/
// 列表展示
export function getBucaiList(query) {
  return request({
    url: `${url}/server/report/addFile/getList`,
    method: 'get',
    params: query
  })
}
// 补录数据
export function getBucaiData(query) {
  return request({
    url: `${url}/server/report/addFile`,
    method: 'post',
    data: query
  })
}

// 数据删除
export function getReportDelete(query) {
  return request({
    url: `${urlOther}/server/report/addFile/del`,
    method: 'post',
    data: query
  })
}

// 警告全部标记已读
export function getwarryListUpdata() {
  return request({
    url: `${url}/server/colleFileFailds/updateAll`,
    method: 'get'
  })
}

// 警告标记已读
export function getwarryUpdata(query) {
  return request({
    url: `${url}/server/colleFileFailds/update`,
    method: 'post',
    data: query
  })
}
