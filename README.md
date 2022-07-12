# 🔗 Blockchain for License Management

Using ```blockchain``` technology with ```web3.0``` for generation, storage and distribution of **Licenses** for digital products.

## 🎨 Design

![Logo](https://lucid.app/publicSegments/view/c815ebb5-e01d-4cbb-917a-a89e60e89e32/image.png)

## 🚀 Quick Start

- Make sure you have following **installed** before we continue:
  - [Git](https://git-scm.com/downloads)
  - [Nodejs](https://nodejs.org/en/download/)
    
- Then **clone** this repository and install its dependencies.
Run the following commands in your terminal or Git bash cmd:

```bash
  git clone https://github.com/vishal-patel17/LicenseApp.git
  cd LicenseApp
  npm install
```
- Once installed, run [Hardhat's](https://hardhat.org/) testing network. This will also give you a list of addresses for testing
```bash
  npx hardhat node
```
- Then, on a new terminal, go to the repository's root folder and run this command to **deploy** your contract to the localhost network. This will also **compile** your Smart Contract:
```bash
  npx hardhat run scripts/deploy.js --network localhost
```
- Add a custom [RPC network](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC) in your Metamask wallet for testing with the following configuration:

  - Network name: **MyTestNetwork**
  - New RPC URL: **http://127.0.0.1:8545/**
  - Chain ID: **1337**
  - Currency Symbol: **MyToken**

- **Save** the above configuration and finally, run the frontend with:
```bash
  cd frontend
  npm install
  npm start
```



## ⚙️ Troubleshooting

- ```Invalid nonce``` errors: if you are seeing this error on the ```npx hardhat node``` console, try **resetting** your Metamask account. This will reset the account's transaction history and also the nonce. Open Metamask, click on your account followed by ```Settings > Advanced > Reset Account```.


## 📸 Screenshots

![ConnectWallet](https://user-images.githubusercontent.com/10336383/178144902-ac6dd427-12e0-48ad-9140-920b7f2fa2f7.PNG)


![Home](https://user-images.githubusercontent.com/10336383/178144910-65c345f9-f448-4a32-ba51-6a5a39ac7aae.PNG)

</br></br>
*Happy _building_!*
