import React from 'react';
import { Button, Modal, Table } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as stockActions from "../../../../redux/actions/stock.action";

import './ProductStyleModal.scss';

class ProductStyleModal extends React.Component {

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
            <Modal show={this.props.modal.styles} onHide={this.handleClose}
                   size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Product Styles Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped hover>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Colour</th>
                            <th>Size</th>
                            <th>Quantity on Hand</th>
                            <th>Unit Price</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.stock.product &&
                        this.props.stock.product.info.map((item) => {
                            let colour = this.props.stock.product.colours.find(colour => colour.code === item.CLR);
                            let price = this.props.stock.product.prices.find(price => price.sizes === item.SIZES);

                            let markdown = price.mdp > 0;
                            let priceValue = markdown ? price.mdp : price.rp;

                            const product = {
                                code: `${item.STYLE} ${item.SIZES} ${item.CLR}`,
                                description: this.props.stock.product.desc,
                                size: item.SIZES,
                                colour: colour.colour,
                                price: priceValue
                            };

                            return (
                                <tr onClick={() => this.selectProduct(product)}>
                                    <td>{product.code}</td>
                                    <td>{product.colour}</td>
                                    <td>{product.size}</td>
                                    <td>{product.qoh}</td>
                                    <td>{product.price}</td>
                                    <td>{markdown && <span className="badge badge-danger">Markdown</span>}</td>
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
        till: state.till,
        stock: state.stock,
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            stock: bindActionCreators(stockActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductStyleModal);
