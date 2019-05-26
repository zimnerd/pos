import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as tillActions from "../../../redux/actions/till.action";

import './Totals.scss';

class Totals extends React.Component {

    render() {
        return (
            <aside className="float-right">
                {this.props.till.totals &&
                <main>
                    <label>Subtotal: <span>{(this.props.till.totals.subtotal).toFixed(2)}</span></label>
                    <label>Discount: <span>{(this.props.till.totals.discount).toFixed(2)}</span></label>
                    <label>Tax Total: <span>{(this.props.till.totals.vat).toFixed(2)}</span></label>

                    <h3>{(this.props.till.totals.total).toFixed(2)}</h3>
                </main>
                }
                <footer>
                    <button className="btn btn-primary" onClick={() => this.props.openModal({ keyCode: 112 })}>Cash
                        (F1)
                    </button>
                    <button className="btn btn-primary" onClick={() => this.props.openModal({ keyCode: 113 })}>Credit
                        (F2)
                    </button>

                    <button className="btn btn-secondary" onClick={() => this.props.openModal({ keyCode: 123 })}>Other
                        (F12)
                    </button>
                </footer>
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
        actions: bindActionCreators(tillActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Totals);
