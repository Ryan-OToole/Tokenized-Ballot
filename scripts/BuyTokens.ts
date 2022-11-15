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
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);

    console.log('signer.address', signer.address);
    console.log("process.argv[2]", process.argv[2]);

    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(process.argv[2]);
    const initialBalance = await tokenContract.balanceOf(signer.address);
    console.log("balance b4 mint", initialBalance);
    const tx = await tokenContract.mint(signer.address, MINT_VALUE);
    await tx.wait();
    const balanceAfterMint = await tokenContract.balanceOf(signer.address);
    console.log("balance after mint", balanceAfterMint);

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
