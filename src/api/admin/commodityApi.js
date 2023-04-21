/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-12 09:16
 **/
import request from '@/util/request'

/**
 * 获取所有商品记录
 * @returns {AxiosPromise}
 */
export function getAllInfo(){
    return request({
        url:'/commodity/getAllInfo'
    })
}

/**
 * 获取商品类型
 * @returns {AxiosPromise}
 */
export function getCommodityType(){
    return request({
        url:'/commodity/getCommodityType'
    })
}

/**
 * 插入一条商品信息
 * @param params
 * @returns {AxiosPromise} 修改条数
 */
export function insertCommodity(params){
    return request({
        url:'/commodity/insertCommodity',
        method:'post',
        data:params
    })
}

/**
 * 修改一条商品信息
 * @param params
 * @returns {AxiosPromise} 修改条数
 */
export function updateCommodity(params){
    return request({
        url:'/commodity/updateCommodity',
        method:'post',
        data:params
    })
}

/**
 * 删除一个商品
 * @param params
 * @returns {AxiosPromise}
 */
export function deleteCommodity(params){
    return request({
        url:'/commodity/deleteCommodity',
        params:params
    })
}

/**
 * 通过时间来获取商品记录
 * @returns {AxiosPromise}
 */
export function getCommodityRecordByTime(params){
    return request({
        url:'/commodity/getCommodityRecordByTime',
        params:params
    })
}

/**
 * 提交多条商品订单
 */
export function insertCommodityRecords(params){
    return request({
        url:'/commodity/insertCommodityRecords',
        method:'post',
        data:params
    })
}
export function deleteCommodityRecordById(params){
    return request({
        url:'/commodity/deleteCommodityRecordById',
        params:params
    })
}
