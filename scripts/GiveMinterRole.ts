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
    console.log("process.argv[3]", process.argv[3]);

    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(process.argv[2]);
    const MINTER_ROLE = await tokenContract.MINTER_ROLE();
    console.log('MINTER_ROLE', MINTER_ROLE);

    const roleTx = await tokenContract.grantRole(MINTER_ROLE, process.argv[3]);
    await roleTx.wait();
    console.log('roleTx', roleTx);
}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});