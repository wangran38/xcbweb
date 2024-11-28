import request from '@/utils/request'

export function scoreList(params) {
  return request({
    url: '/admin/user/scorelist',
    method: 'post',
    data: params
  })
}