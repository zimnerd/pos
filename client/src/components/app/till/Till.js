import React from 'react';
import { connect } from "react-redux";

import './Till.scss';
import ActionBar from "./ActionBar";

class Till extends React.Component {

    render() {
        return (
            <article>
                <main>
                    <aside className="float-right">
                        <main>
                            <label>Subtotal: <span>15.75</span></label>
                            <label>Discount: <span>15.75</span></label>
                            <label>Tax Total: <span>15.75</span></label>

                            <h3>13.75</h3>
                        </main>
                        <footer>
                            <button className="btn btn-primary">Cash</button>
                            <button className="btn btn-primary">Credit</button>

                            <button className="btn btn-secondary">Other</button>
                        </footer>
                    </aside>
                </main>
                <footer>
                    <ActionBar/>
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

export default connect(mapStateToProps)(Till);
