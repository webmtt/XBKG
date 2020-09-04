import request from '@/utils/request'

// const url = '/api'
// const url = ''
const url = 'http://121.36.62.243:8084'
// const newUrl = 'http://10.36.28.146'
const newUrl = 'http://121.36.62.243'

/* 民航气象报文数据*/
// 获取数据列表
export function getMessageList(query) {
  return request({
    url: `${url}/server/application/messageList`,
    // url: `http://192.168.1.41:8084/server/application/messageList`,
    method: 'get',
    params: query
  })
}
// 获取指定类型的字段
export function getFieldsByTypet(query) {
  return request({
    url: `${url}/server/report/fieldsByType`,
    method: 'get',
    params: query
  })
}
// 获取下拉选择框列表
export function getReportList(query) {
  return request({
    url: `${url}/server/report/weatherAttr`,
    method: 'get',
    params: query
  })
}
// 曲线绘制
export function getWeatherDraw(query) {
  return request({
    url: `${url}/server/report/weatherDraw`,
    method: 'get',
    params: query
  })
}

// 数据详情
export function getMessageDetail(query) {
  return request({
    url: `${url}/server/application/detail`,
    method: 'get',
    params: query
  })
}

// 数据删除
export function getMessageDelete(query) {
  return request({
    url: `${url}/server/application/delete`,
    method: 'post',
    data: query
  })
}

// 数据下载
export function getMessageDownload(query) {
  return request({
    url: `${url}/server/application/download`,
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}
// 获取机场省市
export function getProvince(query) {
  return request({
    url: `${url}/server/report/province`,
    method: 'get',
    params: query
  })
}
export function selectProvinceName(query) {
  return request({
    url: `${url}/server/airportLocations/selectProvinceName`,
    method: 'get',
    params: query
  })
}
// 获取所选城市返回机场
export function getAirportList(query) {
  return request({
    url: `${url}/server/report/airportList`,
    method: 'get',
    params: query
  })
}
export function selectCodeAndAirportName(query) {
  return request({
    url: `${url}/server/airportLocations/selectCodeAndAirportName`,
    method: 'get',
    params: query
  })
}
// 获取区域字段
export function getReporttArea(query) {
  return request({
    url: `${url}/server/report/area`,
    method: 'get'
  })
}
// 通过区域返回区域内的机场
export function getReporttAreaProvince(query) {
  return request({
    url: `${url}/server/report/area/province`,
    method: 'get',
    params: query
  })
}
// 返回指定经纬度内的机场
export function getReporttLonLat(query) {
  return request({
    url: `${url}/server/report/airportlist/lonLat`,
    method: 'get',
    params: query
  })
}

/* 常规观测资料*/
// 获取数据列表
export function getNormalGroundList(query) {
  return request({
    url: `${newUrl}:8089/normal/ground_data`,
    method: 'post',
    params: query
  })
}
export function getNormalAutoList(query) {
  return request({
    url: `${newUrl}:8089/normal/auto_station`,
    method: 'post',
    params: query
  })
}
export function getNormalUpperList(query) {
  return request({
    url: `${newUrl}:8089/normal/upper_data`,
    method: 'post',
    params: query
  })
}
//数据类型接口
export function colleSatisticsDataType(query) {
  return request({
    url: `${newUrl}:8084/server/colleSatisticss/getDataType?type=2`,
    method: 'get'
  })
}
// 删除列表数据
export function getNormalDelete(query) {
  return request({
    url: `${newUrl}:8089/normal/deletefile`,
    method: 'post',
    params: query
  })
}
// 单文件下载接口
export function getNormalOneDownload(query) {
  return request({
    url: `${newUrl}:8089/normal/downloadfile`,
    method: 'post',
    params: query
  })
}
// 多文件下载接口
export function getNormalDownload(query) {
  return request({
    url: `${newUrl}:8089/normal/downloadfiles`,
    method: 'post',
    params: query
  })
}

/* 本地自观资料*/
// 获取数据列表
export function getObservationList(query) {
  return request({
    url: `${url}/server/colleSatisticss/getConventionalObservationData`,
    method: 'post',
    data: query
  })
}
// 列表数据详情
export function getObservationDetail(query) {
  return request({
    url: `${url}/server/colleSatisticss/getDetailData`,
    method: 'get',
    params: query
  })
}
// 要素类型
export function getObservationAttr() {
  return request({
    url: `${url}/server/colleSatisticss/getAutoDataType`,
    method: 'get'
  })
}
// 传感器位置类型
export function getAutoLocationID() {
  return request({
    url: `${url}/server/colleSatisticss/getAutoLocationID`,
    method: 'get'
  })
}
// 字段添加模块接口
//(1)根据表名获取字段
export function getObservationFieldInfos(query) {
  return request({
    url: `${url}/server/fieldInfos/getTableFields`,
    method: 'get',
    params: query
  })
}
//(2)修改勾选状态
export function getObservationFieldStatus(query) {
  return request({
    url: `${url}/server/fieldInfos/updateIfshow`,
    method: 'post',
    data: query
  })
}
// 曲线绘制
export function getGraphData(query) {
  return request({
    url: `${url}/server/colleSatisticss/getGraphData`,
    method: 'post',
    params: query
  })
}


/* 重要天气个例*/
// 获取数据列表
export function getWeatherCasesList(query) {
  return request({
    url: `${url}/server/weatherCase/getAll`,
    method: 'get',
    params: query
  })
}
// 列表数据详情
export function getWeatherCasesDetail(id) {
  return request({
    url: `http://121.36.62.243:8084/server/weatherCase/${id}`,
    method: 'get'
  })
}
// 删除列表数据
export function getWeatherCasesDelete(id) {
  return request({
    url: `${url}/server/weatherCase/${id}`,
    method: 'delete'
  })
}

// 添加列表数据
export function getWeatherCasesAdd(query) {
  return request({
    url: `${url}/server/weatherCase`,
    method: 'post',
    data: query
  })
}

// 编辑列表数据
export function getWeatherCasesUpdate(query) {
  return request({
    url: 'http://121.36.62.243:8084/server/weatherCase',
    method: 'put',
    data: query
  })
}

// 历史库数据查询
export function getWeatherCasesHistoryList(query) {
  return request({
    url: `${url}/server/logs/getPageListFileLog`,
    method: 'get',
    params: query
  })
}

/*产品生成数据量统计*/
//统计图表显示
export function getProductEchartsList(query) {
  return request({
    url: `${url}/server/application/tongji`,
    method: 'get',
    params: query
  })
}
export function getProductEchartsList_(query) {
  return request({
    url: `${url}server/logs/getPageListFileStatistic`,
    method: 'get',
    params: query
  })
}
//重要天气预告图
export function getProductWeatherList(query) {
  return request({
    url: `http://121.36.62.243:8084/server/logs/getPageListProg`,
    method: 'get',
    params: query
  })
}

/* 气候统计配置*/
// 获取数据列表
export function airportLocations(query) {
  return request({
    url: `${url}/server/airportLocations/selectList`,
    // url: `${url}/server/airportLocations/selectList?region=''&provinceName=''&airport=''&page=1&limit=20`,
    method: 'get',
    params: query
  })
}
// 机场信息列表是否统计
export function airportLocationsUpdate(query) {
  return request({
    url: `${url}/server/airportLocations/update`,
    method: 'post',
    data: query
  })
}
// 开始定时任务
export function startClimatestatisticsTask(query) {
  return request({
    url: `http://121.36.62.243:9453/quartz/task/startClimatestatisticsTask`,
    method: 'post',
    data: query
  })
}
// 停止定时任务
export function stopClimatestatisticsTask(query) {
  return request({
    url: `http://121.36.62.243:9453/quartz/task/stopClimatestatisticsTask`,
    method: 'post',
    data: query
  })
}
// 手动单次统计任务
export function onceClimatestatisticsTask(query) {
  return request({
    url: `http://121.36.62.243:9453/quartz/task/onceClimatestatisticsTask`,
    method: 'post',
    params: query
  })
}
// 获取定时任务的状态
export function getClimatestatisticsTaskState(query) {
  return request({
    url: `http://121.36.62.243:9453/quartz/task/getClimatestatisticsTaskState`,
    method: 'get',
    params: query
  })
}