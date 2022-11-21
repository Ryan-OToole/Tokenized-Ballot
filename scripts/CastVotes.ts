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
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_3 ?? "");
    const signer = wallet.connect(provider);

    console.log('signer.address', signer.address);
    console.log("contract address:", process.argv[2]);

    const ballotContractFactory = new TokenizedBallot__factory(signer);
    const ballotContract = ballotContractFactory.attach(process.argv[2]);
    const initialBalance = await ballotContract.votingPower(process.argv[3]);
    console.log(`voting power of ${process.argv[3]} is ${initialBalance}`);
    const tx = await ballotContract.vote(process.argv[4], process.argv[5]);
    await tx.wait();
    const winningProposal = await ballotContract.winningProposal();
    console.log("winningProposal", winningProposal);
    const afterBalance = await ballotContract.votingPower(process.argv[3]);
    console.log(`voting power of ${process.argv[3]} is ${afterBalance}`);

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
