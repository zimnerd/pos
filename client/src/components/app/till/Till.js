import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../redux/actions/modal.action";
import * as tillActions from "../../../redux/actions/till.action";
import * as stockActions from "../../../redux/actions/stock.action";
import * as settingsActions from "../../../redux/actions/settings.action";

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
import ComboModal from "./modals/ComboModal";
import RefundModal from "./modals/RefundModal";
import RefundDetailsModal from "./modals/RefundDetailsModal";
import CompleteRefund from "./modals/CompleteRefund";
import CompleteExchange from "./modals/CompleteExchange";
import TransactionCompleteModal from "./modals/TransactionCompleteModal";
import RefundReasonModal from "./modals/RefundReasonModal";

class Till extends React.Component {

    state = {
        code: ""
    };

    constructor(props) {
        super(props);
        this.props.actions.till.setTransactions();
        this.props.actions.till.setCombos();
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.keydownFunction, false);

        this.props.actions.till.resetTotals();
        this.retrieveHaddiths();
    };

    retrieveHaddiths = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/settings/haddith`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Haddith retrieved!", "Retrieve Haddith");
                this.props.actions.settings.retrieveHaddith(response.data.haddith);
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

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.keydownFunction, false);
    };

    keydownFunction = event => {
        this.openModal(event);
    };

    mapLineItem = transaction => {
        let totals = this.props.till.totals;

        const discount = transaction.price - transaction.total;
        const subtotal = transaction.total / 115 * 100;
        const vat = transaction.total - subtotal;

        totals.total += Number(Number(transaction.total).toFixed(2));
        totals.discount += discount;
        totals.vat += vat;
        totals.subtotal += subtotal;

        this.props.actions.till.setTotals(totals);
    };

    mapHeldItems = (transaction, totals) => {
        const discount = transaction.price - transaction.total;
        const subtotal = transaction.total / 115 * 100;
        const vat = transaction.total - subtotal;

        totals.total += Number(Number(transaction.total).toFixed(2));
        totals.discount += discount;
        totals.vat += vat;
        totals.subtotal += subtotal;

        return totals;
    };

    openModal = (event) => {
        switch (event.keyCode) {
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

        axios.get(`/products/${code}`, { headers })
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

        let comboIndex = -1;
        for (let x = 0, len = this.props.till.transactions.length; x < len; x++) {
            let transaction = this.props.till.transactions[x];
            transaction.markdown = transaction.mdp > 0;

            if (this.props.till.staff) {
                transaction.price = transaction.retail;
                transaction.subtotal = transaction.price * transaction.qty;
                transaction.discStore = transaction.disc;

                if (transaction.markdown) {
                    transaction.disc = (transaction.mdp / transaction.retail * 100).toFixed(2);
                } else {
                    transaction.price = transaction.staff;
                    transaction.disc = 0.00;
                }

                if (typeof transaction.discStore !== "undefined") {
                    transaction.disc = transaction.discStore;
                    delete transaction.discStore;
                }
                transaction.total = transaction.disc > 0 ? transaction.subtotal * transaction.disc / 100 : transaction.subtotal;
            } else {
                transaction.combo = false;

                if (transaction.markdown) {
                    transaction.price = transaction.mdp;
                    transaction.disc = (transaction.mdp / transaction.retail * 100).toFixed(2);
                } else {
                    transaction.price = transaction.retail;
                    transaction.disc = 0.00;
                }

                let comboFromList = this.props.till.combos.find(combo => combo.style === transaction.code);
                if (comboFromList) {
                    if (comboIndex !== -1) {
                        let oldTran = this.props.till.transactions[comboIndex];
                        oldTran.price = comboFromList.rp;
                        oldTran.markdown = false;
                        oldTran.combo = true;
                        oldTran.discStore = oldTran.disc;
                        oldTran.disc = 0.00;
                        oldTran.subtotal = oldTran.price * oldTran.qty;
                        oldTran.total = oldTran.subtotal;

                        transaction.price = comboFromList.rp;
                        transaction.markdown = false;
                        transaction.combo = true;
                        transaction.disc = 0.00;
                        comboIndex = -1;
                    } else {
                        comboIndex = x;
                    }
                    transaction.subtotal = transaction.price * transaction.qty;
                    transaction.total = transaction.subtotal;
                } else {
                    transaction.price = transaction.retail;
                    transaction.subtotal = transaction.price * transaction.qty;

                    if (typeof transaction.discStore !== "undefined") {
                        transaction.disc = transaction.discStore;
                        delete transaction.discStore;
                    }
                    transaction.total = transaction.disc > 0 ? transaction.subtotal * transaction.disc / 100 : transaction.subtotal;
                }
            }
        }

        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0,
            items: 0
        };
        for (let transaction of this.props.till.transactions) {
            transaction.price = Number(transaction.price).toFixed(2);

            this.mapHeldItems(transaction, totals);
            totals.items++;
        }

        this.props.actions.till.setTotals(totals);
        this.props.actions.till.setTransactions(this.props.till.transactions);
    };

    retrieveCombo = (code) => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/products/${code}/combos`, { headers })
            .then(response => {
                console.log(response.data);
                toastr.info("Combos Found!", "Find Combo");

                let combo = this.props.till.combos.find(combo => combo.style === code);
                if (!combo) {
                    this.props.till.combos = this.props.till.combos.concat(response.data.combo);
                    this.props.actions.till.setCombos(this.props.till.combos);
                    this.props.actions.modal.openCombo();
                }
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
    };

    createTransaction = product => {
        const markdown = product.mdp > 0;
        const disc = markdown ? product.mdp / product.rp * 100 : 0;

        let transaction = {
            code: product.code,
            description: product.descr,
            size: product.codeKey,
            colour: product.colour,
            clrcode: product.clrcode,
            price: Number(product.rp).toFixed(2),
            mdp: product.mdp,
            qty: 1,
            disc: disc.toFixed(2),
            markdown: markdown,
            cost: product.sp,
            staff: Number(product.stfp),
            retail: Number(product.rp),
            serialNo: product.serialno
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
                    <TransactionBadges mapTransactions={this.mapTransactions}/>
                    <LineItems mapLineItem={this.mapLineItem} mapTransactions={this.mapTransactions}
                               openStyles={this.openStyles} retrieveCombo={this.retrieveCombo}
                               createTransaction={this.createTransaction}/>
                    <Totals openModal={this.openModal}/>
                </main>
                <footer>
                    <ActionBar openModal={this.openModal}/>
                </footer>

                <CashModal mapLineItem={this.mapHeldItems}/>
                <CardModal mapLineItem={this.mapHeldItems}/>

                <AuthenticationModal mapTransactions={this.mapTransactions}/>
                <ProductStyleModal mapLineItem={this.mapLineItem} retrieveCombo={this.retrieveCombo}
                                   mapTransactions={this.mapTransactions}/>
                <CompleteSaleModal mapLineItem={this.mapHeldItems}/>
                <SalesOptionsModal/>
                <CreditNoteOptionsModal/>
                <ReturnsModal/>
                <OtherModal/>
                <PaymentOptionsModal/>
                <TransactionId/>
                <RetrieveHeldModal/>
                <ComboModal/>
                <RefundModal mapLineItem={this.mapHeldItems}/>
                <RefundDetailsModal/>
                <CompleteRefund mapLineItem={this.mapHeldItems}/>
                <CompleteExchange mapLineItem={this.mapHeldItems}/>
                <TransactionCompleteModal/>
                <RefundReasonModal/>
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
            settings: bindActionCreators(settingsActions, dispatch),
            stock: bindActionCreators(stockActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Till);
