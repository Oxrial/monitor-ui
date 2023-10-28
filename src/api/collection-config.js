import { post } from '@/utils/request'
export function monitorCollectRelaConsult(params) {
  return post('/monitor/collectRelaConsult', params, true)
}

export function monitorSystemParameterConsult(params) {
  return post('/monitor/systemParameterConsult', params)
}
