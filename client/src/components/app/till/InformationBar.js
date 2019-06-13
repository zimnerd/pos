import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";

import * as tillActions from "../../../redux/actions/till.action";

import './InformationBar.scss';

class InformationBar extends React.Component {

    state = {
        key: 'combos'
    };

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
        auth: state.auth,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(tillActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InformationBar);
