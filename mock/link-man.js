const Mock = require('mockjs');

const linkmanmanage = Mock.mock({
  "size":33,
  "data|33": [{
    'strUserCode': 'xxx' + '@integer(1, 100)',    //标识
    'strUserMobile': 'xxx'+'@integer(1, 100)',  
    'strUserDept': '主机' + '@integer(1, 100)',    
    'strUserLevel': '@cword(10,15)', 
    'strState|1':['0','1'],
    'strLevel|1':['1','2','3'],
    'ctrl|1':'@boolean'
  }],
});

const itemTree = [
  {
    label: '交易监控',
    code: '1',
    id: null,
    checked: null,
    children: [
      {
        label: '分析交易成功率是否在阈值范围',
        code: '1',
        children: [],
        id: null,
        checked: null
      }
    ]
  },
  {
    label: '文件监控',
    code: '1',
    id: null,
    checked: null,
    children: [
      {
        label: '分析文件是否存在',
        code: '1',
        children: [],
        id: null,
        checked: null
      }
    ]
  },
  {
    label: '消息监控',
    code: '1',
    id: null,
    checked: null,
    children: [
      {
        label: '分析消息',
        code: '1',
        children: [],
        id: null,
        checked: null
      }
    ]
  }
]

const itemHostTree = [
  {
    label: '反欺诈',
    code: 'AFD',
    id: null,
    checked: null,
    children: [
      {
        label: '反欺诈应用1',
        code: 'AFD_APP_H02',
        children: [],
        id: null,
        checked: null
      }
    ]
  }
]

const getUserByUserCode = {
  strUserMobile: '123',
  strUserDept: '12',
  strUserLevel: '1'
}

const confLinkmanmanage = {
  strMsg: '删除联系人成功'
}

const enableLinkman = [{ user_code: 'mose', user_mobile: '123' }]

module.exports = [
  {
    url: '/conf/enableLinkman',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: enableLinkman
      }
    }
  },
  {
    url: '/conf/linkmanmanage',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: confLinkmanmanage
      }
    }
  },
  {
    url: '/monitor/getUserByUserCode',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: getUserByUserCode
      }
    }
  },
  {
    url: '/monitor/itemHostTree',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: itemHostTree
      }
    }
  },
  {
    url: '/monitor/itemTree',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: itemTree
      }
    }
  },
  {
    url: '/monitor/linkmanmanage',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: linkmanmanage
      }
    }
  }
]
