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
      LicenseState: undefined,
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
        <div className="heading">
          <h1>Buy UltraTax CS Express 100</h1>
        </div>
        <hr />
        <div className="row">
          <div className="col-12">
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="col-12">
            {
              <Transfer
                transferTokens={(address) => this._transferTokens(address)}
                tokenSymbol={this.state.tokenData.symbol}
              />
            }
          </div>
          {this.state.tokenId && (
            <div className="col-12">
              Your License number: <b>{parseInt(this.state.tokenId, 10)}</b>{" "}
              <br />
              Your account: <b>{this.state.userAccount}</b>
              <br />
              <hr />
            </div>
          )}
          <div className="heading">
            <h2>Check your License status</h2>
          </div>
          <div className="col-12">
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
                  required
                />
              </div>
              <div className="form-group">
                <label>Enter License number</label>
                <input
                  type="number"
                  className="form-control"
                  name="tokenId"
                  placeholder="0"
                  required
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
            {this.state.LicenseState && (
              <p>
                Your License is currently <b>{this.state.LicenseState}</b>
              </p>
            )}
          </div>
          <div className="heading">
            <h2>Activating License</h2>
          </div>
          <div className="col-12">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.target);
                const tokenId = formData.get("tokenId");
                this._activateLicense(tokenId);
              }}
            >
              <div className="form-group">
                <label>Enter License number</label>
                <input
                  type="number"
                  className="form-control"
                  name="tokenId"
                  placeholder="0"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="btn btn-success"
                  type="submit"
                  value="Activate License"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
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

    this._initializeEthers();
    this._getTokenData();
    this._startPollingData();
  }

  async _initializeEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  _startPollingData() { }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  async _getTokenData() {
    const name = "TR Token";
    const symbol = "TRT";

    this.setState({ tokenData: { name, symbol } });
  }
  async _transferTokens(address) {

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
    try {
      var state = await this._token.isLicenseActive(address, tokenId);
    } catch (error) {
      alert("Invalid License number or this License does not belong to you");
      this.setState({ LicenseState: undefined });
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
    }
    var value = parseInt(state, 10);
    if (value === 1) {
      this.setState({ LicenseState: "INACTIVE" });
    } else if (value === 0) {
      this.setState({ LicenseState: "ACTIVE" });
    }
  }

  async _activateLicense(tokenId) {
    try {
      await this._token.activate(tokenId);
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
    }
    alert("License activated successfully");
  }

  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

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
