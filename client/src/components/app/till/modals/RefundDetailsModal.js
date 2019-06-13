import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './RefundDetailsModal.scss';

class RefundDetailsModal extends React.Component {

    state = {
        invNo: "",
        invDate: "",
        idNo: "",
        cell: ""
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleClose = () => {
        this.props.actions.modal.closeRefundDetails();
    };

    handleContinue = () => {
        let refund = {
            invNo: this.state.invNo,
            invDate: this.state.invDate,
            idNo: this.state.idNo,
            cell: this.state.cell,
            brNo: this.props.settings.shop.BrNo
        };
        this.props.actions.till.setRefund(refund);
        this.props.actions.till.activateRefund();
        this.props.actions.modal.closeRefundDetails();
    };

    render() {
        return (
            <Modal show={this.props.modal.refundDetails} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Refund Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter the details of the invoice to refund:</p>
                    <Form>
                        <div className="form-group">
                            <label>Invoice Number:</label>
                            <input name="invNo" type="text" className="form-control"
                                   value={this.state.invNo} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Invoice Date:</label>
                            <input name="invDate" type="date" className="form-control"
                                   value={this.state.invDate} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>ID Number:</label>
                            <input name="idNo" type="text" className="form-control"
                                   value={this.state.idNo} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Cell Number:</label>
                            <input name="cell" type="text" className="form-control"
                                   value={this.state.cell} onChange={this.handleChange}/>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleContinue}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        modal: state.modal,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            till: bindActionCreators(tillActions, dispatch),
            modal: bindActionCreators(modalActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RefundDetailsModal);
