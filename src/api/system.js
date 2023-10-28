import { post } from '@/utils/request'

// 获取应用系统列表
export function monitorSysinfoconsult(data) {
  return post('/monitor/sysinfoconsult', data)
}

// 获取系统主机列表
export function monitorGetAllHost(data) {
  return post('/monitor/getAllHost', data)
}

// 新增/编辑/删除系统
export function confSysinfomanage(data) {
  return post('/conf/sysinfomanage', data)
}

// 新增/编辑/删除主机
export function confHostinfomanage(data) {
  return post('/conf/hostinfomanage', data)
}
