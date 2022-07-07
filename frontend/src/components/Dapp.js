import React from "react";

import { ethers } from "ethers";

import TokenArtifact from "../contracts/LicenseToken.json";
import contractAddress from "../contracts/contract-address.json";

import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Transfer } from "./Transfer";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
// import { NoTokensMessage } from "./NoTokensMessage";

const HARDHAT_NETWORK_ID = "1337";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      tokenData: undefined,
      selectedAddress: undefined,
      balance: 1000,
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      tokenId: undefined,
      userAccount: undefined,
      LicenseState: "INACTIVE",
    };

    this.state = this.initialState;
  }

  render() {
    if (window.ethereum === undefined) {
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

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />;
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>UltraTax CS Express 100</h1>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {/* 
              Sending a transaction isn't an immediate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="column">
          <div className="col-12">
            {
              <Transfer
                transferTokens={(address) => this._transferTokens(address)}
                tokenSymbol={this.state.tokenData.symbol}
              />
            }
          </div>
          <hr />
          {this.state.tokenId && (
            <div className="col-12">
              Your Token number: <b>{parseInt(this.state.tokenId, 10)}</b>{" "}
              <br />
              Your account: <b>{this.state.userAccount}</b>
              <br />
              <hr />
            </div>
          )}
          <div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.target);
                const userAddr = formData.get("publicAddr");
                const tokenId = formData.get("tokenId");
                this._isLicenseActive(userAddr, tokenId);
              }}
            >
              <div className="form-group">
                <label>Your public address</label>
                <input
                  type="text"
                  className="form-control"
                  name="publicAddr"
                  defaultValue={this.state.userAccount}
                />
              </div>
              <div className="form-group">
                <label>Enter Token number</label>
                <input
                  type="number"
                  className="form-control"
                  name="tokenId"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <input
                  className="btn btn-warning"
                  type="submit"
                  value="Check License Status"
                />
              </div>
            </form>
            <p>
              Your License is currently <b>{this.state.LicenseState}</b>
            </p>
          </div>
          <hr />
          <div className="col-12">
            <button
              onClick={(event) => {
                event.preventDefault();
                this._activateLicense(
                  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
                  0
                );
              }}
              className="btn btn-success"
            >
              Activate License
            </button>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  _initialize(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
    this._getTokenData();
    this._startPollingData();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    // this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);
    // We run it once immediately so we don't have to wait for it
    // this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTokenData() {
    // const name = await this._token.name();
    const name = "TR Token";
    const symbol = "TRT";
    // const symbol = await this._token.symbol();

    this.setState({ tokenData: { name, symbol } });
  }

  // async _updateBalance() {
  //   const balance = await this._token.balanceOf(this.state.selectedAddress);
  //   this.setState({ balance });
  // }

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _transferTokens(address) {
    console.log("Called Give License");

    try {
      this._dismissTransactionError();

      const tx = await this._token.giveLicense(address);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      this._token.on("LicenseGiven", (account, tId) => {
        this.setState({ tokenId: tId });
        this.setState({ userAccount: account });
        console.log("Your account: " + account);
        console.log("and TokenId: " + this.state.tokenId);
      });
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
    } finally {
    }
  }

  async _isLicenseActive(address, tokenId) {
    var state = await this._token.isLicenseActive(address, tokenId);
    var value = parseInt(state, 10);
    if (value === 1) {
      this.setState({ LicenseState: "INACTIVE" });
      console.log("INACTIVE");
    } else if (value === 0) {
      this.setState({ LicenseState: "ACTIVE" });
      console.log("ACTIVE");
    }
  }

  async _activateLicense(address, tokenId) {
    console.log("Activate License called");
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({
      networkError: "Please connect Metamask to Localhost:8545",
    });

    return false;
  }
}
