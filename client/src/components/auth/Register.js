import React from 'react';
// import axios from "axios";

import './Register.scss';

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
            confirm: ''
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
                    <h1>Register User</h1>
                    <hr/>
                </header>
                <main>
                    <form id="register-form">
                        <main>
                            <section className="form-group">
                                <label>Name:</label>
                                <input id="name" name="name" className="form-control" type="text" value={this.state.name}
                                       onChange={this.handleChange} placeholder="Name" required/>
                            </section>
                            <section className="form-group">
                                <label>Email Address:</label>
                                <input id="email" name="email" className="form-control" type="email" value={this.state.email}
                                       onChange={this.handleChange} placeholder="Email Address" required/>
                            </section>
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
                            <section className="form-group">
                                <label>Confirm Password:</label>
                                <input id="confirm" name="confirm" placeholder="Confirm Password" value={this.state.confirm}
                                       onChange={this.handleChange} className="form-control" type="password" required/>
                            </section>
                        </main>
                        <footer>
                            <section className="btn-group">
                                <button className="btn btn-primary float-right" onClick={this.onSubmit}>Register</button>
                                <button className="btn btn-secondary float-left">Back</button>
                            </section>
                        </footer>
                    </form>
                </main>
            </section>
        )
    }

}
