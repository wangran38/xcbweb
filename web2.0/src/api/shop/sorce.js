import request from '@/utils/request'

export function getshopsorcelist(params) {
  return request({
    url: '/admin/shop/changesorce',
    method: 'post',
    data: params
  })
}
export function upshopsorce(params) {
  return request({
    url: '/admin/shop/upshopsorce',
    method: 'post',
    data: params
  })
}


// 积分结算
export function changesorce(params) {
  return request({
    url: '/admin/shop/changesorce',
    method: 'post',
    data: params
  })
}