import React from "react";
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="150"
              height="150"
              fill="currentColor"
              className="bi bi-wallet"
              viewBox="0 0 16 16"
            >
              <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
            </svg>
            <br />
            <h4>Please, connect your wallet</h4>
            <br />
            <h6>
              Please connect your wallet to purchase, activate and get License
              info.
            </h6>
            <br />
            <button
              className="btn btn-warning"
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
