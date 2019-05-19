import React from 'react';
import { connect } from "react-redux";
import { Form, FormControl, InputGroup, Table } from "react-bootstrap";

import './StockInformation.scss';

class StockInformation extends React.Component {

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
                                <th>Colour</th>
                                <th>Size</th>
                                <th>Price</th>
                                <th>Qty On Hand</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>FE112 XL 110</td>
                                <td>Orange Juice</td>
                                <td>Green</td>
                                <td>2XL</td>
                                <td>100.22</td>
                                <td>5000</td>
                            </tr>
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
        auth: state.auth
    };
}

export default connect(mapStateToProps)(StockInformation);
