import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Customer from './components/customer'
import Products from './components/products'

export default (
    <Switch>
        <Route exact path='/' component = { Customer } />
        <Route path='/products' component = { Products } />
    </Switch>
)