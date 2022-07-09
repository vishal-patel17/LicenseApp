import React from "react";
import img from "../wallet.png";
import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="container-fluid pw">
      <div className="col-12 text-center">
        {networkError && (
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        )}
      </div>
      <div className="cwContent">
        <h3 style={{ color: "white" }}>Welcome to TR License Management App</h3>
        <br />
        <h5 style={{ color: "grey" }}>Powered by Blockchain and Web3.0</h5>
        <div className="jumbotron align-items-center justify-content-center cw">
          <div className="container position-relative">
            <img src={img} alt="wallet" className="imgWallet" />
            <br />
            <h4>Please, connect your wallet</h4>
            <br />
            <h6 style={{ color: "grey" }}>
              Please connect your wallet to purchase, activate and get License
              info.
            </h6>
            <br />
            <button
              className="btn btnConnectWallet"
              type="button"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
