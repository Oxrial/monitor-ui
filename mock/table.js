const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [
    {
      id: '@id',
      title: '@sentence(10, 20)',
      'status|1': ['published', 'draft', 'deleted'],
      author: 'name',
      display_time: '@datetime',
      pageviews: '@integer(300, 5000)'
    }
  ],
  'itemContent|20': [
    {
      system_name: '@string(2,5)',
      system_code: '@upper(4,5)',
      host_name: '@string(2,5)数据库主机@integer(1,25)',
      host_code: '@string(upper,4,5)_@string(upper,2)_H@integer(1,25)',
      item_name: '文件',
      item: '@integer(1,25)',
      subitem: '@integer(1,25)',
      item_comment: '@integer(10,25)',
      'item_state|1': ['1', '2', '3'],
      item_method: 'mose.file',
      period: '@integer(1,5)',
      interval: '@integer(1,5)'
    }
  ],
  'serviceInfo|60': [
    {
      strSystemCode: '@string(2,5)',
      strHostCode: '@string(upper,4,5)_@string(upper,2)_H@integer(1,25)',
      strPort: '@integer(8000,9000)',
      strAgentCode: '@string(upper,4,5)_@string(upper,2)_H@integer(1,25)',
      strAgentPort: '@integer(8000,9000)',
      strServiceName: '@string(2,5)',
      strGroupName: '@string(upper,4,5)_@string(upper,1,3)',
      strClusterName: '@string(upper,4,5)',
      strNamespaceId: '@string(upper,4,5)',
      strServiceState: '1',
      strAgentSystem: '@upper(4,5)',
      strAgentSystemName: '@string(2,5)',
      strAgentCodeName: '@string(2,5)数据库主机@integer(1,25)',
      strAgentIp: null
    }
  ],
  'collectConsult|60': [
    {
      strSystemCode: '@string(2,5)',
      strHostCode: '@string(upper,4,5)_@string(upper,2)_H@integer(1,25)',
      strCollect: '@integer(1,25)',
      strSubCollect: '@integer(1,25)',
      strItem: '@integer(1,25)',
      strSubitem: '@integer(1,25)',
      strPeriodId: '@integer(1,25)',
      strInterval: '@integer(1,25)',
      strCollectMethod: 'com.mose',
      'strCollectSource|1': ['1', '2', '3', '4', '5'],
      'strState|1': ['0', '1', '2']
    }
  ],
  'paramsConsult|40': [
    {
      strParaName: '@string(2,5)',
      strParaValue: '@integer(1,25)',
      'strParaState|1': ['0', '1', '2']
    }
  ],
  'sysinfo|20': [
    {
      iSystemIndex: '@integer(1,25)',
      strSystemName: '@string(2,5)',
      strSystemCode: '@string(2,5)',
      'strLevel|1': ['0', '1', '2']
    }
  ],
  'hostinfo|20': [
    {
      strSystemName: '@string(2,5)',
      strSystemCode: '@string(2,5)',
      strHostName: '@string(2,5)数据库主机@integer(1,25)',
      strHostCode: '@string(upper,4,5)_@string(upper,2)_H@integer(1,25)',
      'strLevel|1': ['0', '1', '2']
    }
  ],
  'itemdetailInfo|30': [
    {
      strItem: '@integer(1,25)',
      strItemName: '@string(2,5',
      strSubitem: '@integer(1,25)',
      strItemComment: '@string(1,25)',
      strItemMethod: '@string(1,25)'
    }
  ]
})

const confUserconsult = {
  strState: '1',
  strMsg: '成功相关信息',
  strResult: JSON.stringify([
    {
      strBeginDate: '20210106',
      strEndDate: '20290131',
      strLoginState: '1',
      strRegistDate: '20210106',
      strUserCheckType: '1',
      strUserCode: 'admin',
      strUserComment: '超管',
      strUserDept: '测试一部',
      strUserEmail: 'sdfd@aaa.com',
      strUserLevel: '3',
      strUserMobile: '13560530084',
      strUserName: '超级管理员',
      strUserPSWD: '21232f297a57a5a743894a0e4a801fc3',
      strUserState: '1',
      strUserTel: '13212345678',
      strUserType: '00000001',
      strUserTypeName: '超级管理员'
    },
    {
      strBeginDate: '20210206',
      strEndDate: '20290231',
      strLoginState: '1',
      strRegistDate: '20210106',
      strUserCheckType: '1',
      strUserCode: 'admin2',
      strUserComment: '超管2',
      strUserDept: '测试一部2',
      strUserEmail: 'sdfd2@aaa.com',
      strUserLevel: '3',
      strUserMobile: '13560530084',
      strUserName: '超级管理员2',
      strUserPSWD: '21232f297a57a5a743894a0e4a801fc3',
      strUserState: '2',
      strUserTel: '010-1234567',
      strUserType: '00000002',
      strUserTypeName: '超级管理员2'
    },
    {
      strBeginDate: '20210106',
      strEndDate: '20290131',
      strLoginState: '1',
      strRegistDate: '20210106',
      strUserCheckType: '1',
      strUserCode: 'admin',
      strUserComment: '超管3',
      strUserDept: '测试一部3',
      strUserEmail: 'sdfd@aaa.com',
      strUserLevel: '3',
      strUserMobile: '13560530084',
      strUserName: '超级管理员3',
      strUserPSWD: '21232f297a57a5a743894a0e4a801fc3',
      strUserState: '2',
      strUserTel: '13212345678',
      strUserType: '00000003',
      strUserTypeName: '超级管理员3'
    },
    {
      strBeginDate: '20210206',
      strEndDate: '20290231',
      strLoginState: '1',
      strRegistDate: '20210106',
      strUserCheckType: '1',
      strUserCode: 'admin4',
      strUserComment: '超管4',
      strUserDept: '测试一部4',
      strUserEmail: 'sdfd2@aaa.com',
      strUserLevel: '3',
      strUserMobile: '13560530084',
      strUserName: '超级管理员4',
      strUserPSWD: '21232f297a57a5a743894a0e4a801fc3',
      strUserState: '1',
      strUserTel: '010-1234567',
      strUserType: '00000004',
      strUserTypeName: '超级管理员4'
    }
  ])
}

const monitorItemconsult = {
  strState: '1',
  strMsg: '成功相关信息',
  strResult: JSON.stringify([
    {
      system_name: '核心',
      system_code: 'CORE',
      host_name: '核心主机1',
      host_code: 'CORE_APP_H03',
      item_name: '文件1',
      item: '1',
      subitem: '2',
      item_comment: '文件子监控',
      item_state: '1',
      item_method: 'mose.file',
      period: '1',
      interval: '3'
    },
    {
      system_name: '信贷',
      system_code: 'ED',
      host_name: '信贷主机1',
      host_code: 'ED_APP_H03',
      item_name: '文件2',
      item: '2',
      subitem: '2',
      item_comment: '文件子监控2',
      item_state: '0',
      item_method: 'mose.file',
      period: '2',
      interval: '2'
    },
    {
      system_name: '信贷',
      system_code: 'ED',
      host_name: '信贷主机1',
      host_code: 'ED_APP_H03',
      item_name: '文件3',
      item: '3',
      subitem: '2',
      item_comment: '文件子监控2',
      item_state: '0',
      item_method: 'mose.file',
      period: '2',
      interval: '2'
    },
    {
      system_name: '信贷',
      system_code: 'ED',
      host_name: '信贷主机1',
      host_code: 'ED_APP_H03',
      item_name: '文件7',
      item: '7',
      subitem: '2',
      item_comment: '文件子监控2',
      item_state: '0',
      item_method: 'mose.file',
      period: '2',
      interval: '2'
    },
    {
      system_name: '信贷',
      system_code: 'ED',
      host_name: '信贷主机1',
      host_code: 'ED_APP_H03',
      item_name: '文件8',
      item: '8',
      subitem: '2',
      item_comment: '文件子监控2',
      item_state: '0',
      item_method: 'mose.file',
      period: '2',
      interval: '2'
    },
    {
      system_name: '信贷',
      system_code: 'ED',
      host_name: '信贷主机1',
      host_code: 'ED_APP_H03',
      item_name: '文件9',
      item: '9',
      subitem: '2',
      item_comment: '文件子监控2',
      item_state: '0',
      item_method: 'mose.file',
      period: '2',
      interval: '2'
    },
    {
      system_name: '信贷',
      system_code: 'ED',
      host_name: '信贷主机1',
      host_code: 'ED_APP_H03',
      item_name: '文件11',
      item: '11',
      subitem: '2',
      item_comment: '文件子监控2',
      item_state: '0',
      item_method: 'mose.file',
      period: '2',
      interval: '2'
    },
    ...data.itemContent
  ])
}
const monitorGetDistinctItemInfo = {
  strState: '1',
  strMsg: '成功相关信息',
  strResult: [
    {
      strItem: '1',
      strItemName: '交易监控',
      strItemComment: '1',
      strItemState: '对应用系统交易流水情况进行监控'
    },
    {
      strItem: '2',
      strItemName: '文件监控',
      strItemComment: '对指定文件系统进行监控',
      strItemState: '1'
    }
  ]
}
const monitorGetsubitem = {
  strState: '1',
  strMsg: '成功相关信息',
  strResult: [
    {
      strItem: '1',
      strSubitem: '1',
      strItemName: '交易监控',
      strItemComment: '分析交易成功率是否再阈值范围',
      strItemMethod: 'com.mose.item.trans.TransSuccessRateMonitor',
      strPeriod: '1',
      strInterval: '3'
    },
    {
      strItem: '1',
      strSubitem: '2',
      strItemName: '交易监控',
      strItemComment: '分析交易时长是否再阈值范围',
      strItemMethod: 'com.mose.item.trans.TransConsumeMonitor',
      strPeriod: '1',
      strInterval: '3'
    }
  ]
}
const monitorThreadconsult = {
  strState: '1',
  strMsg: '成功相关信息',
  strResult: [
    {
      strSystemCode: 'CORE',
      strHostCode: 'CORE_APP_H03',
      strItem: '1',
      strSubitem: '1',
      fAlertMinValue: '50',
      fAlertMaxValue: '100',
      strLevel: '1',
      strState: '1'
    },
    {
      strSystemCode: 'CORE',
      strHostCode: 'CORE_APP_H03',
      strItem: '1',
      strSubitem: '1',
      fAlertMinValue: '30',
      fAlertMaxValue: '50',
      strLevel: '2',
      strState: '0'
    },
    {
      strSystemCode: 'CORE',
      strHostCode: 'CORE_APP_H03',
      strItem: '1',
      strSubitem: '1',
      fAlertMinValue: '0',
      fAlertMaxValue: '30',
      strLevel: '3',
      strState: '1'
    }
  ]
}
const monitorServiceInfoConfConsult = {
  strState: '1',
  strMsg: '成功相关信息',
  strResult: [
    {
      strSystemCode: 'CORE',
      strHostCode: 'CORE_APP_H03',
      strPort: '8000',
      strAgentCode: 'CORE_APP_H03',
      strAgentPort: '8848',
      strServiceName: 'test',
      strGroupName: 'DEFAULT_GROUP',
      strClusterName: 'DEFAULT',
      strNamespaceId: '命名空间1',
      strServiceState: '1',
      strAgentSystem: 'EDB',
      strAgentSystemName: '消息分发',
      strAgentCodeName: 'EDB应用主机1',
      strAgentIp: null
    },
    ...data.serviceInfo
  ]
}
const monitorDetailThreadConsult = {
  strState: '1',
  strMsg: '',
  strResult: []
}
const monitorCollectRelaConsult = {
  strState: '1',
  strMsg: '',
  strResult: [
    {
      strSystemCode: 'AFD',
      strHostCode: 'AFD_APP_H02',
      strCollect: '1',
      strSubCollect: '1',
      strItem: '1',
      strSubitem: '1',
      strPeriodId: '1',
      strInterval: '11',
      strCollectMethod: 'com.mose',
      strCollectSource: '4',
      strState: '0'
    },
    {
      strSystemCode: 'AFD',
      strHostCode: 'AFD_APP_H03',
      strCollect: '2',
      strSubCollect: '3',
      strItem: '2',
      strSubitem: '2',
      strPeriodId: '1',
      strInterval: '11',
      strCollectMethod: 'com.mose',
      strCollectSource: '4',
      strState: '0'
    },
    ...data.collectConsult
  ]
}
const monitorSystemParameterConsult = {
  strState: '1',
  strMsg: '',
  strResult: data.paramsConsult
}
const monitorRedissysinfoconsult = {
  strState: '1',
  strMsg: '',
  strResult: JSON.stringify(data.sysinfo)
}
const monitorRedishostinfoconsult = {
  strState: '1',
  strMsg: '',
  strResult: JSON.stringify(data.hostinfo)
}
const confGetLinkmanConfTree = {
  strState: '1',
  strMsg: '',
  strResult: {
    id: null,
    label: null,
    code: null,
    children: [
      {
        id: '1',
        label: '交易监控',
        code: '1',
        children: [
          {
            label: '分析。。。',
            code: '1',
            id: '11',
            checked: null,
            children: [
              {
                id: '11CORE',
                label: '核心',
                code: 'CORE',
                checked: null,
                children: [
                  {
                    id: '11CORECORE_DB_H01',
                    label: '核心db01',
                    checked: null,
                    children: [
                      {
                        id: '1-1-CORE-CORE_DB_H01-1',
                        label: '正常',
                        code: '1',
                        children: null,
                        checked: null
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        checked: null
      },
      {
        id: '2',
        label: '2',
        code: '2',
        checked: null
      }
    ],
    checked: ['1-1-CORE-CORE_DB_H01-1']
  }
}
const confMsgConsult0 = {
  strState: '1',
  strMsg: '',
  strResult: [
    { strItem: '1', strItemName: '交易监控', strSubItem: '1', strItemComment: '交易成功率低于{max}%', strLevel: '1', strData: '[恢复]。。。', strType: '0' },
    { strItem: '1', strItemName: '交易监控', strSubItem: '1', strItemComment: '交易成功率低于{max}%', strLevel: '2', strData: '[风险]。。。', strType: '1' }
  ]
}
const confMsgConsult1 = {
  strState: '1',
  strMsg: '',
  strResult: [
    { strItem: '1', strItemName: '交易监控', strSubItem: '1', strItemComment: '交易成功率低于{max}%', strLevel: '1', strData: '[恢复]。。。', strType: '0' },
    { strItem: '1', strItemName: '交易监控', strSubItem: '1', strItemComment: '交易成功率低于{max}%', strLevel: '2', strData: '[风险]。。。', strType: '1' }
  ]
}
const confGetSystemHostTree = {
  strState: '1',
  strMsg: '',
  strResult: [
    {
      id: 'CAL',
      label: '信贷',
      children: [
        {
          id: '20.200.96.44',
          label: '信贷db3'
        }
      ]
    },
    {
      id: 'COMM',
      label: '公共应用',
      children: [
        {
          id: '20.201.35.217',
          label: '公共mq01'
        },
        {
          id: '20.201.35.211',
          label: '公共nacos01'
        }
      ]
    }
  ]
}
const itemdetailInfo = {
  strState: '1',
  strMsg: '',
  strResult: data.itemdetailInfo
}
module.exports = [
  {
    url: '/conf/getItemDetailInfo',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...itemdetailInfo
      }
    }
  },
  {
    url: '/conf/getSystemHostTree',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...confGetSystemHostTree
      }
    }
  },
  {
    url: '/conf/msgConsult0',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...confMsgConsult0
      }
    }
  },
  {
    url: '/conf/msgConsult1',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...confMsgConsult1
      }
    }
  },
  {
    url: '/conf/getLinkmanConfTree',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...confGetLinkmanConfTree
      }
    }
  },
  {
    url: '/monitor/redissysinfoconsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorRedissysinfoconsult
      }
    }
  },
  {
    url: '/monitor/redishostinfoconsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorRedishostinfoconsult
      }
    }
  },
  {
    url: '/monitor/systemParameterConsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorSystemParameterConsult
      }
    }
  },
  {
    url: '/monitor/collectRelaConsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorCollectRelaConsult
      }
    }
  },
  {
    url: '/monitor/detailThreadConsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorDetailThreadConsult
      }
    }
  },

  {
    url: '/monitor/serviceInfoConfConsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorServiceInfoConfConsult
      }
    }
  },
  {
    url: '/monitor/threadconsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorThreadconsult
      }
    }
  },
  {
    url: '/monitor/getsubitem',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorGetsubitem
      }
    }
  },
  {
    url: '/monitor/getDistinctItemInfo',
    type: 'get',
    response: (config) => {
      return {
        code: 20000,
        ...monitorGetDistinctItemInfo
      }
    }
  },
  {
    url: '/conf/itemconsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...monitorItemconsult
      }
    }
  },
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: (config) => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/conf/userconsult',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        ...confUserconsult
      }
    }
  }
]
