import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../redux/actions/modal.action";

import './Alerts.scss';

class Alerts extends React.Component {

    render = () => {
        return (
            <section className="col-4 alerts widget-shadow">
                <header>
                    <h3 className="tex">Warehouse Alerts</h3>
                    <hr/>
                </header>
                <main>
                    <h3 className="text-center">Coming Soon!</h3>
                </main>
            </section>
        )
    };

}

function mapStateToProps(state) {
    return {
        user: state.user,
        modal: state.modal,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
