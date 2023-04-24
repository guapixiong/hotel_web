/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-24 14:04
 **/
import Vuex from 'vuex'
import Vue from "vue";
Vue.use(Vuex)

/**
 * 总结：
 1、当页面初始化调用多个API时，使用axios响应拦截器判断状态码，如果登陆token失效，弹出请重新登陆的提示，取消后面的请求，跳转到登陆页面。
 2、跳转路由时使用路由拦截器，清除vuex存入的全局变量，取消后面的API请求。
 */
const store =new Vuex.Store({
    state:{
        token:'',
        administrator_id:'',
        axiosCancelArr:[],  //用于取消token过期后，主页面的多次请求api
    },
    getters:{
        getToken(state){
            return state.token||localStorage.getItem('token')||''
        },
        // getAdministratorId(state){
        //     return state.administrator_id||localStorage.getItem('administrator_id')
        // }
    },
    mutations:{
        setToken(state,token){
            state.token=token
            localStorage.setItem('token',token)
        },
        delToken(state){
            state.token=''
            localStorage.removeItem('token')
        },
        setAdministratorId(state,administrator_id){
            state.administrator_id=administrator_id
            localStorage.setItem('administrator_id',administrator_id)
        },
        delAdministratorId(state){
            state.administrator_id=''
            localStorage.removeItem('administrator_id')
        },
        PUSH_CANCEL(state,cancel){
            state.axiosCancelArr.push(cancel.cancelToken);
        },
        CLEAR_CANCEL(state){
            state.axiosCancelArr.forEach(e=>{
                e && e()
            });
            state.axiosCancelArr=[]
        }
    },
    actions:{
        pushCancel({commit},cancel){
            commit('PUSH_CANCEL',cancel)
        },
        clearCancel({commit}){
            commit('CLEAR_CANCEL')
        }

    },

})
export default store;