import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './RetrieveHeldModal.scss';

class RetrieveHeldModal extends React.Component {

    state = {
        number: ""
    };

    handleChange = event => {
        this.setState({
            number: event.target.value
        });
    };

    handleClose = () => {
        this.props.actions.modal.closeRetrieveHeld();
    };

    retrieve = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/transactions/hold/${this.state.number}`, { headers })
            .then(response => {
                console.log(response.data);
                this.props.actions.till.setTransactions(response.data.lineItems.transactions);
                this.handleClose();

                toastr.success("Held transactions retrieved!", "Retrieve Held Transaction");
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
            <Modal show={this.props.modal.retrieveHeld} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Retrieve Held Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <label>Transaction Number:</label>
                            <input type="text" className="form-control" onChange={this.handleChange}
                                   value={this.state.number}/>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.retrieve}>
                        Retrieve
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

export default connect(mapStateToProps, mapDispatchToProps)(RetrieveHeldModal);
