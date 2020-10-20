import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET') {
  return new Promise((resolve, reject) => {
    let promise
    //axios库的get和post请求的写法要熟悉
    if(type==='GET') { 
      promise = axios.get(url, { 
        params: data 
      })
    } else { 
      promise = axios.post(url, data)
    }
    promise.then(response => {
      resolve(response.data)
    }).catch(error => {
      message.error('请求出错了: ' + error.message)
    })
  })
}

// 请求登陆接口
// ajax('/login', {username: 'Tom', passsword: '12345'}, 'POST').then()
// 添加用户
// ajax('/manage/user/add', {username: 'Tom', passsword: '12345', phone: '13712341234'}, 'POST').then()
