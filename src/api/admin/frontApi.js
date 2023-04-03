import request from '@/util/request'

/**
 * 获取房间总数
 * @returns {AxiosPromise}
 */
export function getRoomTotal(){
    return request({
        url:'/room/getRoomTotal',
    })
}

/**
 * 获取客流量
 * @param params 时间
 * @returns {AxiosPromise}
 */
export function getCustomerFlowByTime(params){
    return request({
        url:'/occupantRecord/getCustomerFlowByTime',
        params:params
    })
}

/**
 * 获取销售额（已完成订单的）
 * @param params
 * @returns {AxiosPromise}
 */
export function getSalesByTime(params){
    return request({
        url:'/orderRecord/getSalesByTime',
        params:params
    })
}

/**
 * 获取订单量（已取消订单也算）
 * @param params
 * @returns {AxiosPromise}
 */
export function getRecordTotal(params){
    return request({
        url:'/orderRecord/getRecordTotal',
        params:params
    })
}


