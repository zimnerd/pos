import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/app/Dashboard";
import Till from "./components/app/till/Till";

import './App.scss';
import StockInformation from "./components/app/stock/StockInformation";

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <main>
                    <Route path="/" exact component={Login}/>
                    <Route path="/register" component={Register}/>

                    <Route path="/app/dashboard" component={Dashboard}/>

                    <Route path="/app/till" component={Till}/>
                    <Route path="/app/stock" component={StockInformation}/>
                </main>
            </Router>
        )
    }

}
