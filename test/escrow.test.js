const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Escrow Factory', function () {
  let factoryContract;
  let escrowContract;
  let depositor;
  let beneficiary;
  let arbiter;
  let tx;
  const deposit = ethers.utils.parseEther('1');
  beforeEach(async () => {
    depositor = ethers.provider.getSigner(0);
    beneficiary = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);

    // Deploy factory contract
    const Factory = await ethers.getContractFactory('Factory');
    factoryContract = await Factory.deploy();
    await factoryContract.deployed();

    // Deploy escrow contract via factory
    tx = await factoryContract.connect(depositor).createEscrowContract(
      await arbiter.getAddress(),
      await beneficiary.getAddress(),
      { value: deposit },
    );

    // Get escrow contract
    escrowContract = await ethers.getContractAt('Escrow', await factoryContract.EscrowArray(0));
  });

  describe('upon initialization', () => {
    it('should be funded initially', async function () {
      let balance = await ethers.provider.getBalance(escrowContract.address);
      expect(balance).to.eq(deposit);
    });

    it('should revert when arbiter is the same as beneficiary', async () => {
      // Create another contract via factory
      const arbiterAddress = await beneficiary.getAddress();
      await expect(factoryContract.connect(depositor).createEscrowContract(
        arbiterAddress,
        arbiterAddress,
        { value: deposit },
      )).to.be.revertedWith('Arbiter and beneficiary have the same address');
    });

    it('should revert when arbiter is the same as depositor', async () => {
      // Create another contract via factory
      await expect(factoryContract.connect(arbiter).createEscrowContract(
        await arbiter.getAddress(),
        await beneficiary.getAddress(),
        { value: deposit },
      )).to.be.revertedWith('Arbiter and depositor have the same address');
    });
  });

  describe('after escrow contract creation', () => {
    it('should add escrow address to array', async function () {
      await expect(factoryContract.EscrowArray(1)).to.be.reverted;

      // Create another contract via factory
      await factoryContract.connect(depositor).createEscrowContract(
        await arbiter.getAddress(),
        await beneficiary.getAddress(),
        { value: deposit },
      );

      expect(await factoryContract.EscrowArray(1)).to.be.a('string');
    });

    it('should emit event after escrow creation', async function () {
      await expect(tx).to.emit(factoryContract, 'EscrowCreated').withArgs(
        await factoryContract.EscrowArray(0),
        await arbiter.getAddress(),
        await beneficiary.getAddress(),
        await depositor.getAddress(),
        deposit,
      );
    });
  });

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(
        escrowContract.connect(beneficiary).approve()
      ).to.be.revertedWith('Sender is not the arbiter');
    });
  });

  describe('after being approved twice', () => {
    it('should revert', async () => {
      await escrowContract.connect(arbiter).approve();
      await expect(
        escrowContract.connect(arbiter).approve()
      ).to.be.revertedWith('Contract is already approved');
    });
  });

  describe('after approval from the arbiter', () => {
    it('should transfer balance to beneficiary', async () => {
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await escrowContract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before)).to.eq(deposit);
    });
  });
});
