import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './CardModal.scss';

class CardModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeCard();
    };

    completeSale = () => {
        this.handleClose();
        this.props.actions.till.resetTotals();
        let transactionsToComplete = this.props.till.transactions.filter(item => !item.hold);
        let transaction = {
            shop: this.props.settings.shop,
            till: this.props.settings.till,
            transactions: transactionsToComplete,
            totals: this.props.till.totals,
            type: "INV",
            method: "CC",
            auth: ""
        };

        let heldSales = this.props.till.transactions.filter(item => item.hold);
        this.mapHeldSales(heldSales);
        this.props.actions.till.setTransactions(heldSales);

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.post(`/api/transactions`, transaction, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Transaction Completed!", "Create Transaction");

                this.saveSettings();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    mapHeldSales = sales => {
        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0
        };
        for(let x = 0, len = sales.length; x < len; x++) {
            let sale = sales[x];
            totals = this.props.mapLineItem(sale, totals);
        }
        this.props.actions.till.setTotals(totals);
    };

    saveSettings = () => {
        let till = this.props.settings.till;
        till.InvNo = Number(till.InvNo) + 1;
        till.DepNo = Number(till.DepNo) + 1;

        axios.post(`/api/settings/till/1`, till)
            .then(response => {
                console.log(response.data);

                toastr.success("Till Details updated!", "Update Settings");

                this.props.actions.settings.saveTill(response.data.till);
                this.handleClose();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    render() {
        return (
            <Modal show={this.props.modal.card} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Card Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.till.transactions &&
                        this.props.till.transactions.length === 0 &&
                        <p>There are no transaction line items to pay for!</p>
                    }
                    {this.props.till.transactions &&
                        this.props.till.transactions.length > 0 &&
                        <p>Complete this transaction as a card payment?</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    {this.props.till.transactions &&
                        this.props.till.transactions.length > 0 &&
                        <Button variant="primary" onClick={this.completeSale}>
                            Complete
                        </Button>
                    }
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
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardModal);
