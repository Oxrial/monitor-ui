import { capitalize } from 'lodash-es'

export function setName(itemName, name, subName = '') {
  return capitalize(itemName.substring(1)) + capitalize(name) + capitalize(subName)
}
export function createTrans(icon) {
  return [
    {
      path: 'success',
      meta: { title: '交易成功率', icon: icon, monitorItem: { item: '1', subitem: '1' } }
    },
    {
      path: 'timer',
      meta: { title: '交易时长', icon: icon, monitorItem: { item: '1', subitem: '2' } }
    },
    {
      path: 'volring',
      meta: { title: '交易量环比聚变', icon: icon, monitorItem: { item: '1', subitem: '3' } }
    },
    {
      path: 'notrans',
      meta: { title: '长时间无交易', icon: icon, monitorItem: { item: '1', subitem: '4' } }
    }
  ]
}
export function createFile(icon) {
  return [
    {
      path: 'noexist',
      meta: { title: '文件不存在告警', icon: icon, monitorItem: { item: '2', subitem: '1' } }
    },
    {
      path: 'exist',
      meta: { title: '文件存在告警', icon: icon, monitorItem: { item: '2', subitem: '2' } }
    }
  ]
}
export function createMessage(icon) {
  return [
    {
      path: 'sending',
      meta: { title: '消息发送', icon: icon, monitorItem: { item: '3', subitem: '1' } }
    },
    {
      path: 'receiving',
      meta: { title: '消息接收', icon: icon, monitorItem: { item: '3', subitem: '2' } }
    }
  ]
}
export function createDayend(icon) {
  return [
    {
      path: 'batch',
      meta: { title: '日终批量任务执行', icon: icon, monitorItem: { item: '4', subitem: '1' } }
    },
    {
      path: 'changeerr',
      meta: { title: '换日任务非正常执行', icon: icon, monitorItem: { item: '4', subitem: '2' } }
    },
    {
      path: 'batcherr',
      meta: { title: '日终批量任务非正常执行', icon: icon, monitorItem: { item: '4', subitem: '3' } }
    }
  ]
}
export function createReconciliation(icon) {
  return [
    {
      path: 'deal',
      meta: { title: '对账处理', icon: icon, monitorItem: { item: '5', subitem: '1' } }
    },
    {
      path: 'dispatch',
      meta: { title: '对账调度', icon: icon, monitorItem: { item: '5', subitem: '2' } }
    }
  ]
}
export function createNacos(icon) {
  return [
    {
      path: 'queue',
      meta: { title: '服务队列', icon: icon, monitorItem: { item: '9', subitem: '1' } }
    },
    {
      path: 'httpreq',
      meta: { title: 'http请求次数', icon: icon, monitorItem: { item: '9', subitem: '2' } }
    },
    {
      path: 'httpreqtimes',
      meta: { title: 'http请求总耗时', icon: icon, monitorItem: { item: '9', subitem: '3' } }
    },
    {
      path: 'droptaskstack',
      meta: { title: '配置落盘任务堆积数', icon: icon, monitorItem: { item: '9', subitem: '4' } }
    },
    {
      path: 'horiztaskstack',
      meta: { title: '配置水平通知任务堆积数', icon: icon, monitorItem: { item: '9', subitem: '5' } }
    },
    {
      path: 'namingfailures',
      meta: { title: 'naming推送失败数', icon: icon, monitorItem: { item: '9', subitem: '6' } }
    },
    {
      path: 'namingleadererr',
      meta: { title: 'naming leader发送心跳异常', icon: icon, monitorItem: { item: '9', subitem: '7' } }
    },
    {
      path: 'internalerr',
      meta: { title: '请求响应内部错误异常', icon: icon, monitorItem: { item: '9', subitem: '8' } }
    },
    {
      path: 'jvmramusage',
      meta: { title: 'Jvm内存使用字节', icon: icon, monitorItem: { item: '9', subitem: '9' } }
    },
    {
      path: 'jvmrammax',
      meta: { title: 'Jvm内存最大字节', icon: icon, monitorItem: { item: '9', subitem: '10' } }
    },
    {
      path: 'jvmgccount',
      meta: { title: 'Jvm gc次数', icon: icon, monitorItem: { item: '9', subitem: '11' } }
    },
    {
      path: 'jvmgctimes',
      meta: { title: 'Jvm gc耗时', icon: icon, monitorItem: { item: '9', subitem: '12' } }
    },
    {
      path: 'jvmthreads',
      meta: { title: 'Jvm守护线程数', icon: icon, monitorItem: { item: '9', subitem: '13' } }
    },
    {
      path: 'jvmipcount',
      meta: { title: 'Ip计数', icon: icon, monitorItem: { item: '9', subitem: '14' } }
    },
    {
      path: 'namingrolestatus',
      meta: { title: 'naming角色状态', icon: icon, monitorItem: { item: '9', subitem: '15' } }
    }
  ]
}
export function createRedis(icon) {
  return [
    {
      path: 'colony',
      meta: { title: '集群数', icon: icon, monitorItem: { item: '10', subitem: '1' } }
    },
    {
      path: 'colonynode',
      meta: { title: '集群节点数', icon: icon, monitorItem: { item: '10', subitem: '2' } }
    },
    {
      path: 'colonymainnode',
      meta: { title: '集群主节点数', icon: icon, monitorItem: { item: '10', subitem: '3' } }
    },
    {
      path: 'cpu',
      meta: { title: 'CPU', icon: icon, monitorItem: { item: '10', subitem: '4' } }
    },
    {
      path: 'ramusage',
      meta: { title: '内存使用率', icon: icon, monitorItem: { item: '10', subitem: '5' } }
    },
    {
      path: 'ramused',
      meta: { title: '已使用内存', icon: icon, monitorItem: { item: '10', subitem: '6' } }
    },
    {
      path: 'ops',
      meta: { title: 'OPS', icon: icon, monitorItem: { item: '10', subitem: '7' } }
    }
  ]
}
export function createDBItem(icon, item) {
  return [
    {
      path: 'session',
      meta: { title: '当前会话', icon: icon, monitorItem: { item: item, subitem: '1' } }
    },
    {
      path: 'deadlock',
      meta: { title: '死锁', icon: icon, monitorItem: { item: item, subitem: '2' } }
    },
    {
      path: 'tablelock',
      meta: { title: '表锁', icon: icon, monitorItem: { item: item, subitem: '3' } }
    },
    {
      path: 'dbsize',
      meta: { title: '数据库大小', icon: icon, monitorItem: { item: item, subitem: '4' } }
    },
    {
      path: 'connusage',
      meta: { title: '连接使用', icon: icon, monitorItem: { item: item, subitem: '5' } }
    },
    {
      path: 'tablesize',
      meta: { title: '表大小', icon: icon, monitorItem: { item: item, subitem: '6' } }
    },
    {
      path: 'longtransactions',
      meta: { title: '长事务数', icon: icon, monitorItem: { item: item, subitem: '7' } }
    }
  ]
}
export function createSysresource(icon) {
  return [
    {
      path: 'cpuusage',
      meta: { title: '占用CPU资源', icon: icon, monitorItem: { item: '12', subitem: '1' } }
    },
    {
      path: 'ramusage',
      meta: { title: '占用内存资源', icon: icon, monitorItem: { item: '12', subitem: '2' } }
    },
    {
      path: 'storageusage',
      meta: { title: '占用存储资源', icon: icon, monitorItem: { item: '12', subitem: '3' } }
    },
    {
      path: 'readoprat',
      meta: { title: '读文件操作句柄', icon: icon, monitorItem: { item: '12', subitem: '4' } }
    },
    {
      path: 'exchangeusage',
      meta: { title: '交换区使用', icon: icon, monitorItem: { item: '12', subitem: '5' } }
    },
    {
      path: 'writeoprat',
      meta: { title: '写文件操作句柄', icon: icon, monitorItem: { item: '12', subitem: '6' } }
    },
    {
      path: 'iocpuused',
      meta: { title: 'IO的CPU使用率', icon: icon, monitorItem: { item: '12', subitem: '7' } }
    },
    {
      path: 'syscpuused',
      meta: { title: '系统CPU使用率', icon: icon, monitorItem: { item: '12', subitem: '8' } }
    },
    {
      path: 'usercpuused',
      meta: { title: '用户CPU使用率', icon: icon, monitorItem: { item: '12', subitem: '9' } }
    },
    {
      path: 'ramused',
      meta: { title: '已使用内存', icon: icon, monitorItem: { item: '12', subitem: '10' } }
    },
    {
      path: 'exchangeused',
      meta: { title: '交换区已使用', icon: icon, monitorItem: { item: '12', subitem: '11' } }
    },
    {
      path: 'sexchangeram',
      meta: { title: '秒交换空间写内存', icon: icon, monitorItem: { item: '12', subitem: '12' } }
    },
    {
      path: 'sramexchange',
      meta: { title: '秒内存写交换空间', icon: icon, monitorItem: { item: '12', subitem: '13' } }
    }
  ]
}
export function createSelf(icon) {
  return [
    {
      path: 'service',
      meta: { title: '自身服务', icon: icon, monitorItem: { item: '14', subitem: '1' } }
    },
    {
      path: 'alarm',
      meta: { title: '自身警告', icon: icon, monitorItem: { item: '14', subitem: '2' } }
    }
  ]
}
export function createHost(icon) {
  return [
    {
      path: 'load',
      meta: { title: 'Load状态', icon: icon, monitorItem: { item: '18', subitem: '1' } }
    },
    {
      path: 'uptime',
      meta: { title: 'Uptime状态', icon: icon, monitorItem: { item: '18', subitem: '2' } }
    }
  ]
}
export function createTomcat(icon) {
  return [
    {
      path: 'service',
      meta: { title: 'Tomcat服务信息', icon: icon, monitorItem: { item: '19', subitem: '1' } }
    },
    {
      path: 'jvmramused',
      meta: { title: 'Jvm内存使用率', icon: icon, monitorItem: { item: '19', subitem: '2' } }
    },
    {
      path: 'reqvol',
      meta: { title: '请求量', icon: icon, monitorItem: { item: '19', subitem: '3' } }
    },
    {
      path: 'newsession',
      meta: { title: '新增会话数', icon: icon, monitorItem: { item: '19', subitem: '4' } }
    },
    {
      path: 'err',
      meta: { title: '错误数', icon: icon, monitorItem: { item: '19', subitem: '5' } }
    },
    {
      path: 'session',
      meta: { title: '当前线程数', icon: icon, monitorItem: { item: '19', subitem: '6' } }
    },
    {
      path: 'threads',
      meta: { title: '线程池使用率', icon: icon, monitorItem: { item: '19', subitem: '7' } }
    },
    {
      path: 'tcpconn',
      meta: { title: 'TCP连接数', icon: icon, monitorItem: { item: '19', subitem: '8' } }
    }
  ]
}
export function createNginx(icon) {
  return [
    {
      path: 'service',
      meta: { title: 'Nginx运行状态', icon: icon, monitorItem: { item: '20', subitem: '1' } }
    },
    {
      path: 'jvmramused',
      meta: { title: '当前连接数', icon: icon, monitorItem: { item: '20', subitem: '2' } }
    },
    {
      path: 'reqvol',
      meta: { title: 'Upstream最大响应时间', icon: icon, monitorItem: { item: '20', subitem: '3' } }
    },
    {
      path: 'newsession',
      meta: { title: '平均响应时间', icon: icon, monitorItem: { item: '20', subitem: '4' } }
    },
    {
      path: 'err',
      meta: { title: '状态码', icon: icon, monitorItem: { item: '20', subitem: '5' } }
    },
    {
      path: 'session',
      meta: { title: '用户请求流量', icon: icon, monitorItem: { item: '20', subitem: '6' } }
    },
    {
      path: 'threads',
      meta: { title: '饱和度', icon: icon, monitorItem: { item: '20', subitem: '7' } }
    }
  ]
}
