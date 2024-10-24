import request from '@/utils/request'

export function getorderlist(params) {
  return request({
    url: '/admin/order/list',
    method: 'post',
    data: params
  })
}