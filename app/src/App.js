import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Escrow from './Escrow';
import FactoryJSON from './artifacts/contracts/Factory.sol/Factory.json';
import EscrowJSON from './artifacts/contracts/Escrow.sol/Escrow.json';

const getProvider = () => {
  if (!window.ethereum) {
    throw new Error('Install browser wallet extension');
  }
  return new ethers.providers.Web3Provider(window.ethereum);
};

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

const provider = getProvider();
const eventName = 'EscrowCreated';
const factoryContract = new ethers.Contract(
  process.env.REACT_APP_FACTORY_ADDRESS,
  FactoryJSON.abi,
  provider.getSigner(),
);
const filter = {
  address: process.env.REACT_APP_FACTORY_ADDRESS,
  topics: [ethers.utils.id('EscrowCreated(address,address,address,address,uint256)')],
};
export const escrowStatus = {
  NEW: 'new',
  PREV: 'prev',
};

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState(null);

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
            "✓ It's been approved!";
        });

        await approve(escrowContract, provider.getSigner());
      },
    };
  };

  const newContract = async () => {
    const arbiter = document.getElementById('arbiter').value;
    const beneficiary = document.getElementById('beneficiary').value;
    const etherValue = document.getElementById('ether').value;
    const weiValue = ethers.utils.parseUnits(etherValue, 'ether');
    await factoryContract.connect(provider.getSigner()).createEscrowContract(
      arbiter,
      beneficiary,
      { value: weiValue.toString() },
    );
  };

  useEffect(() => {
    const getPrevEscrows = async () => {
      const rawEvents = await factoryContract.queryFilter(eventName);

      let prevEscrows = [];
      rawEvents.forEach(async (rawEvent) => {
        prevEscrows.push(await getEscrow(...rawEvent.args));
      });

      setEscrows(prevArray => [...prevArray, ...prevEscrows]);
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
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    }

    getAccounts();
  }, [account]);

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
