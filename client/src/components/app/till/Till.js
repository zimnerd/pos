import React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";

import * as authActions from "../../../redux/actions/auth.action";
import * as modalActions from "../../../redux/actions/modal.action";
import * as tillActions from "../../../redux/actions/till.action";

import './Till.scss';
import ActionBar from "./ActionBar";
import ReturnsModal from "./modals/ReturnsModal";
import OtherModal from "./modals/OtherModal";
import SalesOptionsModal from "./modals/SalesOptionsModal";
import CompleteSaleModal from "./modals/CompleteSaleModal";
import CreditNoteOptionsModal from "./modals/CreditNoteOptionsModal";
import PaymentOptionsModal from "./modals/PaymentOptionsModal";
import { Badge } from "react-bootstrap";
import ProductStyleModal from "./modals/ProductStyleModal";

class Till extends React.Component {

    state = {
        code: ""
    };

    componentDidMount = () => {
        document.addEventListener("keydown", this.keydownFunction, false);
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.keydownFunction, false);
    };

    keydownFunction = event => {
        this.openModal(event);
    };

    openModal = (event) => {
        switch (event.keyCode) {
            case 114:
                event.preventDefault();
                this.props.actions.modal.openCompleteSale();
                break;
            case 115:
                event.preventDefault();
                this.props.actions.modal.openCredit();
                break;
            case 119:
                event.preventDefault();
                this.props.actions.modal.openPayments();
                break;
            case 120:
                event.preventDefault();
                this.props.actions.modal.openSales();
                break;
            case 122:
                event.preventDefault();
                this.props.actions.modal.openReturns();
                break;
            case 123:
                event.preventDefault();
                this.props.actions.modal.openOthers();
                break;
            default:
                return;
        }
    };

    removeLaybye = () => {
        this.props.actions.till.deactivateLayBye();
    };

    enterProduct = () => {
        switch (this.state.code) {
            case "FE112 XL 110":
                let transaction = {
                    code: "FE112 XL 110",
                    description: "Orange Juice",
                    size: "Extra Large",
                    colour: "White",
                    price: 119,
                    qty: 1,
                    disc: 0
                };
                let items = this.props.till.transactions;
                if (typeof items === "undefined") {
                    items = [];
                }

                items.push(transaction);
                this.props.actions.till.addLineItem(items);
                break;
            case "FE112":
                this.props.actions.modal.openProductStyles();
                break;
            default:
                this.setState({
                    code: "Invalid Product Code"
                });
        }
    };

    handleChange = event => {
        this.setState({
            code: event.target.value
        });
    };

    reset = () => {
        this.setState({
            code: ""
        });
    };

    logout = () => {
        this.props.actions.auth.logout();
    };

    render() {
        return (
            <article>
                <header>
                    <Link to="/" onClick={this.logout()} className="btn btn-danger">Sign Out</Link>
                    <button className="btn"><span><i className="fa fa-cog"/></span></button>
                    <button className="btn float-right"><span><i className="fa fa-trash"/></span></button>
                </header>
                <main>
                    <section>
                        {this.props.till.laybye &&
                            <Badge variant="success">Lay-Bye Purchase <span onClick={this.removeLaybye}><i className="fa fa-times"/></span></Badge>
                        }
                    </section>
                    <section>
                        <header className="d-flex">
                            <input onChange={this.handleChange} type="text" onFocus={this.reset}
                                   placeholder="Enter product code" className="form-control" value={this.state.code}/>
                            <button className="btn btn-primary" onClick={this.enterProduct}>Enter</button>
                        </header>
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
                                        </td>
                                        <td><input type="number" name="quantity" className="form-control" min="1" value={item.qty}/></td>
                                        <td>{item.price}</td>
                                        <td>{item.price * item.qty}</td>
                                        <td><input type="number" name="discount" className="form-control" min="0" value={item.disc}/></td>
                                        <td>{item.price * item.qty - item.disc}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </section>
                    <aside className="float-right">
                        <main>
                            <label>Subtotal: <span>15.75</span></label>
                            <label>Discount: <span>15.75</span></label>
                            <label>Tax Total: <span>15.75</span></label>

                            <h3>13.75</h3>
                        </main>
                        <footer>
                            <button className="btn btn-primary">Cash</button>
                            <button className="btn btn-primary">Credit</button>

                            <button className="btn btn-secondary" onClick={() => this.openModal(123)}>Other (F12)
                            </button>
                        </footer>
                    </aside>
                </main>
                <footer>
                    <ActionBar openModal={this.openModal}/>
                </footer>

                <ProductStyleModal/>
                <CompleteSaleModal/>
                <SalesOptionsModal/>
                <CreditNoteOptionsModal/>
                <ReturnsModal/>
                <OtherModal/>
                <PaymentOptionsModal/>
            </article>
        )
    }

}

function mapStateToProps(state) {
    return {
        user: state.user,
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            auth: bindActionCreators(authActions, dispatch),
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Till);
