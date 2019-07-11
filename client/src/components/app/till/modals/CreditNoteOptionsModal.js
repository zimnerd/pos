import React from 'react';
import { Button, Card, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './CreditNoteOptionsModal.scss';

class CreditNoteOptionsModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeCredit();
    };

    activateExchange = () => {
        this.props.actions.till.setAuthCommand("exchange");
        this.props.actions.modal.openAuthentication();
        this.handleClose();
    };

    refund = () => {
        this.props.actions.modal.openRefund();
        this.handleClose();
    };

    credit = () => {
        this.props.actions.till.setAuthCommand("credit");
        this.props.actions.modal.openAuthentication();
        this.handleClose();
    };

    render() {
        return (
            <Modal show={this.props.modal.credit} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Credit Note Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card onClick={this.activateExchange}>
                        <Card.Header>
                            <span><i className="fa fa-exchange"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Exchange</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card onClick={this.refund}>
                        <Card.Header>
                            <span><i className="fa fa-refresh"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Refund</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card onClick={this.credit}>
                        <Card.Header>
                            <span><i className="fa fa-credit-card"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Credit</Card.Title>
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
        modal: state.modal
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditNoteOptionsModal);
