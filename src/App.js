import React, { Component } from 'react'
import {BrowserRouter, HashRouter, Switch, Route} from 'react-router-dom'
import {Button, message} from 'antd'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends React.Component {

  handleClick = () =>{
    message.success("我成功了")
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}