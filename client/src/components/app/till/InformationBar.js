import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";

import * as tillActions from "../../../redux/actions/till.action";

import './InformationBar.scss';

class InformationBar extends React.Component {

    state = {
        key: ''
    };

    render() {
        return (
            <aside className="float-left">
                <main>
                    <fieldset>
                        <h3>Here</h3>
                        <ol>
                            <li>One options</li>
                            <li>One options</li>
                            <li>One options</li>
                            <li>One options</li>
                            <li>One options</li>
                            <li>One options</li>
                            <li>One options</li>
                            <li>One options</li>
                        </ol>
                    </fieldset>
                </main>
                <footer>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={this.state.key}
                        onSelect={key => this.setState({ key })}
                    >
                        <Tab eventKey="combos" title="Combos">
                            <ol>
                                <li>Orange Juice</li>
                                <li>Orange Juice</li>
                                <li>Orange Juice</li>
                            </ol>
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
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(tillActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InformationBar);
