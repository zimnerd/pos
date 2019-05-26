import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as tillActions from "../../../redux/actions/till.action";
import * as modalActions from "../../../redux/actions/modal.action";
import * as stockActions from "../../../redux/actions/stock.action";

import './LineItems.scss';

class LineItems extends React.Component {

    state = {
        code: ""
    };

    enterProduct = event => {
        event.preventDefault();
        let codeParts = this.state.code.split(" ");
        if (codeParts.length === 0 || codeParts.length > 3) {
            this.setState({
                code: "Invalid Product Code"
            });
        } else if (codeParts.length < 3) {
            this.openStyles(codeParts[0]);
        } else if (codeParts.length === 3) {
            this.retrieveProductWithCode(codeParts);
        }
    };

    handleChange = event => {
        this.setState({
            code: event.target.value
        });
    };

    openStyles = code => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/api/products/${code}`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");
                this.props.actions.stock.retrieveProduct(response.data.product);
                this.props.actions.modal.openProductStyles();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("The product code supplied cannot be found.", "Retrieve Product");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    retrieveProductWithCode = codeParts => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/api/products/${codeParts[0]}/${codeParts[1]}/${codeParts[2]}`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");

                const product = response.data.product;
                const markdown = product.mdp > 0;
                const disc = markdown ? product.mdp / product.rp * 100 : 0;

                let transaction = {
                    code: product.code,
                    description: product.descr,
                    size: product.codeKey,
                    colour: product.colour,
                    price: Number(product.rp),
                    qty: 1,
                    disc: disc.toFixed(2),
                    markdown: markdown,
                    cost: product.sp
                };

                transaction.subtotal = transaction.price * transaction.qty;
                transaction.total = transaction.disc > 0 ? transaction.subtotal * transaction.disc / 100 : transaction.subtotal;

                let items = this.props.till.transactions;
                if (typeof items === "undefined") {
                    items = [];
                }

                items.push(transaction);
                this.props.actions.till.addLineItem(items);
                this.mapLineItem(transaction);
                this.setState({ code: "" });
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error(error.response.data.error, "Retrieve Product");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    mapLineItem = transaction => {
        let totals = this.props.till.totals;

        const discount = transaction.price - transaction.total;
        const vat = transaction.total * 15 / 100;
        const subtotal = transaction.total - vat;

        totals.total += Number(transaction.total);
        totals.discount += discount;
        totals.vat += vat;
        totals.subtotal += subtotal;

        this.props.actions.till.setTotals(totals);
    };

    reset = () => {
        this.setState({
            code: ""
        });
    };

    render() {
        return (
            <section>
                <form className="d-flex">
                    <input onChange={this.handleChange} type="text" onFocus={this.reset}
                           placeholder="Enter product code" className="form-control" value={this.state.code}/>
                    <button className="btn btn-primary" onClick={this.enterProduct}>Enter</button>
                </form>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                        <th>Disc. %</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.till.transactions && this.props.till.transactions.map(item =>
                            <tr>
                                <td>{item.code}</td>
                                <td>
                                    <span>{item.description}</span>
                                    <small>{item.size + ", " + item.colour}</small>
                                    {item.markdown &&
                                    <span className="badge badge-danger">Markdown</span>
                                    }
                                </td>
                                <td><input type="number" name="quantity" className="form-control" min="1"
                                           value={item.qty}/></td>
                                <td>{item.price}</td>
                                <td>{item.subtotal.toFixed(2)}</td>
                                <td><input type="number" name="discount" className="form-control" min="0"
                                           value={item.disc}/></td>
                                <td>{item.total.toFixed(2)}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </section>
        )
    }

}

function mapStateToProps(state) {
    return {
        till: state.till,
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

export default connect(mapStateToProps, mapDispatchToProps)(LineItems);
