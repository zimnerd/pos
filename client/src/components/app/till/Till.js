import React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";

import * as authActions from "../../../redux/actions/auth.action";

import './Till.scss';
import ActionBar from "./ActionBar";

class Till extends React.Component {

    logout = event => {
        // event.preventDefault();
        this.props.actions.logout();
    };

    render() {
        return (
            <article>
                <header>
                    <Link to="/" onClick={this.logout()} className="btn btn-danger">Sign Out</Link>
                    <button className="btn"><span><i className="fa fa-cog"/></span></button>
                    <button className="btn float-right"><span><i className="fa fa-trash"/></span></button>
                </header>
                <main>
                    <section>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                    <th>Disc. %</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <span>Orange Juice</span>
                                    <small>Medium</small>
                                </td>
                                <td><input type="number" name="quantity" className="form-control" min="1" /></td>
                                <td>10.25</td>
                                <td>10.25</td>
                                <td><input type="number" name="discount" className="form-control" min="0" /></td>
                                <td>10.25</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>Orange Juice</span>
                                    <small>Medium</small>
                                </td>
                                <td><input type="number" name="quantity" className="form-control" /></td>
                                <td>10.25</td>
                                <td>10.25</td>
                                <td><input type="number" name="discount" className="form-control" /></td>
                                <td>10.25</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>Orange Juice</span>
                                    <small>Medium</small>
                                </td>
                                <td><input type="number" name="quantity" className="form-control" /></td>
                                <td>10.25</td>
                                <td>10.25</td>
                                <td><input type="number" name="discount" className="form-control" /></td>
                                <td>10.25</td>
                            </tr>
                            </tbody>
                        </table>
                    </section>
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Till);
