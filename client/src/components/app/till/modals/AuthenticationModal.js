import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './AuthenticationModal.scss';
import axios from "axios";
import toastr from "toastr";

class AuthenticationModal extends React.Component {

    state = {
        username: "",
        password: ""
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleClose = () => {
        this.props.actions.modal.closeAuthentication();
    };

    authenticate = async () => {
        let auth = await this.authUser();
        if (!auth) {
            return;
        }

        switch (this.props.till.command) {
            case "exchange":
                if (await this.activate(this.props.till.command)) {
                    await this.props.actions.till.activateExchange();
                    this.props.mapTransactions();
                }
                break;
            case "staff":
                if (await this.activate(this.props.till.command)) {
                    await this.props.actions.till.activateStaff();
                    this.props.mapTransactions();
                }
                break;
            default:
                this.handleClose();
        }

        this.handleClose();
    };

    authUser = async () => {
        if (this.props.user.username === this.state.username) {
            toastr.error("The admin authentication cannot be the same as the signed in user.", "Forbidden");
            return false;
        }
        let credentials = { username: this.state.username, password: this.state.password };
        return await axios.post("/user/admin/login", credentials)
            .then(async response => {
                console.log(response);
                toastr.success("Admin Authenticated!", "Admin Authentication");

                await this.setState({ user: response.data.success.token });
                return true;
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("Admin details supplied are invalid.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
                return false;
            });
    };

    activate = async (type) => {
        const headers = {
            'Authorization': 'Bearer ' + this.state.user
        };
        return await axios.get(`/transactions/activate/${type}`, { headers: headers })
            .then(response => {
                console.log(response);
                toastr.success("Activation has been authorized!", "Authorize Activation");

                return true;
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("Admin details supplied are invalid.", "Unauthorized");
                } else if (error.response.status === 403) {
                    toastr.error("The details supplied do not have the required permissions to activate.", "Forbidden");
                } else {
                    toastr.error("Unknown error.");
                }
                return false;
            });};

    render() {
        return (
            <Modal show={this.props.modal.auth} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Authenticate</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <div className="text-center">
                            <span><i className="fa fa-warning"/></span>
                            <p>Authenticate as an admin user.</p>
                        </div>
                        <div className="form-group">
                            <label>Username: </label>
                            <input type="text" name="username" className="form-control" placeholder="Username"
                                   value={this.state.username} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Password: </label>
                            <input type="password" name="password" className="form-control" placeholder="Password"
                                   value={this.state.password} onChange={this.handleChange}/>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.authenticate}>
                        Authenticate
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

function mapStateToProps(state) {
    return {
        modal: state.modal,
        till: state.till,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationModal);
