import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './AuthenticationModal.scss';

class AuthenticationModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeAuthentication();
    };

    authenticate = async () => {
        switch (this.props.till.command) {
            case "exchange":
                await this.props.actions.till.activateExchange();
                this.props.mapTransactions();
                break;
            case "staff":
                await this.props.actions.till.activateStaff();
                this.props.mapTransactions();
                break;
            default:
                this.handleClose();
        }

        this.handleClose();
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
                            <input type="text" className="form-control" placeholder="Username"/>
                        </div>
                        <div className="form-group">
                            <label>Password: </label>
                            <input type="password" className="form-control" placeholder="Password"/>
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
        till: state.till
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
