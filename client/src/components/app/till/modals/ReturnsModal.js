import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";

import './ReturnsModal.scss';
import Form from "react-bootstrap/Form";

class ReturnsModal extends React.Component {

    handleClose = () => {
        this.props.actions.closeReturns();
    };

    render() {
        return (
            <Modal show={this.props.modal.returns} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Returns</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <label>Name:</label>
                            <input name="name" type="text"  className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Cell Number:</label>
                            <input name="cell" type="text"  className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input name="address-line-1" type="text"  className="form-control"/>
                            <input name="address-line-2" type="text"  className="form-control"/>
                            <input name="address-line-3" type="text"  className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Code:</label>
                            <input name="code" type="text"  className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Email Address:</label>
                            <input name="email" type="email" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>ID Number:</label>
                            <input name="identity" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Alternate Number:</label>
                            <input name="alternate" type="text" className="form-control"/>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Continue
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

export default connect(mapStateToProps, mapDispatchToProps)(ReturnsModal);
