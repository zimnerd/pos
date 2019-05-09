import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Register from "./components/auth/Register";

import './App.scss';
import Login from "./components/auth/Login";

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <main>
                    <Route path="/" exact component={Login}/>
                    <Route path="/register" exact component={Register}/>
                </main>
            </Router>
        )
    }

}
