// import Vue from 'vue';
import {
    Toast
} from 'vant';
import config from '@/config/config'

var cachedToken = ''
var load = null
var env = process.env.NODE_ENV

const util = {
    getToken() {
        // if (cachedToken) {
        //     return cachedToken
        // }
        // return localStorage.getItem('token')

        var token = ''
        try {
            var user = this.getCookie('myUser')
            user = user && JSON.parse(user) || ''
            if (user.token) {
                token = user.token
            }
        } catch (error) {
            return ''
        }
        return token
    },
    setToken(token) {
        cachedToken = token
        localStorage.setItem('token', token)
    },
    showTip(txt) {
        Toast(txt)
    },
    showLoad(text) {
        load = Toast.loading({
            message: text || '加载中...',
            forbidClick: true,
            duration: 0,
            loadingType: 'spinner'
        })
    },
    hideLoad() {
        load && load.clear()
    },
    // 手机号验证
    isPhone(phone) {
        return (/^1[3456789]\d{9}$/.test(phone))
    },
    // 图片访问路径
    getImgUrl(fileName) {
        if (!fileName) {
            return ''
        }
        return config.imgBaseUrl + fileName
    },
    // 
    getShelterImgUrl(fileName) {
        if (!fileName) {
            return ''
        }
        return config.imgBaseUrl2 + fileName
    },
    // 图片上传接口
    getUploadApiUrl() {
        return config.uploadApiUrl
    },
    // 防抖
    debounce: function debounce(func, wait) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;

            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait);
        }
    },
    formatDate(date, type) {
        if (!date) {
            return ''
        }

        if (typeof date === 'string' || typeof date === 'number') {
            date = new Date(date)
        }

        var y = date.getFullYear(), // 年
            M = date.getMonth() + 1, //月份 
            d = date.getDate(), //日 
            h = date.getHours(), //小时 
            m = date.getMinutes(), //分 
            s = date.getSeconds() //秒 

        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s

        switch (type) {
            case 'minute':
                return `${y}-${M}-${d} ${h}:${m}`
            case 'second':
                return `${y}-${M}-${d} ${h}:${m}:${s}`
            case 'month':
                return `${y}-${M}`
            case 'monthToMinute':
                return `${M}-${d} ${h}:${m}`

            default:
                return `${y}-${M}-${d}`
        }
    },
    /**
     * @name: 
     * @description: 设置 cookie
     * @method: setCookie
     * @for: util
     * @param {name：cookie 名字, value: cookie 值, day: cookie 过期时间(默认365天)} {参数类型} 参数名 参数说明
     */
    setCookie(name, value, day) {
        var Days = day || 365 //天数设置
        var exp = new Date()
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toDateString()
        // document.cookie = name + "="+ escape (value) + ";domain=(这里可以放入指定使用的域名);expires=" + exp.toGMTString();
    },
    /**
     * @name: 
     * @description: 获取Cookie
     * @method: getCookie
     * @for: util
     * @param {name: 需要获取的 cookie 名称} {参数类型} 参数名 参数说明
     */
    getCookie(name) {
        var arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        if ((arr = document.cookie.match(reg))) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    /**
     * @name: 
     * @description: 删除cookie
     * @method: delCookie
     * @for: util
     * @param {name: 需要获取的 cookie 名称} {参数类型} 参数名 参数说明
     */
    delCookie(name) {
        this.setCookie(name, "", -1)
    },
    // 密码加密
    passwordEncryption(password) {
        return window.btoa(password)
    },
    // 密码解密
    passwordDectyption(code) {
        return window.atob(code)
    }
}

export default util