import React from 'react';
import { Button, Card, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './SalesOptionsModal.scss';

class SalesOptionsModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeSales();
    };

    activateLayBye = () => {
        this.props.actions.till.activateLayBye();
        this.handleClose();
    };

    activateStaffPrice = () => {
        this.props.actions.till.setAuthCommand("staff");
        this.props.actions.modal.openAuthentication();
        this.handleClose();
    };

    holdSale = () => {
        this.handleClose();
        let heldSales = this.props.till.transactions.filter(item => item.hold);
        if (heldSales.length === 0) {
            return;
        }

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        let request = {
            till: this.props.settings.till,
            type: "INV",
            transactions: heldSales
        };

        this.props.actions.till.setTransactions();

        axios.post(`/api/transactions/hold`, request, { headers })
            .then(response => {
                console.log(response.data);
                this.props.actions.till.setTransactionId(response.data.sale);
                this.props.actions.modal.openTransaction();

                toastr.success("Transaction Held!", "Hold Transaction");

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

    retrieveSale = () => {
        this.handleClose();
        this.props.actions.modal.openRetrieveHeld();
    };

    render() {
        return (
            <Modal show={this.props.modal.sales} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sales Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card onClick={this.activateLayBye}>
                        <Card.Header>
                            <span><i className="fa fa-hand-grab-o"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>New Lay-Bye</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card onClick={this.activateStaffPrice}>
                        <Card.Header>
                            <span><i className="fa fa-money"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Staff Price</Card.Title>
                        </Card.Body>
                    </Card>
                    <hr/>
                    <Card onClick={this.holdSale}>
                        <Card.Header>
                            <span><i className="fa fa-hand-o-left"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Hold Sale</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card onClick={this.retrieveSale}>
                        <Card.Header>
                            <span><i className="fa fa-hand-o-right"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Retrieve Sale</Card.Title>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
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
        settings: state.settings,
        auth: state.auth
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

export default connect(mapStateToProps, mapDispatchToProps)(SalesOptionsModal);
