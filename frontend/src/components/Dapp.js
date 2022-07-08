import React from "react";

import { ethers } from "ethers";

import TokenArtifact from "../contracts/LicenseToken.json";
import contractAddress from "../contracts/contract-address.json";

import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";

const HARDHAT_NETWORK_ID = "1337";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      tokenId: undefined,
      userAccount: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
      LicenseState: undefined,
      totalLicenses: undefined,
      tokenOwner: undefined,
      totalLicensesProvided: undefined,
    };

    this.state = this.initialState;
  }

  handlePublicAddrChange = (e) => {
    this.setState({ userAccount: e.target.value });
  };

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

    // If everything is loaded, we render the application.
    return (
      <div className="container">
        <div className="heading">
          <h1>License Management</h1>
        </div>
        <p className="ownerAddr">
          Owner's address: <b>{this.state.selectedAddress}</b>
        </p>
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
        <div className="row justify-content-between">
          <div className="col-5 jumbotron">
            <div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  this._transferTokens(this.state.userAccount);
                }}
              >
                <div className="heading">
                  <h2>Generating License</h2>
                </div>
                <div className="form-group">
                  <label>Public addresses </label> <br />
                  <select
                    name="PublicAddr"
                    onChange={this.handlePublicAddrChange}
                  >
                    <option>0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc</option>
                    <option>0x70997970c51812dc3a010c7d01b50e0d17dc79c8</option>
                    <option>0x90f79bf6eb2c4f870365e785982e1f101e93b906</option>
                    <option>0x15d34aaf54267db7d7c367839aaf71a00a2c6a65</option>
                  </select>
                </div>
                <div className="form-group">
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Generate License"
                  />
                </div>
              </form>
            </div>
            {this.state.tokenId && (
              <div className="col-12">
                Your License number: <b>{parseInt(this.state.tokenId, 10)}</b>{" "}
                <br />
                Your account: <b>{this.state.userAccount}</b>
              </div>
            )}
          </div>
          <div className="h-100"></div>
          <div className="col-5 jumbotron">
            <div className="heading">
              <h2>License Status</h2>
            </div>
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
                  <label>Public address</label>
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
          </div>
          <div className="col jumbotron">
            <div className="heading">
              <h2>License Functions</h2>
            </div>
            <div>
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
            <hr />
            <div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.target);
                  const userAddr = formData.get("publicAddr");
                  this._getBalance(userAddr);
                }}
              >
                <div className="form-group">
                  <label>Enter public address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="publicAddr"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Get Total Licenses"
                  />
                </div>
              </form>
              {this.state.totalLicenses && (
                <p>
                  Total Licenses available:{" "}
                  <b>{parseInt(this.state.totalLicenses, 10)}</b>
                </p>
              )}
            </div>
            <hr />
            <div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.target);
                  const tokenId = formData.get("tokenId");
                  this._getOwner(tokenId);
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
                    className="btn btn-primary"
                    type="submit"
                    value="Get Owner"
                  />
                </div>
              </form>
              {this.state.tokenOwner && (
                <p>
                  Owner of this token is: <b>{this.state.tokenOwner}</b>
                </p>
              )}
            </div>
            <hr />
            <div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  this._getTotalSupply();
                }}
              >
                <div className="form-group">
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Get Total Licenses Provided"
                  />
                </div>
              </form>
              {this.state.totalLicensesProvided && (
                <p>
                  Total Licenses Provided:{" "}
                  <b>{parseInt(this.state.totalLicensesProvided, 10)}</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);
  }

  _initialize(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });

    this._initializeEthers();
  }

  async _initializeEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
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
      alert("Only owner can generate License");
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

  async _getBalance(account) {
    try {
      var total = await this._token.balanceOf(account);
    } catch (error) {
      alert("Please verify the account number");
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
    }
    this.setState({ totalLicenses: total });
  }

  async _getOwner(tokenId) {
    try {
      var owner = await this._token.ownerOf(tokenId);
    } catch (error) {
      alert("Token not available");
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
    }
    this.setState({ tokenOwner: owner });
  }

  async _getTotalSupply() {
    try {
      var total = await this._token.totalSupply();
    } catch (error) {
      alert("No Licenses provided");
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
    }
    this.setState({ totalLicensesProvided: total });
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
