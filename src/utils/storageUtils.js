/*
进行local数据存储管理的工具模块,localStorage对于有些低版本浏览器不兼容,使用store第三方库
 */
import store from 'store'

const USER_KEY = 'user_key'
export default {
  saveUser(user) {                     //保存user
    store.set(USER_KEY, user)          //localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  getUser() {                          //读取user
    return store.get(USER_KEY) || {}   //return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  },
  removeUser() {                       //删除user
    store.remove(USER_KEY)             //localStorage.removeItem(USER_KEY)
  }
}




