import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as settingsActions from "../../../../redux/actions/settings.action";

import './CashModal.scss';

class CashModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeCash();
    };

    completeSale = () => {
        let transaction = {
            shop: this.props.settings.shop,
            till: this.props.settings.till,
            transactions: this.props.till.transactions,
            totals: this.props.till.totals,
            type: "INV",
            method: "Cash",
            auth: ""
        };

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.post(`/api/transactions`, transaction, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Transaction Completed!", "Create Transaction");

                this.props.actions.till.resetTotals();
                this.props.actions.till.resetTransactions();
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
            <Modal show={this.props.modal.cash} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cash Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Complete this transaction as a cash payment?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.completeSale}>
                        Complete
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
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            settings: bindActionCreators(settingsActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CashModal);
