import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as tillActions from "../../../redux/actions/till.action";
import * as modalActions from "../../../redux/actions/modal.action";

import './Totals.scss';

class Totals extends React.Component {

    completeRefund = () => {
        this.props.actions.modal.openCompleteRefund();
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
                <footer>
                    <button className="btn btn-primary" onClick={() => this.props.openModal({ keyCode: 112 })}>Cash
                        (F1)
                    </button>
                    <button className="btn btn-primary" onClick={() => this.props.openModal({ keyCode: 113 })}>Card
                        (F2)
                    </button>

                    <button className="btn btn-secondary" onClick={() => this.props.openModal({ keyCode: 123 })}>Other
                        (F12)
                    </button>
                </footer>
                }
                {this.props.till.refund &&
                <footer>
                    <button className="btn btn-secondary" onClick={this.completeRefund}>
                        Complete Refund
                    </button>
                </footer>
                }
            </aside>
        )
    }

}

function mapStateToProps(state) {
    return {
        till: state.till
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
