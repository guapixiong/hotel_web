/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-17 15:05
 **/
import request from '@/util/request'
export function getAllUser(){
    return request({
        url:'/customer/getAllUser'
    })
}
export function getOccupantByTime(params){
    return request({
        url:'/customer/getOccupantByTime',
        params:params
    })
}