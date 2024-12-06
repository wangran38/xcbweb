import request from '@/utils/request'

export function getlottery2list(params) {
  return request({
    url: '/admin/lottery2',
    method: 'post',
    data: params
  })
}
