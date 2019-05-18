import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../redux/actions/modal.action";

import './ActionBar.scss';

class ActionBar extends React.Component {

    componentDidMount = () => {
        document.addEventListener("keydown", this.keydownFunction, false);
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.keydownFunction, false);
    };

    keydownFunction = event => {
        event.preventDefault();
        if (event.keyCode === 122) {
            this.openModal();
        }
    };

    openModal = () => {
        this.props.actions.openReturns();
    };

    render() {
        return (
            <article>
                <main className="d-flex">
                    <section className="col-4 d-flex">
                        <section className="card card-body m-2">
                            <span className="card-text text-center">Complete Sale</span>
                        </section>
                        <section className="card card-body m-2">
                            <span className="card-text text-center">Credit Notes</span>
                        </section>
                    </section>

                    <section className="col-4 d-flex">
                        <section className="card card-body m-2">
                            <span className="card-text text-center">Payment Options</span>
                        </section>
                        <section className="card card-body m-2">
                            <span className="card-text text-center">Sales Options</span>
                        </section>
                    </section>

                    <section className="col-4 d-flex">
                        <section className="card card-body m-2">
                            <span className="card-text text-center">Product Enquiry</span>
                        </section>
                        <section className="card card-body m-2" onClick={this.openModal}>
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
