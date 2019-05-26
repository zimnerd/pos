import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as tillActions from "../../../redux/actions/till.action";
import * as modalActions from "../../../redux/actions/modal.action";
import * as stockActions from "../../../redux/actions/stock.action";

import './LineItems.scss';
import { Badge } from "react-bootstrap";

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
            .then(async response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");

                const product = response.data.product;
                await this.props.createTransaction(product);
                await this.props.mapTransactions(product);
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

    reset = () => {
        this.setState({
            code: ""
        });
    };

    holdItem = (index) => {
        let transactions = this.props.till.transactions;
        let item = transactions[index];
        item.hold = !item.hold;

        this.props.actions.till.setTransactions(transactions);
    };

    removeItem = (index) => {
        let transactions = this.props.till.transactions;
        transactions.splice(index, 1);
        this.props.actions.till.setTransactions(transactions);
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
                        <th colSpan="2"/>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.till.transactions &&
                    this.props.till.transactions.length === 0 &&
                    <tr>
                        <td colSpan="9" className="text-center">No line items added!</td>
                    </tr>
                    }
                    {
                        this.props.till && this.props.till.transactions.map((item, index) =>
                            <tr key={index}>
                                <td>{item.code}</td>
                                <td>
                                    <span>{item.description}</span>
                                    <small>{item.size + ", " + item.colour}</small>
                                    {item.markdown &&
                                    <span className="badge badge-danger">Markdown</span>
                                    }
                                </td>
                                <td><span>{item.qty}</span></td>
                                <td>{item.price}</td>
                                <td>{Number(item.subtotal).toFixed(2)}</td>
                                <td><span>{item.disc}</span></td>
                                <td>{Number(item.total).toFixed(2)}</td>
                                <td>
                                    {!item.hold &&
                                    <span onClick={() => this.holdItem(index)}><i className="fa fa-hand-stop-o"/></span>
                                    }
                                    {item.hold &&
                                    <Badge variant="warning">
                                        Hold
                                        <span onClick={() => this.holdItem(index)}><i className="fa fa-times"/></span>
                                    </Badge>
                                    }
                                </td>
                                <td><span onClick={() => this.removeItem(index)}><i className="fa fa-trash"/></span>
                                </td>
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
