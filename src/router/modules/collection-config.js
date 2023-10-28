import Layout from '@/layout/index.vue'
import * as _ from './creater.js'
const icon = 'dashboard'
const subIcon = 'dashboard'
const collection = {
  path: '/collection',
  component: Layout,
  meta: {
    title: '采集项配置管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'trans',
      meta: { title: '交易采集', icon: icon },
      children: _.createTrans(subIcon)
    },
    {
      path: 'file',
      meta: { title: '文件采集', icon: icon },
      children: _.createFile(subIcon)
    },
    {
      path: 'message',
      meta: { title: '通知消息采集', icon: icon },
      children: _.createMessage(subIcon)
    },
    {
      path: 'dayend',
      meta: { title: '日终采集', icon: icon },
      children: _.createDayend(subIcon)
    },
    {
      path: 'reconciliation',
      meta: { title: '对帐采集', icon: icon },
      children: _.createReconciliation(subIcon)
    },
    {
      path: 'link',
      meta: { title: '链路信息采集', icon: icon, monitorItem: { item: '6', subitem: '1' } }
    },
    {
      path: 'port',
      meta: { title: '端口监控采集', icon: icon, monitorItem: { item: '7', subitem: '1' } }
    },
    {
      path: 'process',
      meta: { title: '进程监控采集', icon: icon, monitorItem: { item: '8', subitem: '1' } }
    },
    {
      path: 'nacos',
      meta: { title: '注册服务采集', icon: icon },
      children: _.createNacos(subIcon)
    },
    {
      path: 'redis',
      meta: { title: '缓存服务采集', icon: icon },
      children: _.createRedis(subIcon)
    },
    {
      path: 'pgsql',
      meta: { title: 'Pg数据库采集', icon: icon },
      children: _.createDBItem(subIcon, '11')
    },
    {
      path: 'sysresource',
      meta: { title: '系统资源采集', icon: icon },
      children: _.createSysresource(subIcon)
    },
    {
      path: 'mq',
      meta: { title: 'MQ采集', icon: icon, monitorItem: { item: '13', subitem: '1' } }
    },
    {
      path: 'self',
      meta: { title: '自身采集', icon: icon },
      children: _.createSelf(subIcon)
    },
    {
      path: 'oracle',
      meta: { title: 'Oracle数据库采集', icon: icon },
      children: _.createDBItem(subIcon, '15')
    },
    {
      path: 'host',
      meta: { title: '主机状态采集', icon: icon },
      children: _.createHost(subIcon)
    },
    {
      path: 'tomcat',
      meta: { title: 'Tomcat采集', icon: icon },
      children: _.createTomcat(subIcon)
    },
    {
      path: 'nginx',
      meta: { title: 'Nginx采集', icon: icon },
      children: _.createNginx(subIcon)
    },
    {
      path: 'jvm',
      meta: { title: 'Jvm采集', icon: icon, monitorItem: { item: '21', subitem: '1' } }
    },
    {
      path: 'tcp',
      meta: { title: 'TCP状态采集', icon: icon, monitorItem: { item: '22', subitem: '1' } }
    },
    {
      path: 'druid',
      meta: { title: 'Druid采集', icon: icon, monitorItem: { item: '23', subitem: '1' } }
    }
  ]
}
collection.children.forEach((item) => {
  item.name = _.setName(collection.path, item.path)
  if (item.children) {
    item.component = () => import('@/views/collection/index')
    item.children.forEach((iitem) => {
      iitem.name = _.setName(collection.path, item.path, iitem.path)
      iitem.component = () => import('@/views/collection/components/index')
    })
  } else {
    item.component = () => import('@/views/collection/components/index')
  }
})
export default collection
