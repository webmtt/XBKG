import request from '@/utils/requestPort98'

// const url = '/api'
const url = ''

// 设施监控  获取数据列表
export function getBasicFacilitiesList(query) {
  return request({
    url: `${url}/datasearch/machine`,
    method: 'get',
    params: query 
  })
}
