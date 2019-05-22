import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Badge, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../redux/actions/modal.action";
import * as tillActions from "../../../redux/actions/till.action";
import * as stockActions from "../../../redux/actions/stock.action";

import './Till.scss';

import ActionBar from "./ActionBar";
import ReturnsModal from "./modals/ReturnsModal";
import OtherModal from "./modals/OtherModal";
import SalesOptionsModal from "./modals/SalesOptionsModal";
import CompleteSaleModal from "./modals/CompleteSaleModal";
import CreditNoteOptionsModal from "./modals/CreditNoteOptionsModal";
import PaymentOptionsModal from "./modals/PaymentOptionsModal";
import ProductStyleModal from "./modals/ProductStyleModal";
import AuthenticationModal from "./modals/AuthenticationModal";
import Header from "../Header";

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
                const price = product.mdp > 0 ? product.mdp : product.rp;

                let transaction = {
                    code: product.code,
                    description: product.descr,
                    size: product.codeKey,
                    colour: product.colour,
                    price: price,
                    qty: 1,
                    disc: 0
                };

                let items = this.props.till.transactions;
                if (typeof items === "undefined") {
                    items = [];
                }

                items.push(transaction);
                this.props.actions.till.addLineItem(items);
                this.setState({ code: "" })
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

    reset = () => {
        this.setState({
            code: ""
        });
    };

    render() {
        return (
            <article>
                <Header/>
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
                                        <td>{(item.price * item.qty).toFixed(2)}</td>
                                        <td><input type="number" name="discount" className="form-control" min="0"
                                                   value={item.disc}/></td>
                                        <td>{(item.price * item.qty - item.disc).toFixed(2)}</td>
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

                            <button className="btn btn-secondary" onClick={() => this.openModal({ keyCode: 123})}>Other (F12)
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

export default connect(mapStateToProps, mapDispatchToProps)(Till);
