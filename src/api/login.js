import request from '@/utils/request'

// const url = '/api'

// const newIp = 'http://121.36.62.243:8084'
// const newIp = "http://10.36.28.146:8084"
const newIp = ''
const devPrefix = ''

const flag = !(process.env.NODE_ENV === 'production')

// 用户管理列表
export function goLogin(query) {
  return request({
    url: (flag ? newIp : devPrefix) + '/server/login',
    method: 'post',
    params: query
  })
}
export function logout() {
  return request({
   url: (flag ? newIp : devPrefix) + '/server/logout',
    method: 'get'
  })
}
export function getRoot(query) {
  return request({
      url: (flag ? newIp : devPrefix) + '/server/permission/getPermissionIdsByRoleId?roleIds='+ query,
      method: 'get',
  })
}
export function resetPass(query){
  return request({
    url: (flag ? newIp : devPrefix) + '/server/sysUser/user/updatePwd',
    method: 'post',
    data: query
})
}