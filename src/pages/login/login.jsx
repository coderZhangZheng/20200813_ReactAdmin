import React, {Component} from 'react'
import { Form, Icon, Input, Button, message } from 'antd';

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item;
const WrapLogin = Form.create()(Login)
class Login extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      // err没有值，检验成功
      if (!err) {
        // console.log('提交登陆的ajax请求', values)
        // 请求登陆
        const {username, password} = values
        const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
        // console.log('请求成功', result)
        if (result.status===0) {            // 登陆成功
          // 提示登陆成功
          message.success('登陆成功')
          // 保存user
          const user = result.data
          memoryUtils.user = user           // 保存在内存中
          storageUtils.saveUser(user)       // 保存到local中
          // 跳转到管理界面 (不需要再回退回到登陆)(push,goback,replace)
          this.props.history.replace('/')
        } else { // 登陆失败
          // 提示错误信息
          message.error(result.msg)
        }
      } else {
        console.log('检验失败!')
      }
    });
  }
  validatePwd = (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
    if(!value) {
      callback('密码必须输入')
    } else if (value.length<4) {
      callback('密码长度不能小于4位')
    } else if (value.length>12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {      //这是正则的方法
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className='login'>
        <header className="login-header">
          <img src={logo} alt=""/>
          <h1>后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, whitespace: true, message: '用户名必须输入' },
                  { min: 4, message: '用户名至少4位' },
                  { max: 12, message: '用户名最多12位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                ],
                initialValue: 'admin', // 初始值
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.validatePwd
                  }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

export default WrapLogin