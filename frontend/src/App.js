import "./App.css";

import { ethers } from "ethers";

import TokenArtifact from "./contracts/Token.json";
import ContractAddress from "./contracts/contract-address.json";
import React from "react";

import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";

const HARDHAT_NETWORK_ID = 1337;
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: 1000,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };
    this.state = this.initialState;
  }
  render() {
    if (window.ethereum == undefined) {
      return <NoWalletDetected />;
    }
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }
    return (
      <div class="mainscreen">
        <div class="info">
          <h3>Connected to wallet: {this.state.selectedAddress}</h3>
          <p>You have {this.state.balance.toString()} TRC</p>
        </div>
        <div class="card">
          <div class="leftside">
            <img
              src="https://img.cpapracticeadvisor.com/files/base/cygnus/cpa/image/2019/05/Thomson_Reuters_Logo.5ce4592a437ab.png?auto=format%2Ccompress&w=320"
              class="product"
              alt="UltraTax"
            />
          </div>
          <div class="rightside">
            <form action="">
              <h1>UltraTax CS Express 100</h1>
              <h2>$2650/year*</h2>
              <h3>Payment Information</h3>
              <p>Cardholder Name</p>
              <input
                type="text"
                class="inputbox"
                name="name"
                value="John Doe"
                required
              />
              <p>Card Number</p>
              <input
                type="number"
                class="inputbox"
                name="card_number"
                id="card_number"
                value="1111222233334444"
                required
              />

              <p>Card Type</p>
              <select class="inputbox" name="card_type" id="card_type" required>
                <option value="">--Select a Card Type--</option>
                <option value="Visa">Visa</option>
                <option value="RuPay">RuPay</option>
                <option value="MasterCard">MasterCard</option>
              </select>
              <div class="expcvv">
                <p class="expcvv_text">Expiry</p>
                <input
                  type="date"
                  class="inputbox"
                  name="exp_date"
                  id="exp_date"
                  required
                />

                <p class="expcvv_text2">CVV</p>
                <input
                  type="password"
                  class="inputbox"
                  name="cvv"
                  id="cvv"
                  value="123"
                  required
                />
              </div>
              <p></p>
              <button type="submit" class="button">
                Pay now
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // if (!this._checkNetwork()) {
    //   return;
    // }
    this._initialize(selectedAddress);
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }
    return false;
  }

  _initialize(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });
  }
}

export default App;
