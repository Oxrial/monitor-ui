import request, { post } from '@/utils/request'

export function monitorRedissysinfoconsult(params) {
  return post('/monitor/redissysinfoconsult', params)
}

export function monitorRedishostinfoconsult(params) {
  return post('/monitor/redishostinfoconsult', params)
}

export function monitorGetDistinctItemInfo(params) {
  return request({
    url: '/monitor/getDistinctItemInfo',
    method: 'get',
    params
  })
}

export function monitorGetsubitem(params) {
  return post('/monitor/getsubitem', params)
}
export function confGetLinkmanConfTree(params) {
  return post('/conf/getLinkmanConfTree', params)
}
