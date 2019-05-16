import React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import axios from "axios";
import toastr from "toastr";

import * as userActions from "../../redux/actions/user.action";

import './Dashboard.scss';

class Dashboard extends React.Component {

    componentDidMount() {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };
        axios.get("/api/user/details", { headers: headers })
            .then(response => {
                console.log(response);
                toastr.success("User Details Retrieved!", "User Details");

                this.props.actions.retrieveDetails(response.data.user);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    }

    render() {
        return (
            <main className="container">
                <header className="text-center">
                    <h1>Welcome, {this.props.user.name}</h1>
                    <h4>@{this.props.user.username}</h4>
                    <h5 className="text-uppercase">{this.props.user.group}</h5>
                </header>
                <main className="d-flex">
                    <section className="col-6 card">
                        <header className="card-img-top">
                            <span><i className="fa fa-address-book"/></span>
                        </header>
                        <main className="card-body">
                            <h5 className="card-title">Stock Management</h5>
                            <p className="card-text">Manage the stock that is available within the shop!</p>
                            <button className="btn btn-primary">Go now!</button>
                        </main>
                    </section>
                    <section className="col-6 card">
                        <header className="card-img-top">
                            <span><i className="fa fa-address-book"/></span>
                        </header>
                        <main className="card-body">
                            <h5 className="card-title">Record Transactions</h5>
                            <p className="card-text">Record transactions for a customer!</p>
                            <Link to="/app/till" className="btn btn-primary">Go now!</Link>
                        </main>
                    </section>
                </main>
            </main>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
