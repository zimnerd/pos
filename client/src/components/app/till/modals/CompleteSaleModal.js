import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as settingsActions from "../../../../redux/actions/settings.action";

import './CompleteSaleModal.scss';

class CompleteSaleModal extends React.Component {

    state = {
        method: "",
        tendered: 0.00,
        cash: 0.00,
        card: 0.00,
        document: undefined
    };

    handleClose = () => {
        this.setState({
            method: "",
            tendered: 0.00,
            cash: 0.00,
            card: 0.00,
            document: undefined
        });
        this.props.actions.modal.closeCompleteSale();
    };

    changeMethod = event => {
        this.setState({
            method: event.target.value
        }, () => {
            if (this.state.method === "Split") {
                this.setState({
                    tendered: this.state.cash + this.state.card
                });
            } else if (this.state.method === "CC") {
                this.setState({
                    tendered: this.props.till.totals.total.toFixed(2)
                });
            }
        });
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: Number(event.target.value)
        }, () => {
            if (this.state.method === "Split") {
                let card = this.props.till.totals.total.toFixed(2) - this.state.cash;
                this.setState({
                    cash: this.state.cash,
                    card: card,
                    tendered: this.state.cash + card
                })
            }
        });
    };

    handleText = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    completeSale = () => {
        let method = this.state.method;
        if (method === "Split") {
            method = this.state.cash >= this.state.card ? "Cash" : "CC";
        }

        this.props.actions.till.resetTotals();
        let allTransactions = this.props.till.transactions;
        let transactionsToComplete = this.props.till.transactions.filter(item => !item.hold);
        let transaction = {
            person: {
                name: this.state.name,
                cell: this.state.cell,
                email: this.state.email
            },
            shop: this.props.settings.shop,
            till: this.props.settings.till,
            transactions: transactionsToComplete,
            totals: this.props.till.totals,
            type: this.props.till.laybye ? "L/B" : "INV",
            stype: this.props.till.laybye ? "Lay-Bye" : method,
            method: method,
            auth: ""
        };

        let heldSales = this.props.till.transactions.filter(item => item.hold);
        this.mapHeldSales(heldSales);

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.post(`/transactions`, transaction, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Transaction Completed!", "Create Transaction");
                this.props.actions.till.setTransactions(heldSales);

                this.printReceipt(response.data.number);

                this.saveSettings(transaction.type);
                this.handleClose();

                this.props.actions.till.deactivateLayBye();
                this.props.actions.till.deactivateReturns();
                this.props.actions.till.deactivateExchange();
                this.props.actions.till.deactivateStaff();
                this.props.actions.till.deactivateRefund();
                this.props.actions.till.setCombos();
            })
            .catch(error => {
                console.log(error);
                this.mapHeldSales(allTransactions);
                this.props.actions.till.setTransactions(allTransactions);

                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error('The information you have supplied is invalid!', 'Validation');
                    this.props.actions.till.validationError(error.response.data.errors);
                }
            });
    };

    printReceipt = number => {
        let a = document.createElement('a');
        a.href = `http://localhost:8000/api/transactions/${number}/print`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    mapHeldSales = sales => {
        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0,
            items: 0
        };
        for (let x = 0, len = sales.length; x < len; x++) {
            let sale = sales[x];
            totals = this.props.mapLineItem(sale, totals);
            totals.items++;
        }
        this.props.actions.till.setTotals(totals);
    };

    saveSettings = (type) => {
        let till = this.props.settings.till;
        till.DepNo = Number(till.DepNo) + 1;
        if (type === "L/B") {
            till.LbNo = Number(till.LbNo) + 1;
        } else {
            till.InvNo = Number(till.InvNo) + 1;
        }

        axios.post(`/settings/till/1`, till)
            .then(response => {
                console.log(response.data);

                toastr.success("Till Details updated!", "Update Settings");

                this.props.actions.settings.saveTill(response.data.till);
                this.handleClose();
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
            <Modal show={this.props.modal.complete} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Complete Sale</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.till.transactions &&
                    this.props.till.transactions.length === 0 &&
                    <p>There are no transaction line items to pay for!</p>
                    }
                    {this.props.till.transactions &&
                    this.props.till.transactions.length > 0 &&
                    <Form>
                        <label>Total Invoice
                            Amount: <span>{this.props.till.totals && this.props.till.totals.total.toFixed(2)}</span></label>
                        <div className="form-group">
                            <label>Payment Method:</label>
                            <span>Cash</span>
                            <input type="radio" className="form-control" value="Cash" onChange={this.changeMethod}
                                   name="method"/>
                            <span>Card</span>
                            <input type="radio" className="form-control" value="CC" onChange={this.changeMethod}
                                   name="method"/>
                            <span>Split Payment</span>
                            <input type="radio" className="form-control" value="Split" onChange={this.changeMethod}
                                   name="method"/>
                        </div>
                        {
                            this.state.method === "Split" &&
                            <div className="form-group">
                                <label>Cash Amount:</label>
                                <input type="text" className="form-control" name="cash"
                                       value={this.state.cash}
                                       onChange={this.handleChange}/>
                                <label>Card Amount:</label>
                                <input type="text" className="form-control" name="card"
                                       value={this.state.card}
                                       onChange={this.handleChange}/>
                            </div>
                        }
                        <div className="form-group">
                            <label>Amount Tendered:</label>
                            <input type="text" className="form-control" value={this.state.tendered}
                                   name="tendered"
                                   disabled={this.state.method === "Split"} onChange={this.handleChange}/>
                        </div>
                        {this.state.tendered > this.props.till.totals.total &&
                        <label>Change:
                            <span>{(this.state.tendered - this.props.till.totals.total).toFixed(2)}</span>
                        </label>
                        }
                        <div className="form-group">
                            <label>Name:</label>
                            <input type="text" className="form-control" name="name" value={this.state.name}
                                   onChange={this.handleText}/>
                        </div>
                        <div className="form-group">
                            <label>Cell Number:</label>
                            <input type="text" className="form-control" name="cell" value={this.state.cell}
                                   onChange={this.handleText}/>
                            {this.props.auth.errors['person.cell'] && <p>{this.props.auth.errors['person.cell'][0]}</p>}
                        </div>
                        <div className="form-group">
                            <label>Email Address:</label>
                            <input type="email" className="form-control" name="email" value={this.state.email}
                                   onChange={this.handleText}/>
                            {this.props.auth.errors['person.email'] &&
                            <p>{this.props.auth.errors['person.email'][0]}</p>}
                        </div>
                    </Form>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Close
                    </Button>
                    {this.props.till.transactions &&
                    this.props.till.totals &&
                    this.state.tendered >= this.props.till.totals.total &&
                    this.props.till.transactions.length > 0 &&
                    <Button variant="primary" onClick={this.completeSale}>
                        Update & Print
                    </Button>
                    }
                </Modal.Footer>
            </Modal>
        )
    }

}

function mapStateToProps(state) {
    return {
        modal: state.modal,
        till: state.till,
        settings: state.settings,
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            settings: bindActionCreators(settingsActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteSaleModal);
