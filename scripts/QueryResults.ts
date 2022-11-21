import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";
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

    const ballotContractFactory = new TokenizedBallot__factory(signer);
    const ballotContract = ballotContractFactory.attach(process.argv[2]);

    
    const winningProposal = await ballotContract.winningProposal();
    console.log('winningProposal', winningProposal);
    const winnerName = await ballotContract.winnerName();
    console.log('winnerName', winnerName);
    const proposalVoteCount = await ballotContract.proposals(1);
    const voteCount = proposalVoteCount.voteCount;
    console.log('voteCount', Number(voteCount));
}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
