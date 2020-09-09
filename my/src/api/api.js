/*
 * @Date: 2020-07-17 14:31:34
 * @LastEditTimes: Do not edit
 * @Descripttion: describe
 */
import {
  get,
  post,
  put,
  postForm
} from './http'

import config from '@/config/config'

function getUrl(path, key) {
  if (!key) {
      key = 'app'
  }
  if (config.baseUrl[key]) {
      return config.baseUrl[key] + path
  }
  return ''
}

// 登录 
export const login = p => postForm(getUrl('login', 'login'), p)
export const registered = p => postForm(getUrl('registeredUser', 'login'), p)
