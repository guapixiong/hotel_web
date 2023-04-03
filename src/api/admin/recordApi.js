import request from '@/util/request'

export function getOrderByTime(params){
    return request({
        url:'/orderRecord/getOrderByTime',
        params:params
    })
}