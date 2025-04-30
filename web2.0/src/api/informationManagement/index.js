import request from '@/utils/request'


// 添加资讯
export function addNews(params) {
  return request({
    url: '/admin/addnews',
    method: 'post',
    data: params
  })
}

// 修改资讯
export function editNews(params) {
  return request({
    url: '/admin/editnews',
    method: 'post',
    data: params
  })
}

// 资讯列表
export function newsList(params) {
  return request({
    url: '/admin/newslist',
    method: 'post',
    data: params
  })
}

// 删除资讯
export function delNews(params) {
  return request({
    url: '/admin/delnews',
    method: 'post',
    data: params
  })
}