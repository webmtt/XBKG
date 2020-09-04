import request from '@/utils/request'

// const url = '/api'
const newIp = "121.36.62.243"


/*数据存储容量监控*/
export function getStorageMonitor(query) {
  return request({
    url: `http://${newIp}:8086/monitor/MonitoringInfo/queryNewMonitoringInfo`,
    method: 'post',
    params: query
  })
}

/* 数据采集配置*/
// 获取数据列表
export function getdataStatisticsData(query) {
  return request({
    url: `http://${newIp}:8084/server/logs/getPageListdataTypeLog?isMonth=true&eventTimeBegin=2020-01&eventTimeEnd=2020-03`,
    method: 'get',
    params: query
  })
}
/*计算模块*/
// 获取数据列表
export function getPluginTabList(query) {
  return request({
    url: `http://${newIp}:1800/plugin_tab/getPluginTabList`,
    method: 'post',
    data: query
  })
}
// 新增数据
export function addPluginTab(query) {
  return request({
    url: `http://${newIp}:1800/plugin_tab/addPluginTab`,
    method: 'post',
    data: query
  })
}
// 编辑数据
export function updatePluginTab(query) {
  return request({
    url: `http://${newIp}:1800/plugin_tab/updatePluginTab`,
    method: 'post',
    data: query
  })
}
// 删除数据
export function deletePluginTab(query) {
  return request({
    url: `http://${newIp}:1800/plugin_tab/deletePluginTab`,
    method: 'get',
    params: query
  })
}
// 删除数据
export function deletePlugin(query) {
  return request({
    url: `http://${newIp}:1800/plugin_tab/deletePlugin`,
    method: 'get',
    params: query
  })
}
// 上传文件
export function uploadPlugin(query) {
  return request({
    url: `http://${newIp}:1800/plugin_tab/uploadPlugin`,
    method: 'post',
    data: query
  })
}
/*流程引擎*/
// 获取数据列表
export function getFlowTabList(query) {
  return request({
    url: `http://${newIp}:1800/flow-tab/getFlowTabList`,
    method: 'post',
    data: query,
  })
}
// 添加流程
export function addFlowTab(query) {
  return request({
    url: `http://${newIp}:1800/flow-tab/addFlowTab`,
    method: 'post',
    data: query
  })
}
// 修改流程
export function updateFlowTab(query) {
  return request({
    url: `http://${newIp}:1800/flow-tab/updateFlowTab`,
    method: 'post',
    data: query
  })
}
// 启动流程
export function addjob(query) {
  return request({
    url: `http://${newIp}:1800/job/addjob`,
    method: 'post',
    params: query
  })
}
// 删除流程记录
export function deleteFlowTab(query) {
  return request({
    url: `http://${newIp}:1800/flow-tab/deleteFlowTab`,
    method: 'post',
    data: query
  })
}
// 删除流程执行任务
export function remove(query) {
  return request({
    url: `http://${newIp}:1800/job/remove`,
    method: 'post',
    data: query
  })
}
// 恢复流程
export function resume(query) {
  return request({
    url: `http://${newIp}:1800/job/resume`,
    method: 'post',
    params: query
  })
}
// 暂停流程
export function pause(query) {
  return request({
    url: `http://${newIp}:1800/job/pause`,
    method: 'post',
    params: query
  })
}
// 编辑流程周期
export function reschedulejob(query) {
  return request({
    url: `http://${newIp}:1800/job/reschedulejob`,
    method: 'post',
    params: query
  })
}
/*流程执行结果*/
// 获取数据列表
export function getFlowStatusTabList(query) {
  return request({
    url: `http://${newIp}:1800/flow-status-tab/getFlowStatusTabList`,
    method: 'post',
    data: query
  })
}