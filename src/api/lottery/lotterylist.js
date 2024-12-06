import request from '@/utils/request'

export function getlotteryrecordlist(params) {
  return request({
    url: '/admin/lottery/getlist',
    method: 'post',
    data: params
  })
}
