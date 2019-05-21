import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Table } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

import * as stockActions from "../../../redux/actions/stock.action";

import Header from "../Header";

import './ProductDetail.scss';

class ProductDetail extends React.Component {

    componentDidMount() {
        const { match: { params } } = this.props;
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/api/products/${params.code}`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");
                this.props.actions.retrieveProduct(response.data.product);
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
                <Header/>
                {this.props.stock.product &&
                <header className="text-center">
                    <h1>{this.props.stock.product.description}</h1>
                </header>
                }
                <main>
                    <Table striped>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Colour</th>
                            <th>Size</th>
                            <th>Quantity on Hand</th>
                            <th>Unit Price</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.stock.product &&
                        this.props.stock.product.info.map(item => {
                            let colour = this.props.stock.product.colours.find(colour => colour.code === item.CLR);
                            let price = this.props.stock.product.prices.find(price => price.sizes === item.SIZES);

                            let markdown = price.mdp > 0;
                            let priceValue = markdown ? price.mdp : price.rp;
                            return (
                                <tr>
                                    <td>{`${item.STYLE} ${item.SIZES} ${item.CLR}`}</td>
                                    <td>{`${colour.colour}`}</td>
                                    <td>{`${item.SIZES}`}</td>
                                    <td>{`${item.QOH}`}</td>
                                    <td>{`${priceValue}`}</td>
                                    <td>{markdown && <span className="badge badge-danger">Markdown</span>}</td>
                                </tr>
                            )
                        })
                        }
                        </tbody>
                    </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
