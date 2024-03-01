import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import theme from './theme';

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Escrow from './components/Escrow';
import NewEscrow from './components/NewEscrow';
import FactoryJSON from './artifacts/contracts/Factory.sol/Factory.json';
import EscrowJSON from './artifacts/contracts/Escrow.sol/Escrow.json';
import { escrowStatus } from './constants';

// Set provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Set filter for event
const eventName = 'EscrowCreated';
const filter = {
  address: process.env.REACT_APP_FACTORY_ADDRESS,
  topics: [ethers.utils.id('EscrowCreated(address,address,address,address,uint256)')],
};

// Create a factory contract instance
const factoryContract = new ethers.Contract(
  process.env.REACT_APP_FACTORY_ADDRESS,
  FactoryJSON.abi,
  provider.getSigner(),
);

const approve = async (escrowContract, signer) => {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

const getEscrowContract = (escrowAddress) => {
  return new ethers.Contract(
    escrowAddress,
    EscrowJSON.abi,
    provider.getSigner(),
  );
};

function App() {
  const [escrows, setEscrows] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const getEscrow = async (escrowAddress, arbiter, beneficiary, depositor, deposit, status = escrowStatus.PREV) => {
    return {
      status,
      address: escrowAddress,
      contract: getEscrowContract(escrowAddress),
      arbiter,
      beneficiary,
      depositor,
      deposit: ethers.utils.formatEther(deposit.toString()) + ' ETH',
      handleApprove: async () => {
        const escrowContract = getEscrowContract(escrowAddress);
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            '✓ It\'s been approved!';
        });

        await approve(escrowContract, provider.getSigner());
      },
    };
  };

  useEffect(() => {
    const getPrevEscrows = async () => {
      const rawEvents = await factoryContract.queryFilter(eventName);

      let prevEscrows = [];
      for(let rawEvent of rawEvents) {
        prevEscrows.push(await getEscrow(...rawEvent.args));
      }
  
      setEscrows(prevEscrows);
    };

    const listenToEvents = () => { 
      factoryContract.on(filter, async (...rawEvent) => {
        const escrow = await getEscrow(...rawEvent, escrowStatus.NEW);
        setEscrows(prevEscrows => [...prevEscrows, escrow]);
      });
    };

    getPrevEscrows();
    listenToEvents();

    return () => factoryContract.removeAllListeners();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setIsConnected(true);
        } catch (error) {
          console.error(error);
          setIsConnected(false);
        }
      } else {
        setIsConnected(false);
      }
    };

    checkConnection();
  }, [isConnected]);

  return (
    <ThemeProvider theme={theme}>
      {isConnected ? (
        <Box>
          <NewEscrow factoryContract={factoryContract} provider={provider} />
          <Box className='existing-contracts'>
            <Typography variant='h2'>Existing Contracts</Typography>
            <Box id='container'>
              {escrows.map((escrow) => {
                return <Escrow key={escrow.address} {...escrow} />;
              })}
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography variant='h2'>Not connected to wallet provider!</Typography>
      )}
    </ThemeProvider>
  );
}

export default App;
