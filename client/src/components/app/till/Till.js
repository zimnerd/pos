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
import TransactionId from "./modals/TransactionId";
import RetrieveHeldModal from "./modals/RetrieveHeldModal";
import axios from "axios";
import toastr from "toastr";

class Till extends React.Component {

    state = {
        code: ""
    };

    constructor(props) {
        super(props);
        this.props.actions.till.setTransactions();
    }

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

    mapLineItem = transaction => {
        let totals = this.props.till.totals;

        const discount = transaction.price - transaction.total;
        const vat = transaction.total * 15 / 100;
        const subtotal = transaction.total - vat;

        totals.total += Number(transaction.total);
        totals.discount += discount;
        totals.vat += vat;
        totals.subtotal += subtotal;

        this.props.actions.till.setTotals(totals);
    };

    mapHeldItems = (transaction, totals) => {
        const discount = transaction.price - transaction.total;
        const vat = transaction.total * 15 / 100;
        const subtotal = transaction.total - vat;

        totals.total += Number(transaction.total);
        totals.discount += discount;
        totals.vat += vat;
        totals.subtotal += subtotal;

        return totals;
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
            case 121:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.openStyles(this.props.till.code);
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

    openStyles = code => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/api/products/${code}`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");
                this.props.actions.stock.retrieveProduct(response.data.product);
                this.props.actions.modal.openProductStyles();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("The product code supplied cannot be found.", "Retrieve Product");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    mapTransactions = () => {
        if (typeof this.props.till.transactions === "undefined") {
            return;
        }
        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0
        };
        for (let transaction of this.props.till.transactions) {
            if (this.props.till.staff) {
                transaction.price = transaction.staff;
                transaction.subtotal = transaction.price * transaction.qty;
                transaction.total = transaction.subtotal;
                transaction.discStore = transaction.disc;
                transaction.disc = 0.00;
            } else {
                transaction.price = transaction.retail;
                transaction.subtotal = transaction.price * transaction.qty;

                if (typeof transaction.discStore !== "undefined") {
                    transaction.disc = transaction.discStore;
                    delete transaction.discStore;
                }
                transaction.total = transaction.disc > 0 ? transaction.subtotal * transaction.disc / 100 : transaction.subtotal;
            }

            this.mapHeldItems(transaction, totals);
        }
        this.props.actions.till.setTotals(totals);
        this.props.actions.till.setTransactions(this.props.till.transactions);
    };

    createTransaction = product => {
        const markdown = product.mdp > 0;
        const disc = markdown ? product.mdp / product.rp * 100 : 0;

        let transaction = {
            code: product.code,
            description: product.descr,
            size: product.codeKey,
            colour: product.colour,
            price: Number(product.rp),
            qty: 1,
            disc: disc.toFixed(2),
            markdown: markdown,
            cost: product.sp,
            staff: Number(product.stfp),
            retail: Number(product.rp)
        };

        transaction.subtotal = transaction.price * transaction.qty;
        transaction.total = transaction.disc > 0 ? transaction.subtotal * transaction.disc / 100 : transaction.subtotal;

        let items = this.props.till.transactions;
        if (typeof items === "undefined") {
            items = [];
        }

        items.push(transaction);
        this.mapLineItem(transaction);
        this.props.actions.till.setTransactions(items);
    };

    render() {
        return (
            <article>
                <Header/>
                <main className="d-flex">
                    <InformationBar/>
                    <TransactionBadges mapTransactions={this.mapTransactions} />
                    <LineItems mapLineItem={this.mapLineItem} mapTransactions={this.mapTransactions} openStyles={this.openStyles}
                               createTransaction={this.createTransaction} />
                    <Totals openModal={this.openModal}/>
                </main>
                <footer>
                    <ActionBar openModal={this.openModal}/>
                </footer>

                <CashModal mapLineItem={this.mapHeldItems} />
                <CardModal mapLineItem={this.mapHeldItems} />

                <AuthenticationModal mapTransactions={this.mapTransactions} />
                <ProductStyleModal mapLineItem={this.mapLineItem} mapTransactions={this.mapTransactions} />
                <CompleteSaleModal/>
                <SalesOptionsModal/>
                <CreditNoteOptionsModal/>
                <ReturnsModal/>
                <OtherModal/>
                <PaymentOptionsModal/>
                <TransactionId/>
                <RetrieveHeldModal/>
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
