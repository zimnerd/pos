import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import toastr from 'toastr';

import * as authActions from '../../redux/actions/auth.action';

import './Login.scss';

class Login extends React.Component {

    state = {
        username: '',
        password: ''
    };

    onSubmit = event => {
        event.preventDefault();
        this.props.actions.errorReset();

        axios.post('/user/login', this.state)
            .then(response => {
                console.log(response);
                toastr.success('Login Successful!', 'Login User');

                this.props.actions.loginUser(response.data.success.token);
                this.props.history.push('/app/dashboard');
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error('The username and password combination is invalid!', 'Unauthorized');
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
                    <h1>Login User</h1>
                    <hr/>
                </header>
                <main>
                    <form id='login-form'>
                        <main>
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
                        </main>
                        <footer>
                            <button className='btn btn-primary float-right' onClick={this.onSubmit}>Login</button>
                            <Link to='/register' className='btn btn-secondary float-left'>Register</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
