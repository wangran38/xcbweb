import request from '@/utils/request'


// 添加资讯
export function complaintList(params) {
  return request({
    url: '/admin/complaint/list',
    method: 'post',
    data: params
  })
}