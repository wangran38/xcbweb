import request from '@/utils/request'


// 代理商列表
export function agentDataList(params) {
  return request({
    url: '/admin/agentuser/list',
    method: 'post',
    data: params
  })
}