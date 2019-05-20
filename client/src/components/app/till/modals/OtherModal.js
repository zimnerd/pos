import React from 'react';
import { Button, Card, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";

import './OtherModal.scss';

class OtherModal extends React.Component {

    handleClose = () => {
        this.props.actions.closeOthers();
    };

    render() {
        return (
            <Modal show={this.props.modal.others} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Other Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Header>
                            <span><i className="fa fa-search"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Product Search</Card.Title>
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

export default connect(mapStateToProps, mapDispatchToProps)(OtherModal);
