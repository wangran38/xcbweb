import request from '@/utils/request'

export function getsignlist(params) {
  return request({
    url: '/admin/usersignlist',
    method: 'post',
    data: params
  })
}

export function getsignlistgroup(params) {
  return request({
    url: '/admin/signlist',
    method: 'post',
    data: params
  })
}
