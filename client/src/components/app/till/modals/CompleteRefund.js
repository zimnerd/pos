import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './CompleteRefund.scss';

class CompleteRefund extends React.Component {

    completeRefund = async () => {
        if (this.props.till.refundData) {
            await this.saveRefund();
        }

        this.props.actions.till.resetTotals();
        this.props.actions.till.resetTransactions();
        this.props.actions.till.deactivateRefund();
        this.props.actions.till.setRefund();
        this.props.actions.modal.closeCompleteRefund();
        this.handleClose();
    };

    saveRefund = async () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.post(`/api/transactions/refunds`, this.props.till.refundData, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Refund saved!", "Save Refund");
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

    handleClose = () => {
        this.props.actions.modal.closeCompleteRefund();
    };

    render() {
        return (
            <Modal show={this.props.modal.refundComplete} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Complete Refund</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.till.transactions &&
                    this.props.till.transactions.length === 0 &&
                    <p>There are no transaction line items to refund!</p>
                    }
                    {this.props.till.transactions &&
                    this.props.till.transactions.length > 0 &&
                    <p>Complete this refund?</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    {this.props.till.transactions &&
                    this.props.till.transactions.length > 0 &&
                    <Button variant="primary" onClick={this.completeRefund}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CompleteRefund);
