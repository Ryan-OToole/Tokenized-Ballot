import { ethers } from "hardhat";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

    const provider = ethers.getDefaultProvider("goerli", {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
        etherscan: process.env.ETHERSCAN_API_KEY,
      });
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);

    // last goerli block 
    const lastBlock = await provider.getBlock("latest");
    console.log(lastBlock.number);

    // ERC20 token contract
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(process.argv[2]);

    // ballot voting contract
    const ballotContractFactory = new TokenizedBallot__factory(signer);
    const ballotContract = ballotContractFactory.attach(process.argv[3]);

    //check totalSupply of tokens from tokenContract
    const totalSupply = await tokenContract.totalSupply();
    console.log(`total supply ERC20 Tokens are: ${totalSupply}`)

    // check tokenBalance of EOA address from args
    const tokenBalance = await tokenContract.balanceOf(process.argv[4]);
    console.log(`balance of account ${process.argv[4]} in tokenBalance contract is ${tokenBalance}`);

    // check votePower of EOA address from args 
    const votePower = await tokenContract.getVotes(process.argv[4]);
    console.log(`Vote power of account ${process.argv[4]} in tokenBalance contract is ${votePower}`);
    
    // check current voting power of EOA address from args within ballotContract
    const ballotVotingPower = await ballotContract.votingPower(process.argv[4]);
    const winningProposal = await ballotContract.winningProposal();
    console.log("winningProposal", Number(winningProposal));
    console.log(`Vote power of address: ${process.argv[4]} in ballotContract is ${ballotVotingPower}`);

    // check past voting power of EOA contract from args within ballot contract
    console.log(`lastBlock number is ${lastBlock.number}\n`);
    const pastVotes = await tokenContract.getPastVotes(process.argv[4], lastBlock.number - 1);
    console.log(`pastVotes in block ${lastBlock.number -1} were ${pastVotes}\n`);
}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
