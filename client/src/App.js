import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/app/Dashboard";

import './App.scss';

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <main>
                    <Route path="/" exact component={Login}/>
                    <Route path="/register" exact component={Register}/>

                    <Route path="/app/dashboard" exact component={Dashboard}/>
                </main>
            </Router>
        )
    }

}
