import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";

import './CompleteSaleModal.scss';

class CompleteSaleModal extends React.Component {

    handleClose = () => {
        this.props.actions.closeCompleteSale();
    };

    render() {
        return (
            <Modal show={this.props.modal.complete} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Complete Sale</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.till.transactions &&
                        this.props.till.transactions.length === 0 &&
                        <p>There are no transaction line items to pay for!</p>
                    }
                    {this.props.till.transactions &&
                        this.props.till.transactions.length > 0 &&
                        <Form>
                            <label>Total Invoice Amount: <span>1000.00</span></label>
                            <div className="form-group">
                                <label>Payment Method:</label>
                                <span>Cash</span>
                                <input type="radio" className="form-control" value="Cash" name="payment"/>
                                <span>Card</span>
                                <input type="radio" className="form-control" value="Card" name="payment"/>
                                <span>Split Payment</span>
                                <input type="radio" className="form-control" value="Split Payment" name="payment"/>
                            </div>
                            <div className="form-group">
                                <label>Amount Tendered:</label>
                                <input type="number" className="form-control" min="0"/>
                            </div>
                            <label>Change: <span>0.00</span></label>
                            <div className="form-group">
                                <label>Name:</label>
                                <input type="text" className="form-control" name="name"/>
                            </div>
                            <div className="form-group">
                                <label>Cell Number:</label>
                                <input type="text" className="form-control" name="cell"/>
                            </div>
                            <div className="form-group">
                                <label>Email Address:</label>
                                <input type="email" className="form-control" name="email"/>
                            </div>
                        </Form>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Close
                    </Button>
                    {this.props.till.transactions &&
                        this.props.till.transactions.length > 0 &&
                        <Button variant="primary" onClick={this.handleClose}>
                            Update & Print
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        )
    }

}

function mapStateToProps(state) {
    return {
        modal: state.modal,
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteSaleModal);
