import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../redux/actions/modal.action";

import './ActionBar.scss';

class ActionBar extends React.Component {

    render() {
        return (
            <article>
                <main className="d-flex">
                    <section className="col-4 d-flex">
                        <section className="card card-body m-2">
                            <span className="card-text text-center">Complete Sale</span>
                        </section>
                        <section className="card card-body m-2" onClick={() => this.props.openModal(115)}>
                            <span className="card-text text-center">Credit Notes (F4)</span>
                        </section>
                    </section>

                    <section className="col-4 d-flex">
                        <section className="card card-body m-2" onClick={() => this.props.openModal(119)}>
                            <span className="card-text text-center">Payment Options (F8)</span>
                        </section>
                        <section className="card card-body m-2" onClick={() => this.props.openModal(120)}>
                            <span className="card-text text-center">Sales Options (F9)</span>
                        </section>
                    </section>

                    <section className="col-4 d-flex">
                        <section className="card card-body m-2">
                            <span className="card-text text-center">Product Enquiry</span>
                        </section>
                        <section className="card card-body m-2" onClick={() => this.props.openModal(122)}>
                            <span className="card-text text-center">Returns (F11)</span>
                        </section>
                    </section>
                </main>
                <footer>
                    <span>Till number 1 logged in as {this.props.user.username}</span>
                </footer>
            </article>
        )
    }

}

function mapStateToProps(state) {
    return {
        user: state.user,
        modal: state.modal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
