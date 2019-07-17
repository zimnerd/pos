import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../../redux/actions/modal.action";

import './ReceiptsPaymentModal.scss';

class ReceiptsPaymentModal extends React.Component {

    state = {
        accNum: "",
        type: "Laybye",
        method: "",
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
            tendered: this.state.tendered
        };

        axios.post(`/debtors/${this.state.accNum}`, request, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Debtor account successfully paid!", "Pay Debtor Account");
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
            tendered: this.state.tendered
        };

        axios.post(`/laybyes/${this.state.accNum}`, request, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Lay-Bye account successfully paid!", "Pay Lay-Bye Account");
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
                    tendered: Number(this.state.account.balance).toFixed(2)
                });
            }
        });
    };

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    findAccount = () => {
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

        axios.get(`/debtors/${this.state.accNum}?stype=${this.state.type}`, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Debtor account found!", "Find Debtor Account");

                this.setState({
                    account: response.data.debtor
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

        axios.get(`/laybyes/${this.state.accNum}?stype=${this.state.type}`, { headers })
            .then(response => {
                console.log(response.data);

                if (response.data.laybye.balance <= 0) {
                    toastr.error("Lay-Bye account balance has already been paid up!", "Find Lay-Bye Account");
                } else {
                    toastr.success("Lay-Bye account found!", "Find Lay-Bye Account");
                    this.setState({
                        account: response.data.laybye
                    });
                }
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("Lay-Bye account could not be found!", "Find Lay-Bye Account");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    render() {
        return (
            <Modal show={this.props.modal.debtorReceipts} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Debtor Receipts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <label>Debtor Type:</label>
                            <select onChange={this.handleChange} className="form-control" name="type">
                                <option value="Laybye">Laybye</option>
                                <option value="Staff">Staff</option>
                                <option value="COD">COD</option>
                                <option value="Credit">Credit</option>
                                <option value="Loan">Loan</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Acc Number:</label>
                            <input name="accNum" type="text" className="form-control"
                                   value={this.state.accNum} onChange={this.handleChange}/>
                            <Button onClick={this.findAccount}><i className="fa fa-search"/></Button>
                        </div>
                        {this.state.account &&
                        <div>
                            <div className="form-group">
                                <label>Amount Outstanding:</label>
                                <input name="balance" type="text" className="form-control" disabled
                                       value={this.state.account.balance}/>
                            </div>
                            <hr/>
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
                            {this.state.tendered > this.state.account.balance &&
                            <label>Change:
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
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {this.state.account &&
                    <Button variant="primary" onClick={this.continue}>
                        Capture
                    </Button>
                    }
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
