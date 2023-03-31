import axios from 'axios'
// create an axios instance
const service = axios.create({
    baseURL: '/api',
    // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 10 * 1000, // request timeout
})
// request interceptor
// service.interceptors.request.use(
//     (config) => {
//         // do something before request is sent
//
//         if (store.getters.token) {
//             // let each request carry token
//             // ['X-Token'] is a custom headers key
//             // please modify it according to the actual situation
//             config.headers['Authentication'] = getToken()
//         }
//         return config
//     },
//     (error) => {
//         // do something with request error
//         return Promise.reject(error)
//     }
// )
export default service