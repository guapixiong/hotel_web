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

/**
 * 取消订单
 * @param params
 * @returns {AxiosPromise}
 */
export function cancelOrderById(params){
    return request({
        url:'/orderRecord/cancelOrderById',
        params:params
    })
}

/**
 * 获取订单详情所需信息（包括房间信息，用户信息）
 * @param params
 * @returns {AxiosPromise}
 */
export function getOrderDetailById(params){
    return request({
        url:'/orderRecord/getOrderDetailById',
        params:params
    })
}

/**
 * 通过订单id来获取相关商品信息
 * @param params
 * @returns {AxiosPromise}
 */
export function getCommodityRecordByOrderId(params){
    return request({
        url:'/orderRecord/getCommodityRecordByOrderId',
        params:params
    })
}

/**
 * 结账退房操作
 * @param params
 * @returns {AxiosPromise}
 */
export function checkoutByOrderId(params){
    return request({
        url:'/orderRecord/checkoutByOrderId',
        method:'post',
        data:params
    })
}

/**
 * 退款操作
 * @param params
 * @returns {AxiosPromise}
 */
export function reimburseOrder(params){
    return request({
        url:'/orderRecord/reimburseOrder',
        params:params
    })
}
export function getCustomerByRecordId(params){
    return request({
        url:'/orderRecord/getCustomerByRecordId',
        params:params
    })
}


