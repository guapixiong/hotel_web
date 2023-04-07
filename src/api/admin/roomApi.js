import request from '@/util/request'

/**
 * 获取所有房间信息
 * @returns {AxiosPromise}
 */
export function getAllRoomDetail(){
    return request({
        url:'/room/getAllRoomDetail'
    })
}
export function imageUpload(params){
    return request({
        url:'/common/images/upload',
        method:'post',
        data:params,
        headers:{'Content-Type':'multipart/form-data'}
    })
}
export function imageDownload(params){
    return request({
        url:'/common/images/download',
        params:params,
        responseType: 'blob',
    })
}
