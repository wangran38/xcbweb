import request from '@/utils/request'

export function getshoplist(params) {
  return request({
    url: '/admin/shoplist',
    method: 'post',
    data: params
  })
}

// export function edit(params) {
//   return request({
//     url: '/admin/edituserpay',
//     method: 'post',
//     data: params
//   })
// }

// export function getinfo(params) {
//   return request({
//     url: '/admin/usercontantinfo',
//     method: 'post',
//     data: params
//   })
// }

// export function del(params) {
//   return request({
//     url: '/admin/deluserpay',
//     method: 'post',
//     data: params
//   })
// }