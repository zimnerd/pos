import React from 'react';
import { Button, Card, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";

import './CreditNoteOptionsModal.scss';

class CreditNoteOptionsModal extends React.Component {

    handleClose = () => {
        this.props.actions.closeCredit();
    };

    render() {
        return (
            <Modal show={this.props.modal.credit} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Credit Note Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Header>
                            <span><i className="fa fa-exchange"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Exchange</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            <span><i className="fa fa-refresh"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Refund</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            <span><i className="fa fa-money"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Lay-Bye</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
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
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditNoteOptionsModal);
