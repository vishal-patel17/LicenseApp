import React from "react";

import TokenArtifact from "../contracts/LicenseToken.json";
import contractAddress from "../contracts/contract-address.json";

import { ethers } from "ethers";
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";

const HARDHAT_NETWORK_ID = "1337";

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
      activeLicenseState: undefined,
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
    return (
      <div className="container-fluid pw">
        <div className="cwContent">
          <h3 style={{ color: "white" }}>TR License Management</h3>
          <br />
          <h5 style={{ color: "grey" }}>
            Owner's address: <b>{this.state.selectedAddress}</b>
          </h5>
          <div className="jumbotron align-items-center justify-content-center dcw">
            <div className="row">
              <div className="col-12">
                {this.state.txBeingSent && (
                  <WaitingForTransactionMessage
                    txHash={this.state.txBeingSent}
                  />
                )}
                {this.state.transactionError && (
                  <TransactionErrorMessage
                    message={this.state.transactionError}
                    dismiss={() => this._dismissTransactionError()}
                  />
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Generate New License </h3>
                    <p className="card-text" style={{ color: "gray" }}>
                      This will return a unique license number
                    </p>

                    <div>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          this._transferTokens(this.state.userAccount);
                        }}
                      >
                        <div className="form-group">
                          <label>Public addresses </label>{" "}
                          <select
                            name="PublicAddr"
                            onChange={this.handlePublicAddrChange}
                          >
                            <option>
                              0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
                            </option>
                            <option>
                              0x70997970c51812dc3a010c7d01b50e0d17dc79c8
                            </option>
                            <option>
                              0x90f79bf6eb2c4f870365e785982e1f101e93b906
                            </option>
                            <option>
                              0x15d34aaf54267db7d7c367839aaf71a00a2c6a65
                            </option>
                          </select>
                        </div>
                        <div className="form-group">
                          <input
                            className="btn btn-primary"
                            type="submit"
                            value="Generate"
                          />
                        </div>
                      </form>
                    </div>
                    {this.state.tokenId && (
                      <div className="col-12">
                        Your License number:{" "}
                        <b>{parseInt(this.state.tokenId, 10)}</b> <br />
                        Your account: <b>{this.state.userAccount}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Activate License</h3>
                    <p className="card-text" style={{ color: "gray" }}>
                      This will activate license if all the conditions are met
                    </p>
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
                          <label>Enter License number</label>{" "}
                          <input
                            type="number"
                            className="form-control"
                            name="tokenId"
                            placeholder="0"
                            required
                            style={{
                              display: "inline",
                              width: "70px",
                              height: "25px",
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            className="btn btn-success"
                            type="submit"
                            value="Activate"
                          />
                        </div>
                      </form>
                    </div>
                    {this.state.activeLicenseState && (
                      <p>
                        License <b>Activated</b> Successfully
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Check License Status</h3>
                    <p className="card-text" style={{ color: "gray" }}>
                      This will return the status of your License [Active,
                      Inactive, Expired]
                    </p>
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
                          <label>Enter public address</label>{" "}
                          <input
                            type="text"
                            className="form-control"
                            name="publicAddr"
                            defaultValue={this.state.userAccount}
                            required
                            style={{
                              display: "inline",
                              // width: "410px",
                              // height: "25px",
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Enter License number</label>{" "}
                          <input
                            type="number"
                            className="form-control"
                            name="tokenId"
                            placeholder="0"
                            required
                            style={{
                              display: "inline",
                              width: "70px",
                              height: "25px",
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            className="btn btn-warning"
                            type="submit"
                            value="Submit"
                          />
                        </div>
                      </form>
                      {this.state.LicenseState && (
                        <p>
                          License is currently <b>{this.state.LicenseState}</b>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">
                      Get Total Licenses Purchased by User
                    </h3>
                    <p className="card-text" style={{ color: "gray" }}>
                      This will return total number of licenses purchased by the
                      user
                    </p>
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
                            value="Submit"
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
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Get License Owner</h3>
                    <p className="card-text" style={{ color: "gray" }}>
                      This will return the owner address of the license
                    </p>
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
                          <label>Enter License number</label>{" "}
                          <input
                            type="number"
                            className="form-control"
                            name="tokenId"
                            placeholder="0"
                            required
                            style={{
                              display: "inline",
                              width: "70px",
                              height: "25px",
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            className="btn btn-primary"
                            type="submit"
                            value="Submit"
                          />
                        </div>
                      </form>
                      {this.state.tokenOwner && (
                        <p>
                          Owner of this License is:{" "}
                          <b>{this.state.tokenOwner}</b>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">
                      Get Total Licenses provided by TR
                    </h3>
                    <p className="card-text" style={{ color: "gray" }}>
                      This will return total number of licenses TR provided
                    </p>
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
                            value="Submit"
                          />
                        </div>
                      </form>
                      {this.state.totalLicensesProvided && (
                        <p>
                          Total Licenses Provided:{" "}
                          <b>
                            {parseInt(this.state.totalLicensesProvided, 10)}
                          </b>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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

    this.setState({
      selectedAddress: selectedAddress,
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
      this.setState({
        transactionError:
          "Error generating license / Only Owner can generate license",
      });
      return;
    }
  }

  async _isLicenseActive(address, tokenId) {
    try {
      var state = await this._token.isLicenseActive(address, tokenId);
    } catch (error) {
      this.setState({
        LicenseState: undefined,
        transactionError:
          "Invalid License / License does not belong to the provided address",
      });
      return;
    }
    var value = parseInt(state, 10);
    if (value === 1) {
      this.setState({ LicenseState: "INACTIVE" });
    } else if (value === 0) {
      this.setState({ LicenseState: "ACTIVE" });
    } else if (value === 2) {
      this.setState({ LicenseState: "EXPIRED" });
    }
  }

  async _activateLicense(tokenId) {
    try {
      await this._token.activate(tokenId);
    } catch (error) {
      this.setState({
        transactionError: "License already active / License not available",
      });
      return;
    }
    this.setState({ activeLicenseState: 1 });
  }

  async _getBalance(account) {
    try {
      var total = await this._token.balanceOf(account);
    } catch (error) {
      this.setState({ transactionError: "Invalid address / No license found" });
      return;
    }
    this.setState({ totalLicenses: total });
  }

  async _getOwner(tokenId) {
    try {
      var owner = await this._token.ownerOf(tokenId);
    } catch (error) {
      this.setState({ transactionError: "Invalid license number" });
      return;
    }
    this.setState({ tokenOwner: owner });
  }

  async _getTotalSupply() {
    try {
      var total = await this._token.totalSupply();
    } catch (error) {
      this.setState({ transactionError: "Error getting total lincenses" });
      return;
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
    return error.message;
  }

  _resetState() {
    this.setState(this.initialState);
  }

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
