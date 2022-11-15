import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    const accounts = await ethers.getSigners();

    // deploy the contract
    const contractFactory = new MyToken__factory(accounts[0]);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`contract address deployed to ${contract.address}\n`);

    // mint some tokens 
    const mintTx = await contract.mint(accounts[1].address, MINT_VALUE);
    await mintTx.wait();
    // console.log(`minted ${MINT_VALUE.toString()} decimal uints to account ${accounts[1].address}`);

    const balanceBN = await contract.balanceOf(accounts[1].address);
    console.log(`Account  ${accounts[1].address} has this many  ${balanceBN.toString()} decimal uints of MyToken\n`);

    //Check the voting power 
    const votes = await contract.getVotes(accounts[1].address);
    console.log(`${accounts[1].address} has ${votes.toString()} units of voting power before self delegating\n`);

    // Self delegate 
    const delegateTx = await contract.connect(accounts[1]).delegate(accounts[1].address);
    await delegateTx.wait();

    //Check the voting power
    const votesAfter = await contract.getVotes(accounts[1].address);
    console.log(`Account ${accounts[1].address} has ${votesAfter.toString()} units of voting power after self-delegating\n`);

    //Transfer tokens 
    const transferTx = await contract.connect(accounts[1]).transfer(accounts[2].address, MINT_VALUE.div(2));
    await transferTx.wait();

    // check voting power account1
    const votesAfterTransfer1 = await contract.getVotes(accounts[1].address);
    console.log(`Account ${accounts[1].address} has ${votesAfterTransfer1.toString()} voting power after transfer\n`);

    // check voting power account2
    const votesAfterTransfer2 = await contract.getVotes(accounts[2].address);
    console.log(`Account ${accounts[2].address} has this much voting power ${votesAfterTransfer2.toString()}\n`);

    // check past voting power 
    const lastBlock = await ethers.provider.getBlock("latest");
    console.log(`lastBlock number is ${lastBlock.number}\n`);
    const pastVotes = await contract.getPastVotes(accounts[1].address, lastBlock.number - 1);
    console.log(`pastVotes in block ${lastBlock.number -1} were ${pastVotes}\n`)

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});