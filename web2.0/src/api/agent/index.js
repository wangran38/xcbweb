import request from '@/utils/request'

/**
 * @description 代理商列表
*/
export function agentDataList(params) {
  return request({
    url: '/admin/agentuser/list',
    method: 'post',
    data: params
  })
}


/**
 * @description 收益明细列表
*/
export function revenueDetailList(params) {
  return request({
    url: '/admin/moneyall/list',
    method: 'post',
    data: params
  })
}

/**
 * @description 提交申请
*/
export function approved(params) {
  return request({
    url: '/admin/agentuser/edit',
    method: 'post',
    data: params
  })
}

/**
 * @description 删除申请
*/
export function rmroved(params) {
  return request({
    url: '/admin/agentuser/del',
    method: 'post',
    data: params
  })
}
