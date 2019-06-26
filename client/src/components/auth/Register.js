import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from 'axios';
import toastr from 'toastr';

import * as authActions from "../../redux/actions/auth.action";

import './Register.scss';

class Register extends React.Component {

    state = {
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'RM',
        confirm: ''
    };

    onSubmit = event => {
        event.preventDefault();
        this.props.actions.errorReset();

        axios.post('/user/register', this.state)
            .then(response => {
                console.log(response);
                toastr.success('You have been registered successfully!', 'Register User');

                this.props.history.push('/app/dashboard');
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 500) {
                    toastr.error('There was an error when trying to register your account!', 'Register User');
                } else {
                    toastr.error('The information you have supplied is invalid!', 'Validation');
                    this.props.actions.validationError(error.response.data.errors);
                }
            });
    };

    handleChange = event => {
        event.preventDefault();
        let formValues = this.state;

        let name = event.target.name;
        formValues[name] = event.target.value;

        this.setState(formValues);
    };

    render() {
        return (
            <section>
                <header>
                    <h1>Register User</h1>
                    <hr/>
                </header>
                <main>
                    <form id='register-form'>
                        <main>
                            <section className='form-group'>
                                <label>Name:</label>
                                <input id='name' name='name' className='form-control' type='text'
                                       value={this.state.name}
                                       onChange={this.handleChange} placeholder='Name' required/>
                                {this.props.auth.errors['name'] && <p>{this.props.auth.errors['name']}</p>}
                            </section>
                            <section className='form-group'>
                                <label>Email Address:</label>
                                <input id='email' name='email' className='form-control' type='email'
                                       value={this.state.email}
                                       onChange={this.handleChange} placeholder='Email Address' required/>
                                {this.props.auth.errors['email'] && <p>{this.props.auth.errors['email']}</p>}
                            </section>
                            <section className='form-group'>
                                <label>Role:</label>
                                <select id='role' name='role' placeholder='Role'
                                       value={this.state.role}
                                        // defaultValue='Role'
                                       onChange={this.handleChange} className='form-control' required>
                                {this.props.auth.roles &&
                                    this.props.auth.roles.map((item, index) => {
                                        return (
                                            <option key={index} value={item.code}>{item.description}</option>
                                        )
                                    })
                                }
                                </select>
                                {this.props.auth.errors['role'] && <p>{this.props.auth.errors['role']}</p>}
                            </section>
                            <section className='form-group'>
                                <label>Username:</label>
                                <input id='username' name='username' className='form-control' type='text'
                                       value={this.state.username}
                                       onChange={this.handleChange} placeholder='Username' required/>
                                {this.props.auth.errors['username'] && <p>{this.props.auth.errors['username']}</p>}
                            </section>
                            <section className='form-group'>
                                <label>Password:</label>
                                <input id='password' name='password' className='form-control' type='password'
                                       value={this.state.password}
                                       onChange={this.handleChange} placeholder='Password' required/>
                                {this.props.auth.errors['password'] && <p>{this.props.auth.errors['password']}</p>}
                            </section>
                            <section className='form-group'>
                                <label>Confirm Password:</label>
                                <input id='confirm' name='confirm' placeholder='Confirm Password'
                                       value={this.state.confirm}
                                       onChange={this.handleChange} className='form-control' type='password' required/>
                                {this.props.auth.errors['confirm'] && <p>{this.props.auth.errors['confirm']}</p>}
                            </section>
                        </main>
                        <footer>
                            <button className='btn btn-primary float-right' onClick={this.onSubmit}>Register</button>
                            <Link to='/app/dashboard' className='btn btn-secondary float-left'>Back</Link>
                        </footer>
                    </form>
                </main>
            </section>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
