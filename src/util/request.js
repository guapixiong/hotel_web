import axios from 'axios'
// create an axios instance
import router from "@/pages/admin/router/router";
import {message} from "ant-design-vue";
import store from '@/pages/admin/store/store'
axios.defaults.withCredentials = true;  // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
const service = axios.create({
    baseURL: '/api',
    // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 10 * 1000, // request timeout
})
// request interceptor
service.interceptors.request.use(
    (config) => {
        // do something before request is sent
        config.headers['Authentication'] = store.getters.getToken
        config.cancelToken=new axios.CancelToken((cancel)=>{
            //使用vuex 定义pushCancel，请求进来存入
            store.dispatch('pushCancel',{cancelToken:cancel})
        })
        // if (localStorage.getItem('token')!=undefined&&localStorage.getItem('token').length>0) {
        //     // let each request carry token
        //     // ['X-Token'] is a custom headers key
        //     // please modify it according to the actual situation
        //     config.headers['Authentication'] = localStorage.getItem('token')
        // }
        return config
    },
    (error) => {
        // do something with request error
        return Promise.reject(error)
    }
)
service.interceptors.response.use(
    response=>{
        return response;
    },
    error => {
        if(error.response){
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    store.dispatch('clearCancel');

                    //localStorage.clear()
                    store.commit('delToken')
                    message.info("token过期，请重新登录")
                    setTimeout(function (){
                        router.replace('/login/signIn').catch(()=>{})
                    },1000)
                    break;

            }
        }
        return Promise.reject(error.response.data)
    }
)
export default service