import { Box, Typography, TextField, Link } from '@mui/material';

import { ethers } from 'ethers';

export default function NewEscrow(props) {
  const factoryAddress = process.env.REACT_APP_FACTORY_ADDRESS;
  const { factoryContract, provider } = props;
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

  return (
    <Box className='contract'>
      <Typography variant='h2'>New Contract</Typography>
      <Box className='factory'>
      <Link href={`https://goerli.etherscan.io/address/${factoryAddress}`} underline='none'>
        <Typography variant='h6'>Goerli Factory Address:</Typography>
        {factoryAddress}
      </Link>
    </Box>
      <label>
        <Typography variant='body1' component='span'>Arbiter Address</Typography>
        <TextField id='arbiter' type='text' />
      </label>

      <label>
        <Typography variant='body1' component='span'>Beneficiary Address</Typography>
        <TextField id='beneficiary' type='text' />
      </label>

      <label>
        <Typography variant='body1' component='span'>Deposit Amount (in Ether)</Typography>
        <TextField id='ether' type='text' />
      </label>

      <Box
        className='button'
        id='deploy'
        onClick={(e) => {
          e.preventDefault();

          newContract();
        }}
      >
        Deploy
      </Box>
    </Box>
  );
};