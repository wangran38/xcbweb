import request from '@/utils/request'

export function getmoneyconfiglist(params) {
  return request({
    url: '/admin/config/getmoneyconfig',
    method: 'post',
    data: params
  })
}

export function editmoneyconfig(params) {
  return request({
    url: '/admin/config/editmoneyconfig',
    method: 'post',
    data: params
  })
}
export function addmoneyconfig(params) {
  return request({
    url: '/admin/config/addmoneyconfig',
    method: 'post',
    data: params
  })
}


// export function delmoneyconfig(params) {
//   return request({
//     url: '/admin/delcoupon',
//     method: 'post',
//     data: params
//   })
// }