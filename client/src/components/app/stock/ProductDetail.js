import React from 'react';
import { connect } from "react-redux";

import * as stockActions from "../../../redux/actions/stock.action";

import './ProductDetail.scss';
import { bindActionCreators } from "redux";
import { Collapse } from "react-bootstrap";
import Header from "../Header";

class ProductDetail extends React.Component {

    state = {
        sizes: false,
        colours: false
    };

    render() {
        return (
            <article className="container">
                <Header/>
                <header className="text-center">
                    <h1>Orange Juice</h1>
                </header>
                <main>
                    <dl>
                        <dt>Code</dt>
                        <dd>FE 112</dd>
                        <dt>Quantity On Hand</dt>
                        <dd>5000</dd>
                    </dl>

                    <div className="accordion" id="accordionExample">
                        <div className="card">
                            <div className="card-header" id="sizes">
                                <h2 className="mb-0">
                                    <button className="btn btn-link" type="button" data-toggle="collapse"
                                            onClick={() => this.setState({ sizes: !this.state.sizes })}
                                            data-target="#sizes" aria-expanded="true" aria-controls="sizes">
                                        Sizes
                                    </button>
                                </h2>
                            </div>

                            <Collapse in={this.state.sizes}>
                                <div id="sizes">
                                    XL 2145
                                    XL 2145
                                    XL 2145
                                    XL 2145
                                </div>
                            </Collapse>
                        </div>

                        <div className="card">
                            <div className="card-header" id="colours">
                                <h2 className="mb-0">
                                    <button className="btn btn-link" type="button" data-toggle="collapse"
                                            onClick={() => this.setState({ colours: !this.state.colours })}
                                            data-target="#colours" aria-expanded="true" aria-controls="colours">
                                        Colours
                                    </button>
                                </h2>
                            </div>

                            <Collapse in={this.state.colours}>
                                <div id="colours">
                                    XL 2145
                                    XL 2145
                                    XL 2145
                                    XL 2145
                                </div>
                            </Collapse>
                        </div>
                    </div>
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
