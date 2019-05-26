import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as modalActions from "../../../redux/actions/modal.action";
import * as tillActions from "../../../redux/actions/till.action";
import * as stockActions from "../../../redux/actions/stock.action";

import './Till.scss';

import ActionBar from "./ActionBar";
import ReturnsModal from "./modals/ReturnsModal";
import OtherModal from "./modals/OtherModal";
import SalesOptionsModal from "./modals/SalesOptionsModal";
import CompleteSaleModal from "./modals/CompleteSaleModal";
import CreditNoteOptionsModal from "./modals/CreditNoteOptionsModal";
import PaymentOptionsModal from "./modals/PaymentOptionsModal";
import ProductStyleModal from "./modals/ProductStyleModal";
import AuthenticationModal from "./modals/AuthenticationModal";
import Header from "../Header";
import Totals from "./Totals";
import LineItems from "./LineItems";
import TransactionBadges from "./TransactionBadges";
import InformationBar from "./InformationBar";
import CashModal from "./modals/CashModal";
import CardModal from "./modals/CardModal";

class Till extends React.Component {

    componentDidMount = () => {
        document.addEventListener("keydown", this.keydownFunction, false);

        this.props.actions.till.resetTotals();
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.keydownFunction, false);
    };

    keydownFunction = event => {
        this.openModal(event);
    };

    openModal = (event) => {
        switch (event.keyCode) {
            case 112:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openCash();
                break;
            case 113:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openCard();
                break;
            case 114:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openCompleteSale();
                break;
            case 115:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openCredit();
                break;
            case 119:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openPayments();
                break;
            case 120:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openSales();
                break;
            case 122:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openReturns();
                break;
            case 123:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openOthers();
                break;
            default:
                return;
        }
    };

    render() {
        return (
            <article>
                <Header/>
                <main className="d-flex">
                    <InformationBar/>
                    <TransactionBadges/>
                    <LineItems/>
                    <Totals openModal={this.openModal}/>
                </main>
                <footer>
                    <ActionBar openModal={this.openModal}/>
                </footer>

                <CashModal/>
                <CardModal/>

                <AuthenticationModal/>
                <ProductStyleModal/>
                <CompleteSaleModal/>
                <SalesOptionsModal/>
                <CreditNoteOptionsModal/>
                <ReturnsModal/>
                <OtherModal/>
                <PaymentOptionsModal/>
            </article>
        )
    }

}

function mapStateToProps(state) {
    return {
        user: state.user,
        till: state.till,
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            stock: bindActionCreators(stockActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Till);
