import React from 'react';

import './Dashboard.scss';
import axios from "axios";
import toastr from "toastr";

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        const headers = {
            'Authorization': 'Bearer '
        };
        axios.get("/api/user/details",{ headers: headers })
            .then(response => {
                console.log(response);
                toastr.success("User Details Retrieved!", "User Details");
                this.setState({ user: response.data.user })
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
                    <h1>Welcome, {this.state.user.name}</h1>
                    <h4>@{this.state.user.username}</h4>
                    <h5 className="text-uppercase">{this.state.user.group}</h5>
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
                            <button className="btn btn-primary">Go now!</button>
                        </main>
                    </section>
                </main>
            </main>
        )
    }

}
