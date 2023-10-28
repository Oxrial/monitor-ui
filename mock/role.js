const monitorRoleconsult = [
  { strRoleId: '00000001', strRoleName: '超级管理员' },
  { strRoleId: '00000002', strRoleName: '访客' },
  { strRoleId: '00000003', strRoleName: '测试' }
]

const queryUsersByRoleId = [
  { strUserCode: 'mose', strUserName: 'mose', strUserType: '00000001', strUserMobile: '123456', strUserDept: '监控', strUserLevel: '3' }
]

const queryUsersNoEqualToUserType = [
  { strUserCode: 'mose', strUserName: 'mose', strUserType: '00000001', strUserMobile: '123456', strUserDept: '监控', strUserLevel: '3' }
]

module.exports = [
  {
    url: '/conf/queryUsersNoEqualToUserType',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: queryUsersNoEqualToUserType
      }
    }
  },
  {
    url: '/conf/queryUsersByRoleId',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: queryUsersByRoleId
      }
    }
  },
  {
    url: '/monitor/roleconsult',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: monitorRoleconsult
      }
    }
  }
]
