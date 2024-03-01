# Decentralized Escrow Application

This is an Escrow Dapp built with [Hardhat](https://hardhat.org/).

## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

## Front-End

`cd` into the `/app` directory and run `npm install`

To run the front-end application run `npm start` from the `/app` directory. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Additions/Modifications
- **Contract factory**: In this architecture, the contract factory acts as the deployer of escrow contracts. This design streamlines the management and deployment of escrow contracts, enhancing the overall efficiency and scalability of the system.
- **Past event listing**: As a solution for persistence, the contract factory also emits deployment events, which the app lists by checking for past events. 
- **Event listener**: Aside from listing past events, the app implements real-time event listening capabilities to monitor the deployment of new contracts.
- **Deployment to Goerli testnet**
- **Additional test cases**
- **Additional contract checks for security**
- **Usage of Ether instead of Wei**
- **Live demo**: https://escrow-hardhat-eabad.vercel.app