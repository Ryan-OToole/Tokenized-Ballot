import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const MINT_VALUE = ethers.utils.parseEther(".001");
const MINT_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

async function main() {

    const provider = ethers.getDefaultProvider("goerli", {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
        etherscan: process.env.ETHERSCAN_API_KEY,
      });
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_4 ?? "");
    const signer = wallet.connect(provider);

    console.log('signer.address', signer.address);
    console.log("process.argv[2]", process.argv[2]);

    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(process.argv[2]);
    const initialBalance = await tokenContract.balanceOf(process.argv[3]);
    console.log("balance b4 mint", initialBalance);
    const tx = await tokenContract.mint(process.argv[3], MINT_VALUE);
    await tx.wait();
    const balanceAfterMint = await tokenContract.balanceOf(process.argv[3]);
    console.log("balance after mint", balanceAfterMint);

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
