require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: 'localhost',
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
  paths: {
    artifacts: "./app/src/artifacts",
  }
};
