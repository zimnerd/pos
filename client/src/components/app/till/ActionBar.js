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
                        <section className="card card-body m-2" onClick={() => this.props.openModal({ keyCode: 114 })}>
                            <span className="card-text text-center">Complete Sale (F3)</span>
                        </section>
                        <section className="card card-body m-2" onClick={() => this.props.openModal({ keyCode: 115 })}>
                            <span className="card-text text-center">Credit Notes (F4)</span>
                        </section>
                    </section>

                    <section className="col-4 d-flex">
                        <section className="card card-body m-2" onClick={() => this.props.openModal({ keyCode: 120 })}>
                            <span className="card-text text-center">Sales Options (F9)</span>
                        </section>
                        <section className="card card-body m-2" onClick={() => this.props.openModal({ keyCode: 123 })}>
                            <span className="card-text text-center">Other (F12)</span>
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
