import request from '@/utils/request'

export function getsignlist(params) {
  return request({
    url: '/admin/usersignlist',
    method: 'post',
    data: params
  })
}

export function getsignlistgroup(params) {
  return request({
    url: '/admin/signlist',
    method: 'post',
    data: params
  })
}


/**
 * 获取中奖记录数据
*/
export function getAwardList(params) {
  return request({
    url: '/admin/lottery/getlist',
    method: 'post',
    data: params
  })
}
