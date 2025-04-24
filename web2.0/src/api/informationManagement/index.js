import request from '@/utils/request'


// 添加资讯
export function addnews(params) {
  return request({
    url: '/admin/addnews',
    method: 'post',
    data: params
  })
}