import React from 'react';
import { connect } from "react-redux";
import { DropdownButton, DropdownItem, Form, FormControl, InputGroup, Table } from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import axios from "axios";
import toastr from "toastr";

import * as stockActions from "../../../redux/actions/stock.action";

import './StockInformation.scss';
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import Header from "../Header";

class StockInformation extends React.Component {

    state = {
        limit: 25,
        search: undefined,
        page: undefined,
        items: [],
        toasted: false
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
            search: this.state.search,
            page: this.state.page
        };

        axios.get("/products", { headers, params })
            .then(response => {
                console.log(response.data);
                if (!this.state.toasted) {
                    toastr.success("Products Retrieved!", "Retrieve Products");
                    this.setState({ toasted: true })
                }

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
        this.setState({ search: event.target.value }, this.retrieveProducts);
    };

    handlePageClick = data => {
        this.setState({ page: data.selected }, this.retrieveProducts);
    };

    render() {
        return (
            <article className="container">
                <Header/>
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
                                                <Link to={'stock/' + item.code} className="btn btn-success">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                        {
                            this.props.stock.page &&
                            <ReactPaginate
                                previousLabel={'previous'}
                                nextLabel={'next'}
                                breakLabel={'...'}
                                pageCount={this.props.stock.page.last_page}
                                // marginPagesDisplayed={2}
                                // pageRangeDisplayed={5}
                                onPageChange={this.handlePageClick}
                                // containerClassName={'pagination'}
                                // subContainerClassName={'pages pagination'}
                                // activeClassName={'active'}
                            />
                        }

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
