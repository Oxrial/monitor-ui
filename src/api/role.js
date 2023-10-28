import { post } from '@/utils/request'

// 获取角色列表
export function monitorRoleconsult(data) {
  return post('/monitor/roleconsult', data)
}

// 获取当前角色下的用户列表
export function confQueryUsersByRoleId(data) {
  return post('/conf/queryUsersByRoleId', data)
}

// 获取非当前角色下的用户列表
export function confQueryUsersNoEqualToUserType(data) {
  return post('conf/queryUsersNoEqualToUserType', data)
}

// 添加用户
export function confUpdateUserTypeToRoleId(data) {
  return post('/conf/updateUserTypeToRoleId', data)
}
