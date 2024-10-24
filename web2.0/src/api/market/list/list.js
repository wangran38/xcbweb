import request from '@/utils/request'

export function getmarketlist(params) {
  return request({
    url: '/admin/marketlist',
    method: 'post',
    data: params
  })
}