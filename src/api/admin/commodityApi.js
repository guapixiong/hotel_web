/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-12 09:16
 **/
import request from '@/util/request'
export function getAllInfo(){
    return request({
        url:'/commodity/getAllInfo'
    })
}
export function getCommodityType(){
    return request({
        url:'/commodity/getCommodityType'
    })
}