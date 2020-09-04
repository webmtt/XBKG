import request from '@/utils/request'
// const newIp = "10.36.28.146"
const newIp = "121.36.62.243"

// 文件配置
export function getAllKeyValue() {
  return request({
    url: `http://${newIp}:9403/config/getAllKeyValue`,
    method: 'get'
  })
}

export function setKeyValue(data) {
  return request({
    url: `http://${newIp}:9403/config/setKeyValue`,
    method: 'post',
    data: data
  })
}