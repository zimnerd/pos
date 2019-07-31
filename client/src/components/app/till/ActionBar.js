import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../redux/actions/modal.action";

import './ActionBar.scss';

class ActionBar extends React.Component {

    render = () => {
        return (
            <article>
                <main className="d-flex actions">
                    <section className="col-4 d-flex">
                        <section className="card card-body m-2 bg-success" onClick={() => this.props.openModal({ keyCode: 114 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 114 })}>Complete Sale (F3)</span>
                        </section>
                        <section className="card card-body m-2 bg-danger" onClick={() => this.props.openModal({ keyCode: 115 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 115 })}>Credit Notes (F4)</span>
                        </section>
                    </section>
                    <section className="col-2"/>
                    <section className="col-6 d-flex">
                        <section className="card card-body m-2 bg-secondary" onClick={() => this.props.openModal({ keyCode: 120 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 120 })}>Sales Options (F9)</span>
                        </section>
                        <section className="card card-body m-2 bg-info" onClick={() => this.props.openModal({ keyCode: 121 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 121 })}>Receipts (F10)</span>
                        </section>
                        <section className="card card-body m-2 bg-light" onClick={() => this.props.openModal({ keyCode: 123 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 123 })}>Other (F12)</span>
                        </section>
                    </section>
                </main>
                <footer className="till-text w-100">
                    <span>Till number {this.props.settings.number} logged in as {this.props.user.username}</span>
                </footer>
            </article>
        )
    };

}

function mapStateToProps(state) {
    return {
        user: state.user,
        modal: state.modal,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
