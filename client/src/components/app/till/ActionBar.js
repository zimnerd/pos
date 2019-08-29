import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../redux/actions/modal.action";

import './ActionBar.scss';

class ActionBar extends React.Component {

    render = () => {
        return (
            <article className="col-8">
                <main className="d-flex actions">
                    <section className="col-6 d-flex pl-0">
                        <section className="card card-body m-2 bg-success" onClick={() => this.props.openModal({ keyCode: 114 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 114 })}>Complete Sale (F3)</span>
                        </section>
                        <section className="card card-body m-2 bg-danger" onClick={() => this.props.openModal({ keyCode: 115 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 115 })}>Credit Notes (F4)</span>
                        </section>
                    </section>
                    <section className="col-6 d-flex pr-0">
                        <section className="card card-body m-2 bg-secondary" onClick={() => this.props.openModal({ keyCode: 120 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 120 })}>Sales Options (F9)</span>
                        </section>
                        <section className="card card-body m-2 bg-info" onClick={() => this.props.openModal({ keyCode: 121 })}>
                            <span className="card-text text-center" onClick={() => this.props.openModal({ keyCode: 121 })}>Receipts (F10)</span>
                        </section>
                    </section>
                </main>
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
