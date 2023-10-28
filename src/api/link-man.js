import request, { post } from '@/utils/request'

// 获取监控关系树形数据
export function monitorItemTree(data) {
  return post('monitor/itemTree', data)
}

// 获取系统关系树形数据
export function monitorItemHostTree(data) {
  return request({
    method: 'post',
    url: 'monitor/itemHostTree',
    data
  })
}

// 获取联系人标识列表
export function confUserconsult(data) {
  return post('conf/userconsult', data)
}

// 获取联系人列表
export function monitorLinkmanmanage(data) {
  return post('monitor/linkmanmanage', data)
}

// 根据联系人标识获取相关信息
export function monitorGetUserByUserCode(data) {
  return post('monitor/getUserByUserCode', data)
}

// 新增/编辑/删除联系人(event 1/2/3)
export function confLinkmanmanage(data) {
  return post('conf/linkmanmanage', data)
}

// 批量删除联系人
export function confBatdellinkman(data) {
  return request({
    method: 'post',
    url: 'conf/batdellinkman',
    data
  })
}

// 查询未配置联系人
export function confEnableLinkman(data) {
  return request({
    method: 'post',
    url: 'conf/enableLinkman',
    data
  })
}
