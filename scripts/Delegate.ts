import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const MINT_VALUE = ethers.utils.parseEther(".001");

async function main() {

    const provider = ethers.getDefaultProvider("goerli", {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
        etherscan: process.env.ETHERSCAN_API_KEY,
      });
      
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_2 ?? "");
    const signer = wallet.connect(provider);
    console.log('signer.address', signer.address);
    console.log("process.argv[2]", process.argv[2]);

    
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(process.argv[2]);

    const getVotesb4 = await tokenContract.getVotes(process.argv[3]);
    console.log(`votes b4 for ${process.argv[3]} are ${getVotesb4}`);

    // so when we access this the signer is the default account i.e. we dont need to connect manually to it...
    const delegateTx = await tokenContract.delegate(process.argv[3]);
    await delegateTx.wait();

    const getVotesAfter = await tokenContract.getVotes(process.argv[3]);
    console.log(`votes After for ${process.argv[3]} are ${getVotesAfter}`);
}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
