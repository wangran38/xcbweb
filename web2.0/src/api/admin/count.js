import request from '@/utils/request'

export function getcount(params) {
  return request({
    url: '/admin/count',
    method: 'post',
    data: params
  })
}
