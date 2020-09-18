import axios from 'axios'
import config from '@/config/config'
import util from '@/utils/util'
import router from '@/router'
import Qs from 'qs'

// axios.defaults.baseURL = config.baseUrl

function showToast(txt) {
    util.showTip(txt)
}

axios.interceptors.request.use(
    config => {
        config.headers.token = util.getToken()

        return config
    }, error => {
        return Promise.reject(error)
    })

// 响应拦截器
axios.interceptors.response.use(
    // 2xx?
    response => {
        if (response.status === 200) {
            if (!response.data.code) {
                return Promise.resolve(response)
            }

            // 会话超时
            if (response.data.code === '000') {
                util.setToken('')
                showToast('登录过期，请重新登录')
                setTimeout(() => router.push({
                    name: 'login'
                }), 1000)
                return Promise.reject(response)
            }

            // 成功
            if (response.data.success) {
                return Promise.resolve(response)
            }
            // 失败
            else {
                showToast(response.data.message)
                return Promise.reject(response)
            }
        } else if (response.status === 304) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                case 404:
                    showToast('404：网络请求不存在')
                    break
                default:
                    showToast(error.response.data.message || '接口出错了')
            }

            return Promise.reject(error.response)
        }
    }
);

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}
export function postForm(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'post',
                url: url,
                data: Qs.stringify(params)
            })
            .then(res => {
                console.log(res);
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

export function put(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}