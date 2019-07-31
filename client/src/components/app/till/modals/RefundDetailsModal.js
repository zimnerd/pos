import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './RefundDetailsModal.scss';

class RefundDetailsModal extends React.Component {

    state = {
        brNo: "",
        invNo: "",
        invType: "",
        invDate: "",
        idNo: "",
        cell: "",
        email: "",
        updated: false
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleClose = () => {
        this.setState({
            brNo: "",
            invNo: "",
            invDate: "",
            invType: "",
            idNo: "",
            cell: "",
            email: "",
            updated: false
        });
        this.props.actions.modal.closeRefundDetails();
        this.props.actions.till.deactivateLayBye();
    };

    handleContinue = () => {
        let refund = {
            invNo: this.state.invNo,
            invDate: this.state.invDate,
            invType: this.props.till.refundData ? this.props.till.refundData.invType : this.state.invType,
            idNo: this.state.idNo,
            cell: this.state.cell,
            email: this.state.email,
            found: this.state.found,
            brNo: this.props.till.refundData ? this.props.settings.shop.BrNo : this.state.brNo
        };
        this.props.actions.till.setRefund(refund);
        this.props.actions.till.activateRefund();
        this.props.actions.modal.closeRefundDetails();
        this.setState({
            brNo: "",
            invNo: "",
            invDate: "",
            invType: "",
            idNo: "",
            cell: "",
            email: "",
            updated: false
        });
    };

    componentDidUpdate(): void {
        if (this.props.till.refundData && !this.state.updated) {
            this.setState({
                invNo: this.props.till.refundData.invNo,
                invDate: this.props.till.refundData.invDate,
                idNo: this.props.till.refundData.idNo,
                cell: this.props.till.refundData.cell,
                email: this.props.till.refundData.email,
                brNo: this.props.till.refundData.brNo,
                found: this.props.till.refundData.found,
                updated: true
            });
        }
    }

    render() {
        return (
            <Modal show={this.props.modal.refundDetails} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Refund Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter the details of the invoice to refund:</p>
                    <Form className="d-flex">
                        <div className="col-6">
                            <div className="form-group">
                                <label>Invoice Number:</label>
                                <input name="invNo" type="text" className="form-control"
                                       value={this.state.invNo} onChange={this.handleChange}/>
                            </div>
                            {this.props.till && !this.props.till.refundData &&
                            <div className="form-group">
                                <label>Invoice Type:</label>
                                <select onChange={this.handleChange} className="form-control" name="invType">
                                    <option disabled selected>Select a type</option>
                                    <option value="INV">INV</option>
                                    <option value="L/B">L/B</option>
                                </select>
                            </div>
                            }
                            {this.props.till && !this.props.till.refundData &&
                            <div className="form-group">
                                <label>Branch Number:</label>
                                <input name="brNo" type="text" className="form-control"
                                       value={this.state.brNo} onChange={this.handleChange}/>
                            </div>
                            }
                            <div className="form-group">
                                <label>Email Address:</label>
                                <input name="email" type="email" className="form-control"
                                       value={this.state.email} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-6">
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
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="success" onClick={this.handleContinue}>
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
        settings: state.settings,
        till: state.till
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
