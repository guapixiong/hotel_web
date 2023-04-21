/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-21 11:37
 **/
import request from '@/util/request'
export  function signIn(params){
    return request({
        url:'/administrator/signIn',
        method:'post',
        data:params
    })
}