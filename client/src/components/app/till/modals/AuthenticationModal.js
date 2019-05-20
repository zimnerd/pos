import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";

import './AuthenticationModal.scss';

class AuthenticationModal extends React.Component {

    handleClose = () => {
        this.props.actions.closeAuthentication();
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
                    <Button variant="primary" onClick={this.handleClose}>
                        Authenticate
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

function mapStateToProps(state) {
    return {
        modal: state.modal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationModal);
