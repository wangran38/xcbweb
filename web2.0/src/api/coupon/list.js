import request from '@/utils/request'

export function getcouponlist(params) {
  return request({
    url: '/admin/couponlist',
    method: 'post',
    data: params
  })
}

export function editcoupon(params) {
  return request({
    url: '/admin/editcoupon',
    method: 'post',
    data: params
  })
}
export function addcoupon(params) {
  return request({
    url: '/admin/addnews',
    method: 'post',
    data: params
  })
}
export function getinfo(params) {
  return request({
    url: '/admin/couponinfo',
    method: 'post',
    data: params
  })
}

export function delcoupon(params) {
  return request({
    url: '/admin/delcoupon',
    method: 'post',
    data: params
  })
}