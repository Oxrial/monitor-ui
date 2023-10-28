const Mock = require('mockjs');
// const sysinfoconsult = [
//   { iSystemIndex: '1', strSystemCode: 'xxx' }, 
//   { iSystemIndex: '2',strSystemCode: 'xxx'}
// ]

const sysinfoconsult = Mock.mock({
  "rows|33": [{
      'iSystemIndex':'@integer(1, 100)',  
      'strSystemCode': 'XXX'+'@integer(1, 100)',  
      'strSystemName': '系统' + '@integer(1, 100)',
      'strSystemComment':'@cword(6,10)',
      'strHostState':['0','1']
  }],
});

const getAllHost = Mock.mock({
  "rows|33": [{
    'systemName': '系统'+'@integer(1, 100)',  
    'strHostName': '主机' + '@integer(1, 100)',
    'strSystemCode': 'XXX'+'@integer(1, 100)', 
    'strHostCode': 'XXX'+'@integer(1, 100)', 
    'strHostComment':'@cword(6,10)',
    'strHostIP':'@ip', 
    'strHostArea':'@cword(2,5)',
  }],
});

module.exports = [
  {
    url: '/monitor/sysinfoconsult',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(sysinfoconsult.rows)
      }
    }
  },
  {
    url: '/monitor/getAllHost',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(getAllHost.rows)
      }
    }
  }
]
