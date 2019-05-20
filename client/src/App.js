import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/app/Dashboard";
import Till from "./components/app/till/Till";

import './App.scss';
import StockInformation from "./components/app/stock/StockInformation";
import ProductDetail from "./components/app/stock/ProductDetail";

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <main>
                    <Route path="/" exact component={Login}/>
                    <Route path="/register" component={Register}/>

                    <Route path="/app/dashboard" component={Dashboard}/>

                    <Route path="/app/till" component={Till}/>

                    <Switch>
                        <Route path="/app/stock" exact component={StockInformation}/>
                        <Route path="/app/stock/:code" name="product-detail" component={ProductDetail}/>
                    </Switch>
                </main>
            </Router>
        )
    }

}
