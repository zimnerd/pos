import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";
import $ from "jquery";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as settingsActions from "../../../../redux/actions/settings.action";
import * as authActions from "../../../../redux/actions/auth.action";

import './CompleteSaleModal.scss';

class CompleteSaleModal extends React.Component {

    state = {
        method: "Cash",
        tendered: "0.00",
        cash: "0.00",
        card: "0.00",
        document: undefined,
        email: "",
        cell: "",
        name: "",
        idNo: "",
        line1: "",
        line2: "",
        line3: "",
        disabled: false,
        allowZero: false,
        search: false
    };

    handleClose = () => {
        this.setState({
            method: "Cash",
            tendered: "0.00",
            cash: "0.00",
            card: "0.00",
            email: "",
            cell: "",
            name: "",
            idNo: "",
            line1: "",
            line2: "",
            line3: "",
            document: undefined,
            disabled: false
        });
        this.props.actions.modal.closeCompleteSale();
        this.props.actions.till.setDebtor();
    };

    componentDidUpdate(): void {
        if (this.props.till.debtor && !this.state.cell && !this.state.email && !this.state.name) {
            this.setState({
                cell: this.props.till.debtor.cell,
                email: this.props.till.debtor.email,
                name: this.props.till.debtor.name,
                idNo: this.props.till.debtor.idNo,
                disabled: true
            });
        }
    }

    changeMethod = method => {
        this.setState({
            method: method
        }, () => {
            if (this.state.method === "Split") {
                this.setState({
                    tendered: Number(Number(this.state.cash) + Number(this.state.card)).toFixed(2)
                });
            } else if (this.state.method === "CC") {
                if (this.props.till.laybye && this.props.till.refund) {
                    if (!this.props.till.refundData.depAmt) {
                        this.props.till.refundData.depAmt = 0;
                    }
                    this.setState({
                        tendered: Number(this.props.till.refundData.depAmt).toFixed(2)
                    });
                } else {
                    this.setState({
                        tendered: this.props.till.totals.total.toFixed(2)
                    });
                }
            }
        });
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        }, () => {
            if (this.state.method === "Split") {
                this.setState({
                    tendered: Number(Number(this.state.cash) + Number(this.state.card)).toFixed(2)
                });
            }
        });
    };

    handleText = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    saveRefund = async () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        await axios.post(`/transactions/refunds`, this.props.till.refundData, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Refund saved!", "Save Refund");

                this.props.actions.till.setRefund();
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

    refundTransaction = async () => {
        let method = this.state.method;
        if (method === "Split") {
            method = this.state.cash >= this.state.card ? "Cash" : "CC";
        }

        this.handleClose();
        this.props.actions.till.resetTotals();
        let transactionsToComplete = this.props.till.transactions.filter(item => !item.hold);

        let debtor;
        if (this.props.till.laybye) {
            debtor = {
                no: this.props.till.refundData.invNo
            };
        } else {
            debtor = this.props.till.debtor;
        }

        let transaction = {
            shop: this.props.settings.shop,
            till: this.props.settings.till,
            transactions: transactionsToComplete,
            totals: this.props.till.totals,
            type: this.props.till.laybye ? "LBC" : "CRN",
            method: method,
            stype: this.props.till.debtor ? this.props.till.debtor.stype : "Refund",
            auth: this.props.auth.auth,
            debtor: debtor,
            tendered: this.state.tendered
        };

        let heldSales = this.props.till.transactions.filter(item => item.hold);
        this.mapHeldSales(heldSales);
        this.props.actions.till.setTransactions(heldSales);

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.post(`/transactions`, transaction, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Transaction Refunded!", "Refund Transaction");

                this.printReceipt(response.data.number);
                this.saveSettings(transaction.type);

                this.props.actions.till.setCompletedTransaction({
                    type: transaction.type,
                    number: response.data.number
                });
                this.props.actions.modal.openTransactionComplete();
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

    completeSale = () => {
        if (this.state.tendered > this.props.till.totals.total) {
            this.setState({ tendered: Number(this.props.till.totals.total) }, () => this.complete());
        } else {
            this.setState({ tendered: Number(this.state.tendered) }, () => this.complete());
        }
    };

    complete = async () => {
        if (this.props.till.refund) {
            if (this.props.till.laybye && (this.state.tendered === 0.00 || this.state.tendered === 0)) {
                this.props.actions.modal.openLayByeCreditor();
                this.props.actions.modal.closeCompleteSale();
                return;
            }

            if (this.props.till.refundData.found) {
                this.saveRefund();
                this.refundTransaction();
            } else {
                this.saveRefund();
            }

            this.props.actions.till.deactivateRefund();
            await this.props.actions.till.setRefund();

            this.props.actions.till.deactivateCredit();
            this.props.actions.till.deactivateLayBye();
            this.props.actions.till.deactivateReturns();
            this.props.actions.till.deactivateExchange();
            this.props.actions.till.deactivateStaff();
            this.props.actions.till.setCombos();
            this.props.actions.till.setTransactions();
            this.props.actions.till.resetTotals();
            this.props.actions.auth.setAuth();
            this.handleClose();
            return;
        }

        let method = this.state.method;
        if (method === "Split") {
            method = this.state.cash >= this.state.card ? "Cash" : "CC";
        }

        let held = this.props.till.totals.held;
        let heldNum = this.props.till.totals.heldNum;

        this.props.actions.till.resetTotals();
        let allTransactions = this.props.till.transactions;
        let transactionsToComplete = this.props.till.transactions.filter(item => !item.hold);
        let transaction = {
            person: {
                name: this.state.name,
                cell: this.state.cell,
                email: this.state.email,
                idNo: this.state.idNo,
                line1: this.state.line1,
                line2: this.state.line2,
                line3: this.state.line3
            },
            shop: this.props.settings.shop,
            till: this.props.settings.till,
            transactions: transactionsToComplete,
            totals: this.props.till.totals,
            type: this.props.till.laybye ? "L/B" : "INV",
            stype: this.props.till.laybye ? "Laybye" : this.props.till.debtor ? this.props.till.debtor.stype : method,
            method: method,
            auth: this.props.auth.auth,
            debtor: this.props.till.debtor,
            tendered: this.state.tendered
        };

        let heldSales = this.props.till.transactions.filter(item => item.hold);
        this.mapHeldSales(heldSales);

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.post(`/transactions`, transaction, { headers })
            .then(async response => {
                console.log(response.data);

                if (held) {
                    this.removeSale(heldNum);
                }

                toastr.success("Transaction Completed!", "Create Transaction");
                this.props.actions.till.setTransactions(heldSales);

                this.printReceipt(response.data.number);
                this.printVouchers(transaction.transactions);

                this.saveSettings(transaction.type);
                this.handleClose();

                await this.props.actions.till.setCompletedTransaction({
                    type: transaction.type,
                    number: response.data.number
                });
                this.props.actions.modal.openTransactionComplete();

                this.props.actions.till.setDebtor();
                this.props.actions.till.deactivateCredit();
                this.props.actions.till.deactivateLayBye();
                this.props.actions.till.deactivateReturns();
                this.props.actions.till.deactivateExchange();
                this.props.actions.till.deactivateStaff();
                this.props.actions.till.deactivateRefund();
                this.props.actions.till.setCombos();
                this.props.actions.auth.setAuth();
            })
            .catch(error => {
                console.log(error);
                this.mapHeldSales(allTransactions);
                this.props.actions.till.setTransactions(allTransactions);

                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 500) {
                    toastr.error('Unknown Error');
                } else {
                    toastr.error('The information you have supplied is invalid!', 'Validation');
                    this.props.actions.till.validationError(error.response.data.errors);
                }
            });
    };

    loadSales = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/sales`, { headers })
            .then(response => {
                console.log(response.data);

                let actualSales = [];
                for (let key of Object.keys(response.data.lineItems)) {
                    actualSales.push(response.data.lineItems[key]);
                }

                this.props.actions.till.setSales(actualSales);
                toastr.success("Held transactions retrieved!", "Retrieve Held Transactions");
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    this.props.actions.till.setSales();
                    console.log("No held sales found.")
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    removeSale = saleNum => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.delete(`/sales/${saleNum}`, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Held Sale removed!", "Remove Held Sale");
                this.loadSales();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("Held Sale was not found!", "Remove Held Sale");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    printVouchers = transactions => {
        for (let item of transactions) {
            if (!item.serialno) {
                continue;
            }

            let a = document.createElement('a');
            a.href = `http://localhost:8000/api/airtime/${item.code}/print/${item.serialno}`;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
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
        if (type === "L/B") {
            till.DepNo = Number(till.DepNo) + 1;
            till.LbNo = Number(till.LbNo) + 1;
        } else if (type === "CRN" || type === "LBC") {
            till.CrnNo = Number(till.CrnNo) + 1;
            till.PayNo = Number(till.PayNo) + 1;
        } else {
            till.InvNo = Number(till.InvNo) + 1;
        }

        axios.post(`/settings/till/${this.props.settings.number}`, till)
            .then(response => {
                console.log(response.data);

                toastr.success("Till Details updated!", "Update Settings");

                this.props.actions.settings.saveTill(response.data.till);
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

    findPerson = () => {
        if (this.state.search) {
            const headers = {
                'Authorization': 'Bearer ' + this.props.auth.token
            };

            axios.get(`/people/${this.state.cell}`, { headers })
                .then(response => {
                    console.log(response.data);

                    toastr.success("Person found!", "Find Person");

                    this.setState({
                        cell: response.data.person.cell,
                        email: response.data.person.email,
                        name: response.data.person.name,
                        idNo: response.data.person.idNo,
                        line1: response.data.person.line1,
                        line2: response.data.person.line2,
                        line3: response.data.person.line3
                    });
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401) {
                        toastr.error("You are unauthorized to make this request.", "Unauthorized");
                    } else if (error.response.status === 404) {
                        toastr.error("A person was not found with the specified cell number.", "Find Person");
                    } else {
                        toastr.error("Unknown error.");
                    }
                });
            this.setState({
                search: false
            });
        } else {
            this.setState({
                search: true
            });
        }
    };

    keyDown = e => {
        let event = window.event ? window.event : e;
        if (event.keyCode === 13) { //enter
            e.preventDefault();
            let tenderedField = $('#saleTendered');
            let nameField = $('#saleName');
            let cellField = $('#saleCell');
            let emailField = $('#saleEmail');

            if (tenderedField.is(':focus')) {
                nameField.focus();
                return true;
            }

            if (nameField.is(':focus')) {
                cellField.focus();
                return true;
            }

            if (cellField.is(':focus')) {
                emailField.focus();
                return true;
            }

            tenderedField.focus();
            return true;
        }

        return false;
    };

    render() {
        return (
            <Modal size="lg" show={this.props.modal.complete} onHide={this.handleClose} className="complete-sale">
                <Modal.Header closeButton>
                    {this.props.till.laybye && !this.props.till.refund &&
                    <Modal.Title>Complete Laybye Sale</Modal.Title>
                    }
                    {this.props.till.laybye && this.props.till.refund &&
                    <Modal.Title>Complete Laybye Refund</Modal.Title>
                    }
                    {!this.props.till.laybye && this.props.till.refund &&
                    <Modal.Title>Complete Refund</Modal.Title>
                    }
                    {!this.props.till.laybye && !this.props.till.refund &&
                    <Modal.Title>Complete Sale</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body onKeyDown={this.keyDown}>
                    {this.props.till.transactions &&
                    this.props.till.transactions.length === 0 &&
                    <p className="text-center">There are no transaction line items to pay for!</p>
                    }
                    {this.props.till.transactions &&
                    this.props.till.transactions.length > 0 &&
                    <Form className="d-flex">
                        <div className="col-6">
                            {!this.props.till.laybye &&
                            <label className="value"> Total Invoice
                                Amount: <span>{this.props.till.totals && this.props.till.totals.total.toFixed(2)}</span></label>
                            }
                            {(this.props.till.laybye || this.props.till.credit) && !this.props.till.refund &&
                            <label className="value">Deposit
                                Amount: <span>{Number(this.state.tendered).toFixed(2)}</span></label>
                            }
                            {this.props.till.laybye && this.props.till.refund &&
                            <label className="value"> Total Invoice
                                Amount: <span>{this.props.till.totals && this.props.till.totals.total.toFixed(2)}</span></label>
                            }
                            {this.props.till.laybye && this.props.till.refund && this.props.till.refundData && this.props.till.refundData.depAmt &&
                            <label className="value">Deposit
                                Amount: <span>{this.props.till.refundData.depAmt.toFixed(2)}</span></label>
                            }
                            {(this.props.till.laybye || this.props.till.credit) && !this.props.till.refund &&
                            <label
                                className="value">Balance: <span>{(Number(this.props.till.totals.total) - Number(this.state.tendered)).toFixed(2)}</span></label>
                            }
                            <hr/>
                            <label>Payment Method:</label>
                            <br/>
                            <div className="payment" role="group" aria-label="...">
                                <button type="button" className="btn btn-success m-1" disabled={this.state.method === "Cash"}
                                        onClick={() => this.changeMethod("Cash")}>
                                    <span><i className="fa fa-money"/></span> Cash
                                </button>
                                <button type="button" className="btn btn-danger m-1" disabled={this.state.method === "CC"}
                                        onClick={() => this.changeMethod("CC")}>
                                    <span><i className="fa fa-credit-card"/></span> Card
                                </button>
                                <button type="button" className="btn btn-info m-1" disabled={this.state.method === "Split"}
                                        onClick={() => this.changeMethod("Split")}>
                                    <span><i className="fa fa-random"/></span> Split
                                </button>
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
                            <hr/>
                            <div className="form-group">
                                <label>Amount Tendered:</label>
                                <input type="text" className="form-control" value={this.state.tendered}
                                       autoComplete="false" id="saleTendered"
                                       name="tendered" onFocus={() => this.setState({ tendered: "" })}
                                       disabled={this.state.method === "Split"} onChange={this.handleChange}/>
                            </div>
                            {this.state.tendered > this.props.till.totals.total &&
                            <label className="value">Change:
                                <span>{(this.state.tendered - this.props.till.totals.total).toFixed(2)}</span>
                            </label>
                            }
                            {this.props.till.laybye && !this.props.till.refund &&
                            <Button onClick={this.findPerson}><i className="fa fa-search"/></Button>
                            }
                        </div>
                        <div className="col-6">
                            {!this.props.till.refund && this.state.search &&
                            <Form>
                                <p>Enter a Cell Number to search by: </p>
                                <div className="form-group">
                                    <label>Cell Number:</label>
                                    <input type="text" className="form-control" name="cell" value={this.state.cell}
                                           onChange={this.handleText}/>
                                </div>
                                <Button onClick={this.findPerson}>Search</Button>
                            </Form>
                            }
                            {!this.state.search && !this.props.till.refund &&
                            <div>
                                <div className="d-flex flex-wrap">
                                    <div className="form-group">
                                        <label>Name:</label>
                                        <input type="text" className="form-control" name="name" value={this.state.name}
                                               onChange={this.handleText} disabled={this.state.disabled} id="saleName"/>
                                        {this.props.auth.errors['person.name'] &&
                                        <p className="error">{this.props.auth.errors['person.name'][0]}</p>}
                                    </div>
                                    {this.props.till.laybye &&
                                    <div className="form-group">
                                        <label>ID Number:</label>
                                        <input type="text" className="form-control" name="idNo" value={this.state.idNo}
                                               onChange={this.handleText} disabled={this.state.disabled}/>
                                        {this.props.auth.errors['person.idNo'] &&
                                        <p className="error">{this.props.auth.errors['person.idNo'][0]}</p>}
                                    </div>
                                    }
                                    <div className="form-group">
                                        <label>Cell Number:</label>
                                        <input type="text" className="form-control" name="cell" value={this.state.cell}
                                               onChange={this.handleText} disabled={this.state.disabled} id="saleCell"/>
                                        {this.props.auth.errors['person.cell'] &&
                                        <p className="error">{this.props.auth.errors['person.cell'][0]}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address:</label>
                                        <input type="email" className="form-control" name="email"
                                               value={this.state.email} id="saleEmail"
                                               onChange={this.handleText} disabled={this.state.disabled}/>
                                        {this.props.auth.errors['person.email'] &&
                                        <p className="error">{this.props.auth.errors['person.email'][0]}</p>}
                                    </div>
                                    {this.props.till.laybye &&
                                    <div className="form-group mb-0">
                                        <label>Address:</label>
                                        <div>
                                            <input type="line1" className="form-control mb-1 mr-2" name="line1"
                                                   value={this.state.line1}
                                                   onChange={this.handleText}/>
                                            <input type="line2" className="form-control mb-1 mr-2" name="line2"
                                                   value={this.state.line2}
                                                   onChange={this.handleText}/>
                                            <input type="line3" className="form-control mb-1 mr-2" name="line3"
                                                   value={this.state.line3}
                                                   onChange={this.handleText}/>
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>
                            }
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
                    (this.props.till.laybye || this.props.till.credit || this.state.tendered >= this.props.till.totals.total) &&
                    this.props.till.transactions.length > 0 &&
                    <Button variant="success" onClick={this.completeSale}>
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
            settings: bindActionCreators(settingsActions, dispatch),
            auth: bindActionCreators(authActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteSaleModal);
