import request from '@/utils/request'

export function getuserinfolist(params) {
  return request({
    url: '/admin/user/list',
    method: 'post',
    data: params
  })
}