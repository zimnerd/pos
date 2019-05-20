import React from 'react';
import { Button, Modal, Table } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './ProductStyleModal.scss';

class ProductStyleModal extends React.Component {

    state = {
        products: [{
            code: "FE112 XL C",
            description: "Orange Juice",
            colour: "White",
            size: "Medium",
            price: 119,
            qoh: 10000
        }, {
            code: "FE112 XL M",
            description: "Orange Juice",
            colour: "Blue",
            size: "Large",
            price: 119,
            qoh: 9995
        }]
    };

    handleClose = () => {
        this.props.actions.modal.closeProductStyles();
    };

    selectProduct = (product) => {
        let transaction = {
            code: product.code,
            description: product.description,
            size: product.size,
            colour: product.colour,
            price: product.price,
            qty: 1,
            disc: 0
        };

        let transactions = this.props.till.transactions;
        if (typeof transactions === "undefined") {
            transactions = [];
        }

        transactions.push(transaction);
        this.props.actions.till.addLineItem(transactions);
        this.handleClose();
    };

    render() {
        return (
            <Modal show={this.props.modal.styles} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Product Styles Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped hover>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Colour</th>
                            <th>Size</th>
                            <th>Qty On Hand</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.products.map((item, index) => {
                                return (
                                    <tr onClick={() => this.selectProduct(item)} key={index}>
                                        <td>{item.code}</td>
                                        <td>{item.description}</td>
                                        <td>{item.colour}</td>
                                        <td>{item.size}</td>
                                        <td>{item.qoh}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductStyleModal);
