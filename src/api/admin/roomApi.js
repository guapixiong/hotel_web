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

/**
 * 图片上传
 * @param params
 * @returns {AxiosPromise}
 */
export function imageUpload(params){
    return request({
        url:'/common/images/upload',
        method:'post',
        data:params,
        headers:{'Content-Type':'multipart/form-data'}
    })
}

/**
 * 图片下载
 * @param params
 * @returns {AxiosPromise}
 */
export function imageDownload(params){
    return request({
        url:'/common/images/download',
        params:params,
        responseType: 'blob',
    })
}

/**
 * 添加一个房间记录
 * @param params
 * @returns {AxiosPromise}
 */
export function insertRoom(params){
    return request({
        url:'/room/insertRoom',
        method:'post',
        data:params,
    })
}

/**
 * 更新房间信息
 * @param params
 * @returns {AxiosPromise}
 */
export function updateRoom(params){
    return request({
        url:'/room/updateRoom',
        method:'post',
        data:params,
    })
}

/**
 * 删除房间
 * @param params
 * @returns {AxiosPromise}
 */
export function deleteRoom(params){
    return request({
        url:'/room/deleteRoom',
        params:params
    })
}

