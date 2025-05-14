import request from '@/utils/request'


// 获取省级
export function citylist(params) {
  return request({
    url: '/api/citylist',
    method: 'post',
    data: params
  })
}

export function citytree(params) {
    return request({
      url: '/api/citytree',
      method: 'post',
      data: params
    })
  }