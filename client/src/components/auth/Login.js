import React from 'react';
import { Link } from "react-router-dom";
// import axios from "axios";

import './Login.scss';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            password: ''
        };
    }

    onSubmit(event) {
        event.preventDefault();
        // axios.post("/api/user/register", this.state)
        //     .then(response => {
        //         console.log(response);
        //     })
        //     .catch(error => console.log(error));
    }

    handleChange(event) {
        event.preventDefault();
        let formValues = this.state;

        let name = event.target.name;
        formValues[name] = event.target.value;

        this.setState(formValues);
    }

    render() {
        return (
            <section>
                <header>
                    <h1>Login User</h1>
                    <hr/>
                </header>
                <main>
                    <form id="login-form">
                        <main>
                            <section className="form-group">
                                <label>Username:</label>
                                <input id="username" name="username" className="form-control" type="text" value={this.state.username}
                                       onChange={this.handleChange} placeholder="Username" required/>
                            </section>
                            <section className="form-group">
                                <label>Password:</label>
                                <input id="password" name="password" className="form-control" type="password" value={this.state.password}
                                       onChange={this.handleChange} placeholder="Password" required/>
                            </section>
                        </main>
                        <footer>
                            <button className="btn btn-primary float-right" onClick={this.onSubmit}>Login</button>
                            <Link to="/register" className="btn btn-secondary float-left">Register</Link>
                        </footer>
                    </form>
                </main>
            </section>
        )
    }

}
