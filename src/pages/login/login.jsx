import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd';

import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item;
class Login extends Component {
  handleSubmit = (event) => {
    event.preventDefault();                //阻止默认跳转
    //1.检验数据和收集数据 2.发送异步请求 3.保存响应数据 4.跳转到主页面
    this.props.form.validateFields(async (err, values) => {
      // err没有值，检验成功
      if (!err) {
        // console.log('提交登陆的ajax请求', values)
        const {username, password} = values
        // 请求成功或失败，请求成功继续走下面程序，请求失败在ajax代码那里就处理了
        const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
        // 登录成功或失败
        if (result.status===0) {            // 登陆成功，1.提示登录成功 2.保存user 3.跳转页面
          message.success('登陆成功')
          const user = result.data          // 保存user
          memoryUtils.user = user           // 保存在内存中
          storageUtils.saveUser(user)       // 保存到local中
          // 跳转到管理界面,不需要再回退回到登陆
          this.props.history.replace('/')   //goback，replace，push
        } else {                            // 登陆失败，提示登录错误
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
    //如果用户直接输入xxx/login, 此时如果用户已经登录，则自动跳转到管理界面
    const user = memoryUtils.user
    if(user && user._id) {
      return <Redirect to='/' />
    }
    //getFieldDecorator函数作用——验证输入的数据有效性
    const {getFieldDecorator} = this.props.form;
    return (
      <div className='login'>
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
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
            </Item>
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

const WrapLogin = Form.create()(Login)
export default WrapLogin