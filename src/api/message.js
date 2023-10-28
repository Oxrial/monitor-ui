import { post } from '@/utils/request'
/**
 * @desc:
 * @param {*} params
 * @return {*}
 */
export function confMsgConsult(params) {
  return post('/conf/msgConsult' + (params.strType || ''), params, true)
}

/**
 * @desc:
 * @param {*} params
 * @return {*}
 */
export function confGetSystemHostTree(params) {
  return post('/conf/getSystemHostTree', params, true)
}
