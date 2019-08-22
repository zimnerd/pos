import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Button, Modal, Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../../redux/actions/modal.action";

import './ReceiptsPaymentModal.scss';

class ReceiptsPaymentModal extends React.Component {

    state = {
        accNum: "",
        type: "",
        method: "Cash",
        card: "",
        cash: "",
        tendered: 0
    };

    continue = () => {
        this.setState({
            account: {
                ...this.state.account,
                balance: this.state.account.balance - this.state.tendered,
                current: this.state.account.current - this.state.tendered,
            }
        }, () => {
            if (this.state.type === "Laybye") {
                this.payLaybyeAccount();
            } else {
                this.payDebtorAccount();
            }

            this.handleClose();
        });
    };

    payDebtorAccount = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        let request = {
            till: this.props.settings.till,
            shop: this.props.settings.shop,
            account: this.state.account,
            tendered: this.state.tendered,
            method: this.state.method,
            type: this.state.type
        };

        axios.post(`/v1/debtors/${this.state.account.no}`, request, {headers})
            .then(response => {
                console.log(response.data);
                toastr.success("Debtor account successfully paid!", "Pay Debtor Account");

                this.printReceipt(response.data.docNo);
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

    payLaybyeAccount = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        let request = {
            till: this.props.settings.till,
            shop: this.props.settings.shop,
            account: this.state.account,
            tendered: this.state.tendered,
            method: this.state.method,
            type: this.state.type
        };

        axios.post(`/v1/laybyes/${this.state.account.no}`, request, {headers})
            .then(response => {
                console.log(response.data);
                toastr.success("Lay-Bye account successfully paid!", "Pay Lay-Bye Account");

                this.printReceipt(response.data.docNo);
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

    printReceipt = docNo => {
        let ip = "192.168.99.100/api";
        if (process.env.REACT_APP_IP_HOST != null) {
            ip = process.env.REACT_APP_IP_HOST;
        }

        let a = document.createElement('a');
        a.href = `http://${ip}/v1/transactions/${docNo}/print/debtor`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    handleClose = () => {
        this.setState({
            accNum: "",
            type: "Laybye",
            method: "",
            card: "",
            cash: "",
            tendered: 0,
            account: undefined
        });
        this.props.actions.closeDebtorReceipts();
    };

    changeMethod = value => {
        this.setState({
            method: value
        }, () => {
            if (this.state.method === "Split") {
                this.setState({
                    tendered: this.state.cash + this.state.card
                });
            } else if (this.state.method === "CC") {
                this.setState({
                    tendered: Number(this.state.account.balance).toFixed(2)
                });
            }
        });
    };

    handleChange = e => {
        if (e.target.name === "type") {
            this.setState({
                account: undefined,
                accounts: undefined,
                [e.target.name]: e.target.value
            }, () => {
                this.findAccounts();
            });
        } else {
            this.setState({
                [e.target.name]: e.target.value
            }, () => {
                if (this.state.method === "Split") {
                    let card = Number(this.state.account.balance).toFixed(2) - this.state.cash;
                    this.setState({
                        cash: this.state.cash,
                        card: card,
                        tendered: Number(Number(this.state.cash) + Number(card)).toFixed(2)
                    });
                }
            });
        }
    };

    findAccounts = () => {
        if (this.state.type === "Laybye") {
            this.findLaybyeAccount();
        } else {
            this.findDebtorAccount();
        }
    };

    findDebtorAccount = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/debtors?stype=${this.state.type}`, {headers})
            .then(response => {
                console.log(response.data);
                toastr.success("Debtor accounts found!", "Find Debtor Accounts");

                let accounts = response.data.debtors.filter(item => item.balance > 0);
                this.setState({
                    accounts: accounts
                });
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("Debtor account could not be found!", "Find Debtor Account");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    findLaybyeAccount = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/laybyes`, {headers})
            .then(response => {
                console.log(response.data);
                toastr.success("Lay-Bye accounts found!", "Find Lay-Bye Accounts");

                let accounts = response.data.laybyes.filter(item => item.balance > 0);
                this.setState({
                    accounts: accounts
                });
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("Lay-Bye accounts could not be found!", "Find Lay-Bye Accounts");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    selectAccount = (account) => {
        this.setState({
            accounts: undefined,
            account: account
        });
    };

    render() {
        return (
            <Modal size="lg" show={this.props.modal.debtorReceipts} onHide={this.handleClose}
                   className="debtor-receipts">
                <Modal.Header closeButton>
                    <Modal.Title>Debtor Receipts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <label>Debtor Type:</label>
                            <select onChange={this.handleChange} className="form-control" name="type">
                                <option disabled selected>Select a type</option>
                                <option value="Laybye">Laybye</option>
                                <option value="Staff">Staff</option>
                                <option value="Credit">Credit</option>
                            </select>
                        </div>
                        {this.state.accounts &&
                        <table className="table table-responsive table-striped">
                            <thead>
                            <tr>
                                <th>Acc Num</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Cell</th>
                                <th>Balance</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.accounts.length === 0 &&
                            <tr>
                                <td colSpan="5" className="text-center">There are no accounts to display!</td>
                            </tr>
                            }
                            {this.state.accounts.map((item, index) => {
                                return (
                                    <tr key={index} onClick={() => this.selectAccount(item)}>
                                        <td>{item.no}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.cell}</td>
                                        <td>{item.balance}</td>
                                    </tr>
                                )
                            })
                            }
                            </tbody>
                        </table>
                        }
                        {this.state.account &&
                        <div>
                            <div className="form-group">
                                <label>Amount Outstanding:</label>
                                <input name="balance" type="text" className="form-control" disabled
                                       value={this.state.account.balance}/>
                            </div>
                            <hr/>
                            <div className="d-flex">
                                <div className="col-6">
                                    <label>Payment Method:</label>
                                    <br/>
                                    <div className="payment" role="group" aria-label="...">
                                        <button type="button" className="btn btn-success m-1"
                                                disabled={this.state.method === "Cash"}
                                                onClick={() => this.changeMethod("Cash")}>
                                            <span><i className="fa fa-money"/></span> Cash
                                        </button>
                                        <button type="button" className="btn btn-danger m-1"
                                                disabled={this.state.method === "CC"}
                                                onClick={() => this.changeMethod("CC")}>
                                            <span><i className="fa fa-credit-card"/></span> Card
                                        </button>
                                        <button type="button" className="btn btn-info m-1"
                                                disabled={this.state.method === "Split"}
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
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Amount Tendered:</label>
                                        <input type="text" className="form-control" value={this.state.tendered}
                                               name="tendered"
                                               disabled={this.state.method === "Split"} onChange={this.handleChange}/>
                                    </div>
                                    {this.state.tendered > this.state.account.balance &&
                                    <label className="value">Change:
                                        <span>{(this.state.tendered - this.state.account.balance).toFixed(2)}</span>
                                    </label>
                                    }
                                    <div className="form-group">
                                        <label>Balance:</label>
                                        <input type="text" className="form-control"
                                               value={(this.state.account.balance - this.state.tendered).toFixed(2)}
                                               disabled/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {this.state.account &&
                    <Button variant="success" onClick={this.continue}>
                        Capture
                    </Button>
                    }
                    <Button variant="danger" onClick={this.handleClose}>
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
        auth: state.auth,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReceiptsPaymentModal));
