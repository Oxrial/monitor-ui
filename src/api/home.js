import { post } from '@/utils/request'

// 获取监控项列表
export function monitorGetAllMonitor(data) {
    return post('/monitor/getAllMonitor', data)
}

// 获取监控项明细列表
export function getMoniterDetailList(data) {
    return post('/monitor/getMoniterDetailList', data)
}

// 获取联系人列表
export function getUserMonitorList(data) {
    return post('/monitor/getUsermonitorList', data)
}


// 获取系统阈值列表
export function getSystemThreshold(data) {
    return post('/monitor/getSystemthresholdList', data)
}

// 获取部门信息列表
export function getDetpList(data) {
    return post('/monitor/getDetpList', data)
}

// 获取调度方案信息列表
export function getSchedulingSchemeList(data) {
    return post('/monitor/getSchedulingschemeList', data)
}

// 获取采集项信息列表
export function getCollectionList(data) {
    return post('/monitor/getCollectionList', data)
}

// 获取监控项json配置数据
export function getMoniterJson(data) {
    return post('/statics/json/moniterItem.json', data)
}

// 获取系统分类数据==监控开关
export function sysmonitorItemTree(data) {
    return post('/monitor/getSysmonitorItemTree', data)
}

// 获取监控项数据==监控开关
export function monitorItemTreeHome(data) {
    return post('/monitor/getMonitorItemTree', data)
}

// 根据监控项获取主机信息==监控开关
export function getHostByMoniterItem(data) {
    return post('/monitor/getHostByMoniterItem', data)
}

