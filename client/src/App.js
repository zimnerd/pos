import React from 'react';

import Register from "./components/auth/Register";

import './App.scss';

export default class App extends React.Component {

    render() {
        return (
            <main>
                <Register/>
            </main>
        )
    }

}
