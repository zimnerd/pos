import React from 'react';
import { connect } from "react-redux";

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
                        <section className="card card-body m-2">
                            <span className="card-text text-center">Returns</span>
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
        user: state.user
    };
}

export default connect(mapStateToProps)(ActionBar);
