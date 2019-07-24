import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as tillActions from "../../../redux/actions/till.action";
import * as modalActions from "../../../redux/actions/modal.action";

import './Totals.scss';
import axios from "axios";
import toastr from "toastr";

class Totals extends React.Component {

    completeRefund = () => {
        this.props.actions.modal.openReasonModal();

        if (this.props.till.laybye) {
            const headers = {
                'Authorization': 'Bearer ' + this.props.auth.token
            };

            axios.get(`/laybyes/${this.props.till.refundData.invNo}/transactions`, { headers })
                .then(response => {
                    console.log(response.data);
                    toastr.success("Refund amount found!", "Find Refund Amount");

                    let total = 0;
                    for (let item of response.data.transactions) {
                        total += Number(item.invAmt);
                    }

                    this.props.till.refundData.depAmt = total;
                    this.props.actions.till.setRefund(this.props.till.refundData);
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401) {
                        toastr.error("You are unauthorized to make this request.", "Unauthorized");
                    } else if (error.response.status === 404) {
                        toastr.error("Refund amount not found!", "Find Refund Amount");
                    } else {
                        toastr.error("Unknown error.");
                    }
                });
        }
    };

    completeExchange = () => {
        this.props.actions.modal.openCompleteExchange();
    };

    completeCredit = () => {
        this.props.actions.modal.openDebtorModal();
    };

    render() {
        return (
            <aside className="float-right">
                {this.props.till.totals &&
                <main>
                    <label>Items: <span>{this.props.till.totals.items}</span></label>
                    <label>Subtotal: <span>{(this.props.till.totals.subtotal).toFixed(2)}</span></label>
                    <label>Discount: <span>{(this.props.till.totals.discount).toFixed(2)}</span></label>
                    <label>Tax Total: <span>{(this.props.till.totals.vat).toFixed(2)}</span></label>

                    <h3>{(this.props.till.totals.total).toFixed(2)}</h3>
                </main>
                }
                {!this.props.till.refund &&
                !this.props.till.exchange &&
                !this.props.till.credit &&
                <footer>
                    <button className="btn btn-primary" onClick={() => this.props.openModal({ keyCode: 114 })}>Cash/Card
                        (F3)
                    </button>
                </footer>
                }
                {!this.props.till.exchange &&
                !this.props.till.credit &&
                this.props.till.refund &&
                <footer>
                    <button className="btn btn-secondary" onClick={this.completeRefund}>
                        Complete Refund
                    </button>
                </footer>
                }
                {!this.props.till.refund &&
                !this.props.till.credit &&
                this.props.till.exchange &&
                <footer>
                    <button className="btn btn-secondary" onClick={this.completeExchange}>
                        Complete Exchange
                    </button>
                </footer>
                }
                {!this.props.till.refund &&
                !this.props.till.exchange &&
                this.props.till.credit &&
                <footer>
                    <button className="btn btn-secondary" onClick={this.completeCredit}>
                        Complete Credit Sale
                    </button>
                </footer>
                }
            </aside>
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
            till: bindActionCreators(tillActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Totals);
