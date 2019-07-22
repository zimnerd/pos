import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as authActions from "../../../../redux/actions/auth.action";

import './AuthenticationModal.scss';

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
        this.setState({
            username: "",
            password: ""
        });
        this.props.actions.modal.closeAuthentication();
        this.props.actions.till.deactivateLayBye();
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
                    this.props.actions.auth.setAuth(this.state.username);
                }
                break;
            case "staff":
                if (await this.activate(this.props.till.command)) {
                    await this.props.actions.till.activateStaff();
                    await this.props.mapTransactions();
                    await this.loadStaffDebtors();
                    this.props.actions.auth.setAuth(this.state.username);
                }
                break;
            case "credit":
                if (await this.activate(this.props.till.command)) {
                    await this.props.actions.till.activateCredit();
                    this.props.mapTransactions();
                    this.props.actions.auth.setAuth(this.state.username);
                }
                break;
            case "refund":
                if (await this.activate(this.props.till.command)) {
                    this.props.actions.modal.openRefund();
                    this.props.actions.auth.setAuth(this.state.username);
                    this.props.actions.modal.closeAuthentication();
                } else {
                    this.setState({
                        username: "",
                        password: ""
                    });
                    this.props.actions.till.deactivateLayBye();
                    this.props.actions.modal.closeAuthentication();
                }
                return;
            default:
        }

        this.handleClose();
    };

    loadStaffDebtors = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };
        axios.get('/debtors?stype=staff', { headers })
            .then(async response => {
                console.log(response.data);

                toastr.success("Debtors Retrieved!", "Retrieve Debtors");
                await this.props.actions.till.retrieveDebtors(response.data.debtors);
                await this.props.actions.till.nextDebtor(response.data.next);
                this.props.actions.modal.openDebtorModal();
            })
            .catch(error => {
                console.log(error);

                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    this.props.actions.till.retrieveDebtors();
                    this.props.actions.modal.openDebtorModal();
                    this.props.actions.till.nextDebtor(error.response.data.next);
                    console.log("No debtors found.")
                } else {
                    toastr.error("Unknown error.");
                }
            });
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
            });
    };

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
        user: state.user,
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            auth: bindActionCreators(authActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationModal);
