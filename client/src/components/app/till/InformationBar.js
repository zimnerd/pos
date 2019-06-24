import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

import * as settingsActions from "../../../redux/actions/settings.action";

import './InformationBar.scss';
import Table from "react-bootstrap/Table";

class InformationBar extends React.Component {

    state = {
        key: 'combos'
    };

    componentDidMount(): void {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/settings/combos`, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("All Combos Found!", "Find All Combos");

                this.props.actions.settings.setCombos(response.data.combos);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    console.log("No combos found");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    }

    render() {
        return (
            <aside className="float-left">
                {this.props.settings.haddith &&
                <main style={{ width: '300px' }}
                      dangerouslySetInnerHTML={{ __html: this.props.settings.haddith.value }}>
                </main>
                }
                <footer>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={this.state.key}
                        onSelect={key => this.setState({ key })}
                    >
                        <Tab eventKey="combos" title="Combos">
                            <Table striped>
                                <thead>
                                <tr>
                                    <th/>
                                    <th>Style</th>
                                    <th>Description</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.settings.combos && this.props.settings.combos.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}.</td>
                                            <td>{item.style}</td>
                                            <td>{item.description}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.rp}</td>
                                        </tr>
                                    )
                                })
                                }
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                </footer>
            </aside>
        )
    }

}

function mapStateToProps(state) {
    return {
        till: state.till,
        auth: state.auth,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            settings: bindActionCreators(settingsActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InformationBar);
