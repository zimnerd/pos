import React from 'react';
import { connect } from "react-redux";
import { Form, FormControl, InputGroup, Table } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

import * as stockActions from "../../../redux/actions/stock.action";

import './StockInformation.scss';
import { bindActionCreators } from "redux";

class StockInformation extends React.Component {

    componentDidMount() {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };
        axios.get("/api/products", { headers: headers })
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
    }

    render() {
        return (
            <article className="container">
                <header className="text-center">
                    <h1>Stock Information</h1>
                </header>
                <main>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="search-addon"><span><i className="fa fa-search"/></span></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Search for a product"
                                aria-describedby="search-addon"
                            />
                        </InputGroup>
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
                                this.props.stock.products && this.props.stock.products.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.code}</td>
                                            <td>{item.description}</td>
                                            <td><button className="btn btn-success">View</button></td>
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
