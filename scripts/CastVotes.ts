import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

    const provider = ethers.getDefaultProvider("goerli", {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
        etherscan: process.env.ETHERSCAN_API_KEY,
      });
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_4 ?? "");
    const signer = wallet.connect(provider);

    console.log('signer.address', signer.address);
    console.log("contract address:", process.argv[2]);

    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(process.argv[2]);
    const initialBalance = await tokenContract.getVotes(process.argv[3]);
    console.log(`voting power of ${process.argv[3]} is ${initialBalance}`);
    const tx = await tokenContract.vote(process.argv[3], MINT_VALUE);
    await tx.wait();
    const balanceAfterMint = await tokenContract.balanceOf(process.argv[3]);
    console.log("balance after mint", balanceAfterMint);

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
