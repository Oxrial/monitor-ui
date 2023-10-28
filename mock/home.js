const Mock = require('mockjs');

const getAllmonitor = Mock.mock({
  "rows|33": [{
    'strItem': 'XXX'+'@integer(1, 100)',  
    'strItemName': '监控项' + '@integer(1, 100)',  
    'sysList|15':['@cword(2,5)'],
  }],
});


const monitorDetailList = Mock.mock({
  "rows|33": [{
    'strItem': 'XXX'+'@integer(1, 100)',  
    'strItemName': '监控项' + '@integer(1, 100)',  
    'strItemComment':'@cword(2,5)',
  }],
});


const usermonitoringlist = Mock.mock({
  "rows|33": [{
    'userCode': 'XXX'+'@integer(1, 100)',  
    'userName': '用户' + '@integer(1, 100)',  
    'strSystemComment':"@pick(['0','1'])"
  }],
});

const systemthreshold = Mock.mock({
  "rows|33": [{
    'strItem': 'XXX'+'@integer(1, 100)',  
    'strItemName': '监控项' + '@integer(1, 100)',  
    'strItemComment':'@cword(2,5)',
  }],
});


const schedulingScheme = Mock.mock({
  "rows|33": [{
    'strItem': 'XXX'+'@integer(1, 100)',  
    'strItemName': '方案名' + '@integer(1, 100)',  
    'strItemComment':['0','1']
  }],
});


const collection = Mock.mock({
  "rows|33": [{
    'strItemName': '采集项'+'@integer(1, 100)',  
    'strItem': 'xxx' + '@integer(1, 100)',  
    'strItemComment':['0','1']
  }],
});

const SysMonitor = Mock.mock({
  "rows|7": [{
    'systemCode': 'xxx' + '@integer(1, 100)',  
    'systemName': '系统'+'@integer(1, 100)',  
  }],
});

const itemMonitor = Mock.mock({
  "rows|7": [{
    'strItem': 'xxx' + '@integer(1, 100)',  
    'strItemName': '监控项'+'@integer(1, 100)',  
  }],
});

const hostByItem = Mock.mock({
  "size":33,
  "data|33": [{
    'systemCode': 'xxx' + '@integer(1, 100)',    //系统标识
    'strHostCode': 'xxx'+'@integer(1, 100)',  
    'strHostName': '主机' + '@integer(1, 100)',    
    'strHostComment': '@cword(10,15)', 
    'strHostIP':'@ip',
    'strHostArea':'@cword(2,5)',
    'ctrl|1':'@boolean'
  }],
});



 const dept = Mock.mock({
   "data|33": [{
     'strSystemCode': '部门' + '@integer(1, 100)',  
    'strSystemComment':'@cword(2,5)',
   }],
});


module.exports = [
  {
    url: '/monitor/getAllMonitor',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(getAllmonitor.rows)
      }
    }
  },
  {
    url: '/monitor/getMoniterDetailList',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(monitorDetailList.rows)
      }
    }
  },
  {
    url: '/monitor/getUsermonitorList',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(usermonitoringlist.rows)
      }
    }
  },
  {
    url: '/monitor/getSystemthresholdList',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(systemthreshold.rows)
      }
    }
  },
  {
    url: '/monitor/getDetpList',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(dept.rows)
      }
    }
  },
  {
    url: '/monitor/getSchedulingschemeList',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(schedulingScheme.rows)
      }
    }
  },
  {
    url: '/monitor/getCollectionList',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: JSON.stringify(collection.rows)
      }
    }
  },
  {
    url: '/monitor/getSysmonitorItemTree',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: SysMonitor.rows
      }
    }
  },
  {
    url: '/monitor/getMonitorItemTree',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: itemMonitor.rows
      }
    }
  },

  {
    url: '/monitor/getHostByMoniterItem',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        strResult: hostByItem
      }
    }
  },
]
