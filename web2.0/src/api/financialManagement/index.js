import request from '@/utils/request'

export function changemoney(params) {
  return request({
    url: '/admin/shop/changemoney',
    method: 'post',
    data: params
  })
}

export function upshopmoney(params) {
  return request({
    url: '/admin/shop/upshopmoney',
    method: 'post',
    data: params
  })
}

