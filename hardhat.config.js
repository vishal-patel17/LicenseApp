/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.15",
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
};
