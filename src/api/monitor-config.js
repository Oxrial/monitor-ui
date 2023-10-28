import { post } from '@/utils/request'

/**
 * @desc: 监控项
 * @param {*} params
 * @return {*}
 */
export function monitorItemconsult(params) {
  return post('/conf/itemconsult', params, true)
}

/**
 * @desc: 监控项详情
 * @param {*} params
 * @return {*}
 */
export function confGetItemDetailInfo(params) {
  return post('/conf/getItemDetailInfo', params, true)
}

/**
 * @desc: 阈值
 * @param {*} params
 * @return {*}
 */
export function monitorThreadconsult(params) {
  return post('/monitor/threadconsult', params)
}

export function confThreadmanage(params) {
  return post('/conf/threadmanage', params)
}
/**
 * @desc: 1 - 交易
 * @param {*} params
 * @return {*}
 */
export function monitorDetailThreadConsult(params) {
  return post('/monitor/detailThreadConsult', params)
}
export function confDetailThreadManage(params) {
  return post('/monitor/detailThreadManage', params)
}
/**
 * @desc: 2 - 交件
 * @param {*} params
 * @return {*}
 */
export function monitorCollectFileConsult(params) {
  return post('/monitor/collectFileConsult', params)
}
export function getMonitorCollectFileConsult(params) {
  return post('/monitor/getMonitorCollectFileConsult', params)
}
/**
 * @desc: 3 - 通知消息
 * @param {*} params
 * @return {*}
 */
export function monitorEdbConfConsult(params) {
  return post('/monitor/edbConfConsult', params)
}
/**
 * @desc: 7 - 端口
 * @param {*} params
 * @return {*}
 */
export function monitorPortConfConsult(params) {
  return post('/monitor/portConfConsult', params)
}
/**
 * @desc: 8 - 对帐
 * @param {*} params
 * @return {*}
 */
export function monitorProcessConfConsult(params) {
  return post('/monitor/processConfConsult', params)
}
/**
 * @desc: 9 - 服务
 * @param {*} params
 * @return {*}
 */
export function monitorServiceInfoConfConsult(params) {
  return post('/monitor/serviceInfoConfConsult', params)
}

/**
 * @desc: 11 - pg
 * @param {*} params
 * @return {*}
 */
export function monitorTableInfoConfConsult(params) {
  return post('/monitor/tableInfoConfConsult', params)
}
