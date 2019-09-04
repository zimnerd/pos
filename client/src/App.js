import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as settingsActions from "./redux/actions/settings.action";
import * as authActions from "./redux/actions/auth.action";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/app/Dashboard";
import Till from "./components/app/till/Till";
import StockInformation from "./components/app/stock/StockInformation";
import ProductDetail from "./components/app/stock/ProductDetail";

import './App.scss';

class App extends React.Component {

    componentDidMount = async () => {
        const getIP = (onNewIP) => { //  onNewIp - your listener function for new IPs
            //compatibility for firefox and chrome
            var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            var pc = new myPeerConnection({
                    iceServers: []
                }),
                noop = function () {
                },
                localIPs = {},
                ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                key;

            function iterateIP(ip) {
                if (!localIPs[ip]) onNewIP(ip);
                localIPs[ip] = true;
            }

            //create a bogus data channel
            pc.createDataChannel("");

            // create offer and set local description
            pc.createOffer(function (sdp) {
                sdp.sdp.split('\n').forEach(function (line) {
                    if (line.indexOf('candidate') < 0) return;
                    line.match(ipRegex).forEach(iterateIP);
                });

                pc.setLocalDescription(sdp, noop, noop);
            }, noop);

            //listen for candidate events
            pc.onicecandidate = function (ice) {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
                ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
            };
        };

        let ip = "localhost/api";
        if (process.env.REACT_APP_IP_HOST != null) {
            ip = process.env.REACT_APP_IP_HOST;
        }
        axios.defaults.baseURL = `http://${ip}`;
        console.log("IP Address", `${ip}`);
        let clientIP = '';
        getIP(function (thisIP) {
            console.log("THIS", thisIP);
            let arr = thisIP.split('.');
            clientIP = arr[arr.length - 1];
            console.log(clientIP);
            console.log(arr[arr.length - 1]);
            console.log(arr.length - 1);
            localStorage.setItem('tillNumber', clientIP);

            axios.get(`/v1/settings/till/${clientIP}`)
                .then(response => {
                    console.log(response.data);

                    toastr.success("Till Details Retrieved!", "Retrieve Till Details");
                    this.props.actions.settings.retrieveTill(response.data.till);
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 404) {
                        toastr.error("There are no details on record for this till number!", "Retrieve Till Details");
                    } else {
                        toastr.error("Unknown error.");
                    }
                });

            axios.get(`/v1/settings/till/${clientIP}/controls`)
                .then(response => {
                    console.log(response.data);

                    toastr.success("Till Controls Retrieved!", "Retrieve Till Controls");
                    this.props.actions.settings.retrieveTillControls(response.data.control);
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 404) {
                        toastr.error("There are no controls on record for this till number!", "Retrieve Till Controls");
                    } else {
                        toastr.error("Unknown error.");
                    }
                });

        });

        axios.get('/v1/settings/shop')
            .then(response => {
                console.log(response.data);

                toastr.success("Shop Details Retrieved!", "Retrieve Shop Details");
                this.props.actions.settings.retrieveShop(response.data.shop);
            })
            .catch(error => {
                console.log(error);
                toastr.error("Unknown error.");
            });


        axios.get('/v1/auth/roles')
            .then(response => {
                console.log(response.data);

                toastr.success("Roles Retrieved!", "Retrieve Roles");
                this.props.actions.auth.retrieveRoles(response.data.roles);
            })
            .catch(error => {
                console.log(error);
                toastr.error("Unknown error.");
            });

        axios.get('/v1/settings/reasons')
            .then(response => {
                console.log(response.data);

                toastr.success("Reasons Retrieved!", "Retrieve Reasons");
                this.props.actions.settings.retrieveReasons(response.data.reasons);
            })
            .catch(error => {
                console.log(error);
                toastr.error("Unknown error.");
            });


        axios.get('/v1/settings/tax')
            .then(response => {
                console.log(response.data);

                toastr.success("Tax Rate Retrieved!", "Retrieve Tax Rate");
                this.props.actions.settings.retrieveTax(Number(response.data.tax));
            })
            .catch(error => {
                console.log(error);
                toastr.error("Unknown error.");
            });


    };

    render() {
        return (
            <Router>
                <main>
                    <Route path="/" exact component={Login}/>

                    <Route path="/app/register" component={Register}/>
                    <Route path="/app/dashboard" component={Dashboard}/>

                    <Route path="/app/till" component={Till}/>

                    <Switch>
                        <Route path="/app/stock" exact component={StockInformation}/>
                        <Route path="/app/stock/:code" name="product-detail" component={ProductDetail}/>
                    </Switch>
                </main>
            </Router>
        )
    }

}


function mapStateToProps(state) {
    return {
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            settings: bindActionCreators(settingsActions, dispatch),
            auth: bindActionCreators(authActions, dispatch)
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
