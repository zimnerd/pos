import React from 'react';
import axios from "axios";

import './Register.scss';
import {Link} from "react-router-dom";

export default class Register extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: '',
            username: '',
            password: '',
            confirm: '',
            errors: []
        };
    }

    onSubmit(event) {
        event.preventDefault();
        axios.post("/api/user/register", this.state)
            .then(response => {
                console.log(response);
                this.props.history.push("/");
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 500) {
                    console.log("Add toaster here. An error has occurred!")
                } else {
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
                    <h1>Register User</h1>
                    <hr/>
                </header>
                <main>
                    <form id="register-form">
                        <main>
                            <section className="form-group">
                                <label>Name:</label>
                                <input id="name" name="name" className="form-control" type="text"
                                       value={this.state.name}
                                       onChange={this.handleChange} placeholder="Name" required/>
                                {this.state.errors['name'] && <p>{this.state.errors['name']}</p>}
                            </section>
                            <section className="form-group">
                                <label>Email Address:</label>
                                <input id="email" name="email" className="form-control" type="email"
                                       value={this.state.email}
                                       onChange={this.handleChange} placeholder="Email Address" required/>
                                {this.state.errors['email'] && <p>{this.state.errors['email']}</p>}
                            </section>
                            <section className="form-group">
                                <label>Username:</label>
                                <input id="username" name="username" className="form-control" type="text"
                                       value={this.state.username}
                                       onChange={this.handleChange} placeholder="Username" required/>
                                {this.state.errors['username'] && <p>{this.state.errors['username']}</p>}
                            </section>
                            <section className="form-group">
                                <label>Password:</label>
                                <input id="password" name="password" className="form-control" type="password"
                                       value={this.state.password}
                                       onChange={this.handleChange} placeholder="Password" required/>
                                {this.state.errors['password'] && <p>{this.state.errors['password']}</p>}
                            </section>
                            <section className="form-group">
                                <label>Confirm Password:</label>
                                <input id="confirm" name="confirm" placeholder="Confirm Password"
                                       value={this.state.confirm}
                                       onChange={this.handleChange} className="form-control" type="password" required/>
                                {this.state.errors['confirm'] && <p>{this.state.errors['confirm']}</p>}
                            </section>
                        </main>
                        <footer>
                            <button className="btn btn-primary float-right" onClick={this.onSubmit}>Register</button>
                            <Link to="/" className="btn btn-secondary float-left">Back</Link>
                        </footer>
                    </form>
                </main>
            </section>
        )
    }

}
