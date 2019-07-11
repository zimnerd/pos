import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './RefundReasonModal.scss';

class RefundReasonModal extends React.Component {

    state = {
        reason: "",
        comments: ""
    };

    handleClose = () => {
        this.setState({
            reason: "",
            comments: ""
        });
        this.props.actions.modal.closeReasonModal();
    };

    changeReason = event => {
        this.setState({
            reason: event.target.value
        });
    };

    handleChange = event => {
        this.setState({
            comments: event.target.value
        });
    };

    assignReason = () => {
        for (let transaction of this.props.till.transactions) {
            transaction.rescode = this.state.reason;
            transaction.comments = this.state.comments;
        }

        this.props.actions.till.setTransactions(this.props.till.transactions);
        this.props.actions.modal.openCompleteSale();
        this.handleClose();
    };

    render() {
        return (
            <Modal show={this.props.modal.refundReason} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Refund Reason</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">de
                        <p>Select the reason for refund:</p>
                        {this.props.settings.reasons && this.props.settings.reasons.map((item, index) => {
                            return (
                                <div key={index}>
                                    <span>{item.descr}</span>
                                    <input type="radio" className="form-control" value={item.resno}
                                           onChange={this.changeReason}
                                           name="reason"/>
                                </div>
                            )
                        })
                        }
                    </div>
                    <Form onSubmit={this.assignReason}>
                        <p>Enter your comments below:</p>
                        <textarea onChange={this.handleChange} name="comments"/>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.assignReason}>
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
        till: state.till,
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

export default connect(mapStateToProps, mapDispatchToProps)(RefundReasonModal);
