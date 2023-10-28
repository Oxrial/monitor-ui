import { post } from '@/utils/request'
/**
 * @desc:
 * @param {*} params
 * @return {*}
 */
export function confReloadCache(params) {
  return post('/conf/reloadCache', params, true)
}
