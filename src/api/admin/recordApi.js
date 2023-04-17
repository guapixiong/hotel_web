import request from '@/util/request'

/**
 * 根据订单时间来查找订单记录
 * @param params
 * @returns {AxiosPromise}
 */
export function getOrderByTime(params){
    return request({
        url:'/orderRecord/getOrderByTime',
        params:params
    })
}

/**
 * 添加快速入住信息
 * @param params
 * @returns {AxiosPromise}
 */
export function addFastCheckIn(params){
    return request({
        url:'/orderRecord/addFastCheckIn',
        method:'post',
        data:params
    })
}

/**
 * 添加预定入住信息
 * @param params
 * @returns {AxiosPromise}
 */
export function addBookAStayInfo(params){
    return request({
        url:'/orderRecord/addBookAStayInfo',
        method:'post',
        data:params
    })
}

export function cancelOrderById(params){
    return request({
        url:'/orderRecord/cancelOrderById',
        params:params
    })
}


