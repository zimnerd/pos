import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";

import * as settingsActions from "../../../redux/actions/settings.action";

import './InformationBar.scss';

import Table from "react-bootstrap/Table";

class InformationBar extends React.Component {

    state = {
        key: 'combos'
    };

    render() {
        return (
            <aside className="col-4 info">
                {this.props.settings.haddith &&
                <main className="bg-dark p-3 widget-shadow"
                      dangerouslySetInnerHTML={{ __html: this.props.settings.haddith.value }}>
                </main>
                }
                {this.props.settings.combos.length > 0 &&
                <footer className="bg-dark p-3 widget-shadow mt-3">
                    {this.props.settings.combos && this.props.settings.combos.length > 0 &&
                    <section>
                        <header>
                            <h3 className="tex">Combos</h3>
                            <hr/>
                        </header>
                        <table className="table table-striped table-responsive">
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
                            {this.props.settings.combos.map((item, index) => {
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
                        </table>
                    </section>
                    }
                </footer>
                }
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
