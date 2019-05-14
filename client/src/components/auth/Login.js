import React from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import toastr from 'toastr';

import './Login.scss';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            errors: []
        };
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({ errors: [] });
        axios.post("/api/user/login", this.state)
            .then(response => {
                console.log(response);
                toastr.success("Login Successful!", "Login User");
                this.props.history.push("/app/dashboard");
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("The username and password combination is invalid!", "Unauthorized");
                } else {
                    toastr.error("The information you have supplied is invalid!", "Validation");
                    this.setState({
                        errors: error.response.data.errors
                    });
                }
            });
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
                                {this.state.errors['username'] && <p>{this.state.errors['username']}</p>}
                            </section>
                            <section className="form-group">
                                <label>Password:</label>
                                <input id="password" name="password" className="form-control" type="password" value={this.state.password}
                                       onChange={this.handleChange} placeholder="Password" required/>
                                {this.state.errors['password'] && <p>{this.state.errors['password']}</p>}
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
