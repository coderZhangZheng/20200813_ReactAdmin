import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'

import LinkButton from '../link-button'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),     // 当前时间字符串
    dayPictureUrl: '',                        // 天气图片url
    weather: '',                              // 天气的文本
  }
  getTime = () => {
    this.intervalId = setInterval(() => {     // 每隔1s获取当前时间, 并更新状态数据currentTime
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }
  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('北京')   // 调用接口请求异步获取数据
    this.setState({dayPictureUrl, weather})                    // 更新状态
  }
  getTitle = () => {
    const path = this.props.location.pathname  // 得到当前请求路径
    let title
    menuList.forEach(item => {
      if (item.key===path) {                   // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title
      }else if (item.children) {               // 此处是else if
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)  
        if(cItem) {                            // 如果有值才说明有匹配的
          title = cItem.title                  // 取出它的title
        }
      }
    })
    return title
  }
  logout = () => {
    Modal.confirm({                            // 显示确认框
      content: '确定退出吗?',
      onOk: () => {
        console.log('OK', this)
        storageUtils.removeUser()              // 删除保存的user数据
        memoryUtils.user = {}
        this.props.history.replace('/login')   // 跳转到login
      }
    })
  }
  /*
  第一次render()之后执行一次
  一般在此执行异步操作: 发ajax请求/启动定时器
   */
  componentDidMount () {
    this.getTime()                  // 获取当前的时间
    this.getWeather()               // 获取当前天气
  }
  /*
  // 不能这么做: 不会更新显示
  componentWillMount () {
    this.title = this.getTitle()
  }*/
  componentWillUnmount () {
    clearInterval(this.intervalId)  
  }
  render() {
    const {currentTime, dayPictureUrl, weather} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()   // 得到当前需要显示的title
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎, {username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)