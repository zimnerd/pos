import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './RefundModal.scss';

class RefundModal extends React.Component {

    state = {
        docNo: ""
    };

    handleChange = event => {
        this.setState({
            docNo: event.target.value
        });
    };

    handleClose = () => {
        this.props.actions.modal.closeRefund();
    };

    mapHeldSales = sales => {
        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0,
            items: 0
        };
        for (let x = 0, len = sales.length; x < len; x++) {
            let sale = sales[x];
            totals = this.props.mapLineItem(sale, totals);
            totals.items++;
        }
        this.props.actions.till.setTotals(totals);
    };

    findDocument = (e) => {
        e.preventDefault();
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/transactions/${this.state.docNo}/refunds`, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Refund found!", "Find Refund");

                this.mapHeldSales(response.data.lineItems.transactions);
                this.props.actions.till.setTransactions(response.data.lineItems.transactions);
                this.props.actions.till.activateRefund();
                this.checkLaybye(response.data.lineItems.transactions);
                this.handleClose();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("Transaction could not be found!", "Find Transaction");
                    this.props.actions.modal.closeRefund();
                    this.props.actions.modal.openRefundDetails();
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    checkLaybye = (transactions) => {
        for (let transaction of transactions) {
            if (transaction.type !== 'L/B') {
                continue;
            }

            this.props.actions.till.activateLayBye();
            break;
        }
    };

    render() {
        return (
            <Modal show={this.props.modal.refund} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Refund</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter the invoice number you would like a refund for:</p>
                    <Form onSubmit={this.findDocument}>
                        <div className="form-group">
                            <label>Invoice Number:</label>
                            <input name="invoice" type="text" className="form-control"
                                   value={this.state.docNo} onChange={this.handleChange}/>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.findDocument}>
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
        modal: state.modal
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

export default connect(mapStateToProps, mapDispatchToProps)(RefundModal);
