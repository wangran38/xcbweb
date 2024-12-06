import request from '@/utils/request'

export function getlottery3list(params) {
  return request({
    url: '/admin/lottery3',
    method: 'post',
    data: params
  })
}
