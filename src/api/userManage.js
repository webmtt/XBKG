import request from '@/utils/request'

// const url = '/api'

// const newIp = 'http://10.36.28.146:8084'
const newIp = ''
// const newIp = 'http://192.168.1.162:8084'
const devPrefix = ''

const flag = !(process.env.NODE_ENV === 'production')

// 用户管理列表
export function getUserList(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/sysUser/user/list',
        method: 'get',
        params: query
    })
}
// 用户删除
export function getUserDelete(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/sysUser/user/delete',
        method: 'get',
        params: query
    })
}
// 用户添加
export function getUserAdd(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/sysUser/user/insert',
        method: 'post',
        data: query
    })
}
// 用户编辑
export function getUserUpdate(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/sysUser/user/update',
        method: 'post',
        data: query
    })
}
//加载角色权限管理的列表----lidan
export function getRoleList(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/role/findAllRoleList',
        method: 'get',
        params: query
    })
}
export function deleteRole(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/role/deleteRoleById?id=' + query,
        method: 'get',

    })
}
//修改角色
export function changeRole(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/role/updateRole',
        method: 'post',
        data: query
    })
}
//根据角色查询对应的权限
export function getRoot(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/permission/getPermissionIdsByRoleId?roleIds=' + query,
        method: 'get',
    })
}

//查询所有权限
export function getAllRoot() {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/permission/all',
        method: 'get',
    })
}
//修改权限
export function changeRoot(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/permission/addRolePermissionBatch',
        method: 'post',
        data: query
    })
}

/*服务接口监控*/
/*列表数据*/
export function getServerList(query) {
    return request({
        url: `${newIp}/server/operationLog/list`,
        method: 'get',
        params: query
    })
}
/*获取接口名称*/
export function getInterface() {
    return request({
        url: `${newIp}/server/operationLog/getInterface`,
        method: 'get'
    })
}
/*获取操作者*/
export function getUsername() {
    return request({
        url: `${newIp}/server/operationLog/getUsername`,
        method: 'get'
    })
}


// 日志列表--加载日志
export function getlogList(query) {
    return request({
        url: `${newIp}/server/loginLogs/select`,
        method: 'get',
        params: query
    })
}

// 角色添加
export function getAddRole(query) {
    return request({
        url: (flag ? newIp : devPrefix) + '/server/role/insertRole',
        method: 'post',
        data: query
    })
}