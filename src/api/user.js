import request from '@/utils/request'

export function login(data) {
  return Promise.resolve({
    token: 'admin-token'
  })
}

export function getInfo(token) {
  return Promise.resolve({
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}


