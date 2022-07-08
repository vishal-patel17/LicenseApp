# 🕸️ A React Dapp

This directory has a <b>De-Centralised App</b> (Dapp) to interact with the Smart Contracts, built using
<b>React</b>.

## 🏃 Running the Dapp

This project uses [`create-react-app`](https://create-react-app.dev/), so most
configuration files are handled by it.

To run it, you just need to execute `npm start` in a terminal, and open
[http://localhost:3000](http://localhost:3000).

To learn more about what `create-react-app` offers, you can read
[its documentation](https://create-react-app.dev/docs/getting-started).

## 📐 Architecture of the Dapp

This Dapp consists of multiple React Components, which you can find in
`src/components`.

Most of them are presentational components, have no logic, and just render HTML.

The core functionality is implemented in `src/components/Dapp.js`, which <b>connects</b> to the user's wallet, <b>initialize</b> the Ethereum
connection and contracts, <b>read</b> from the contract's state, and perform <b>License</b> related operations.
