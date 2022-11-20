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
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);

    console.log('signer.address', signer.address);
    console.log("process.argv[2]", process.argv[2]);
    const lastBlock = await provider.getBlock("latest");
    console.log("lastBlock number:", lastBlock.number)
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(process.argv[2]);
    const totalSupply = await tokenContract.totalSupply();
    console.log(`total supply ERC20 Tokens are: ${totalSupply}`)
    const tokenBalance = await tokenContract.balanceOf(process.argv[3]);
    console.log(`balance of account ${process.argv[3]} is ${tokenBalance}`);
    const votePower = await tokenContract.getVotes(process.argv[3]);
    console.log(`Vote power of accounts ${process.argv[3]} is ${votePower}`);

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
