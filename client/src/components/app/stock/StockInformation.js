import React from 'react';
import { connect } from "react-redux";
import { DropdownButton, DropdownItem, Form, FormControl, InputGroup, Table } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

import * as stockActions from "../../../redux/actions/stock.action";

import './StockInformation.scss';
import { bindActionCreators } from "redux";

class StockInformation extends React.Component {

    state = {
        limit: 25,
        search: undefined
    };

    componentDidMount() {
        this.retrieveProducts();
    }

    retrieveProducts = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        const params = {
            limit: this.state.limit,
            search: this.state.search
        };
        axios.get("/api/products", { headers, params })
            .then(response => {
                console.log(response.data);
                toastr.success("Products Retrieved!", "Retrieve Products");

                this.props.actions.retrieveProducts(response.data.products);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    setLimit = (limit) => {
        this.setState({ limit: limit }, this.retrieveProducts);
    };

    handleChange = event => {
        this.setState({ search: event.target.value });
    };

    render() {
        return (
            <article className="container">
                <header className="text-center">
                    <h1>Stock Information</h1>
                </header>
                <main>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend onClick={this.retrieveProducts}>
                                <InputGroup.Text id="search-addon"><span><i
                                    className="fa fa-search"/></span></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Search for a product"
                                aria-describedby="search-addon"
                                value={this.state.search}
                                onChange={this.handleChange}
                            />
                        </InputGroup>
                        <DropdownButton id="limit" title={this.state.limit} className="mb-3">
                            <DropdownItem onClick={() => this.setLimit(10)}>10</DropdownItem>
                            <DropdownItem onClick={() => this.setLimit(25)}>25</DropdownItem>
                            <DropdownItem onClick={() => this.setLimit(50)}>50</DropdownItem>
                        </DropdownButton>
                        <Table striped hover>
                            <thead>
                            <tr>
                                <th>Code</th>
                                <th>Description</th>
                                <th/>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.stock.page && this.props.stock.page.data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.code}</td>
                                            <td>{item.descr}</td>
                                            <td>
                                                <button className="btn btn-success">View</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </Form>
                </main>
            </article>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        stock: state.stock
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(stockActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StockInformation);
