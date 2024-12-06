import request from '@/utils/request'

export function getlottery1list(params) {
  return request({
    url: '/admin/lottery1',
    method: 'post',
    data: params
  })
}
