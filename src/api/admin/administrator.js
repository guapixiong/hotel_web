/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-21 11:37
 **/
import request from '@/util/request'
export  function signIn(params){
    return request({
        url:'/login/signIn',
        method:'post',
        data:params
    })
}
export function updatePassword(params){
    return request({
        url:'/administrator/updatePassword',
        method:'post',
        data:params
    })
}
export function signUp(params){
    return request({
        url:'login/signUp',
        method:'post',
        data:params
    })
}