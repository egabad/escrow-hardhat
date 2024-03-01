import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { escrowStatus } from '../constants';

export default function Escrow({
  status,
  address,
  contract,
  arbiter,
  beneficiary,
  depositor,
  deposit,
  handleApprove,
}) {
  let [approved, setApproved] = useState(false);

  useEffect(() => {
    const setApprovalStatus = async () => {
      setApproved(await contract.isApproved());
    };

    setApprovalStatus();
  }, [contract]);

  return (
    <Box className='existing-contract'>
      <List className='fields'>
        <ListItem>
          <ListItemText primary='Contract Address' secondary={address} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Arbiter' secondary={arbiter} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Beneficiary' secondary={beneficiary} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Depositor' secondary={depositor} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Deposit Amount' secondary={deposit} />
        </ListItem>
        <ListItem>
          {status === escrowStatus.NEW || !approved ? (
            <Button variant='contained' color='primary' onClick={handleApprove}>
              Approve
            </Button>
          ) : (
            <Typography className='complete disabled'>✓ It's been approved!</Typography>
          )}
        </ListItem>
      </List>
    </Box>
  );
}
