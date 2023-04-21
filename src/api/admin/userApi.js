/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-17 15:05
 **/
import request from '@/util/request'

/**
 * 获取所有用户
 * @returns {AxiosPromise}
 */
export function getAllUser(){
    return request({
        url:'/customer/getAllUser'
    })
}

/**
 * 获取入住人
 * @param params
 * @returns {AxiosPromise}
 */
export function getOccupantByTime(params){
    return request({
        url:'/customer/getOccupantByTime',
        params:params
    })
}

/**
 * 删除入住人记录
 * @param params
 * @returns {AxiosPromise}
 */
export function deleteOccupantById(params){
    return request({
        url:'/customer/deleteOccupantById',
        params:params
    })
}

/**
 * 根据id删除顾客
 * @param params
 * @returns {AxiosPromise}
 */
export function deleteCustomerById(params){
    return request({
        url:'/customer/deleteCustomerById',
        params:params
    })
}

/**
 * 插入顾客
 * @param params
 * @returns {AxiosPromise}
 */
export function insertCustomer(params){
    return request({
        url:'/customer/insertCustomer',
        params:params
    })
}

/**
 * 删除顾客
 * @param params
 * @returns {AxiosPromise}
 */
export function updateCustomer(params){
    return request({
        url:'/customer/updateCustomer',
        params:params
    })
}