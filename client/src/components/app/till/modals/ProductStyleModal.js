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
        let transactions = this.props.till.transactions;
        if (typeof transactions === "undefined") {
            transactions = [];
        }

        transactions.push(product);
        this.props.actions.till.setTransactions(transactions);
        this.props.mapLineItem(product);
        this.props.mapTransactions();
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
                        this.props.stock.product.info.map((item, index) => {
                            let colour = this.props.stock.product.colours.find(colour => colour.code === item.CLR);
                            let price = this.props.stock.product.prices.find(price => price.sizes === item.SIZES);

                            if (typeof price === "undefined") {
                                let values = [];
                                let size = item.SIZES;
                                for (let item of this.props.stock.product.items) {
                                    let price = Number(item.sp);

                                    const product = {
                                        description: this.props.stock.product.description,
                                        code: `${item.code} ${item.serialno}`,
                                        colour: colour.colour,
                                        size: size,
                                        qoh: 1.00,
                                        disc: 0.00,
                                        cost: item.cp,
                                        staff: item.sp,
                                        retail: item.sp,
                                        qty: 1
                                    };

                                    product.subtotal = price * product.qty;
                                    product.total = product.disc > 0 ? product.subtotal * product.disc / 100 : product.subtotal;

                                    let value = (
                                        <tr onClick={() => this.selectProduct(product)} key={index}>
                                            <td>{product.code}</td>
                                            <td>{product.colour}</td>
                                            <td>{product.size}</td>
                                            <td>{product.qoh}</td>
                                            <td>{product.total.toFixed(2)}</td>
                                            <td/>
                                        </tr>
                                    );

                                    values.push(value);
                                }

                                return values;
                            }

                            let markdown = price.mdp > 0;
                            const disc = markdown ? price.mdp / price.rp * 100 : 0;

                            const product = {
                                code: `${item.STYLE}`,
                                description: this.props.stock.product.description,
                                size: item.SIZES,
                                colour: colour.colour,
                                price: Number(price.rp),
                                markdown: markdown,
                                qty: 1,
                                disc: disc.toFixed(2),
                                cost: price.sp,
                                staff: price.stfp,
                                retail: price.rp
                            };

                            product.subtotal = product.price * product.qty;
                            product.total = product.disc > 0 ? product.subtotal * product.disc / 100 : product.subtotal;

                            return (
                                <tr onClick={() => this.selectProduct(product)} key={index}>
                                    <td>{product.code}</td>
                                    <td>{product.colour}</td>
                                    <td>{product.size}</td>
                                    <td>{product.qoh}</td>
                                    <td>{product.total.toFixed(2)}</td>
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
