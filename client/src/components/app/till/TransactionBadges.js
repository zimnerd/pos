import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Badge } from "react-bootstrap";

import * as tillActions from "../../../redux/actions/till.action";

import './TransactionBadges.scss';

class TransactionBadges extends React.Component {

    removeLaybye = () => {
        this.props.actions.deactivateLayBye();
    };

    removeReturns = () => {
        this.props.actions.deactivateReturns();
    };

    render() {
        return (
            <section>
                {this.props.till.laybye &&
                <Badge variant="success">Lay-Bye Purchase <span onClick={this.removeLaybye}><i
                    className="fa fa-times"/></span></Badge>
                }
                {this.props.till.returns &&
                <Badge variant="danger">
                    Return for Customer:
                    <span>{this.props.till.returns.customer.name}</span>
                    <span onClick={this.removeReturns}><i className="fa fa-times"/></span>
                </Badge>
                }
            </section>
        )
    }

}

function mapStateToProps(state) {
    return {
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(tillActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionBadges);
