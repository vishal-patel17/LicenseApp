
# Blockchain for License Management

Using blockchain technology with web3.0 for generation, storing and distribution of Licenses for various TR products.

## Design


![Logo](https://lucid.app/publicSegments/view/c815ebb5-e01d-4cbb-917a-a89e60e89e32/image.png)


## Quick Start

- The first thing you need to do is clone this repository and install its dependencies.
Run the following commands in your terminal or Git bash cmd:

```bash
  git clone https://github.com/vishal-patel17/LicenseApp.git
  cd LicenseApp
  npm install
```
- Once installed, let's run [Hardhat's](https://hardhat.org/) testing network:
```bash
  npx hardhat node
```
- Then, on a new terminal, go to the repository's root folder and run this command to deploy your contract to the localhost:
```bash
  npx hardhat run scripts/deploy.js --network localhost
```
- Add a custom [RPC network](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC) in your Metamask wallet for testing with the following configuration:

  - Network name: <b>TR Test Network</b>
  - New RPC URL: <b>http://127.0.0.1:8545/</b>
  - Chain ID: <b>1337</b>
  - Currency Symbol: <b>TRT</b>

- Save the above configuration and finally, we run the frontend with:
```bash
  cd frontend
  npm install
  npm start
```


    
## Troubleshooting

- ```Invalid nonce``` errors: if you are seeing this error on the ```npx hardhat node``` console, try resetting your Metamask account. This will reset the account's transaction history and also the nonce. Open Metamask, click on your account followed by ```Settings > Advanced > Reset Account```.
