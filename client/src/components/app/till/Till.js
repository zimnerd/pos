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
import { Badge, Tab, Tabs } from "react-bootstrap";
import ProductStyleModal from "./modals/ProductStyleModal";
import AuthenticationModal from "./modals/AuthenticationModal";

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
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openCompleteSale();
                break;
            case 115:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openCredit();
                break;
            case 119:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openPayments();
                break;
            case 120:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openSales();
                break;
            case 122:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openReturns();
                break;
            case 123:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openOthers();
                break;
            default:
                return;
        }
    };

    removeLaybye = () => {
        this.props.actions.till.deactivateLayBye();
    };

    removeReturns = () => {
        this.props.actions.till.deactivateReturns();
    };

    enterProduct = event => {
        event.preventDefault();
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
                <main className="d-flex">
                    <aside className="float-left">
                        <main>
                            <fieldset>
                                <h3>Here</h3>
                                <ol>
                                    <li>One options</li>
                                    <li>One options</li>
                                    <li>One options</li>
                                    <li>One options</li>
                                    <li>One options</li>
                                    <li>One options</li>
                                    <li>One options</li>
                                    <li>One options</li>
                                </ol>
                            </fieldset>
                        </main>
                        <footer>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={this.state.key}
                                onSelect={key => this.setState({ key })}
                            >
                                <Tab eventKey="combos" title="Combos">
                                    <ol>
                                        <li>Orange Juice</li>
                                        <li>Orange Juice</li>
                                        <li>Orange Juice</li>
                                    </ol>
                                </Tab>
                            </Tabs>
                        </footer>
                    </aside>
                    <section>
                        {this.props.till.laybye &&
                        <Badge variant="success">Lay-Bye Purchase <span onClick={this.removeLaybye}><i
                            className="fa fa-times"/></span></Badge>
                        }
                        {this.props.till.returns &&
                        <Badge variant="danger">
                            Return for Customer:
                            <span>{this.props.till.returns.customer.name}</span>
                            <span onClick={this.removeReturns}><i className="fa fa-times"/></span>
                        </Badge>
                        }
                    </section>
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
                                        </td>
                                        <td><input type="number" name="quantity" className="form-control" min="1"
                                                   value={item.qty}/></td>
                                        <td>{item.price}</td>
                                        <td>{item.price * item.qty}</td>
                                        <td><input type="number" name="discount" className="form-control" min="0"
                                                   value={item.disc}/></td>
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

                <AuthenticationModal/>
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
