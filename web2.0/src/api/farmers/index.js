import request from '@/utils/request'

export function farmerslist(params) {
  return request({
    url: '/admin/farmerslist',
    method: 'post',
    data: params
  })
}


