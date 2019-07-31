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
        this.props.actions.till.setAuthCommand("refund");
        this.props.actions.modal.openAuthentication();
        this.handleClose();
    };

    laybyeRefund = () => {
        this.props.actions.till.activateLayBye();
        this.props.actions.till.setAuthCommand("refund");
        this.props.actions.modal.openAuthentication();
        this.handleClose();
    };

    render() {
        return (
            <Modal size="lg" show={this.props.modal.credit} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Credit Note Options</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex">
                    <div className="col-4">
                        <Card onClick={this.activateExchange} className="bg-dark text-center">
                            <Card.Header>
                                <span><i className="fa fa-exchange"/></span>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Exchange</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card onClick={this.refund} className="bg-dark text-center">
                            <Card.Header>
                                <span><i className="fa fa-refresh"/></span>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Refund</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card onClick={this.laybyeRefund} className="bg-dark text-center">
                            <Card.Header>
                                <span><i className="fa fa-refresh"/></span>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Laybye Refund</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
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
