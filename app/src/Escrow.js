import { useEffect, useState } from 'react';
import { escrowStatus } from './App';

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
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Contract Address </div>
          <div> {address} </div>
        </li>
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Depositor </div>
          <div> {depositor} </div>
        </li>
        <li>
          <div> Deposit Amount </div>
          <div> {deposit} </div>
        </li>
        {(status === escrowStatus.NEW || !approved) ? (
          <div
            className={`button`}
            id={address}
            onClick={(e) => {
              e.preventDefault();

              handleApprove();
            }}
          >
            Approve
          </div>
        ) : (
          <div className="complete disabled"> ✓ It's been approved! </div>
        )}
      </ul>
    </div>
  );
}
