import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // deploy the contract
    const provider = ethers.getDefaultProvider("goerli", {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
        etherscan: process.env.ETHERSCAN_API_KEY,
      });
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(
      `Working on Goerli Testnet connected to wallet ${signer.address} with balance of ${balance}`
    );
    const contractFactory = new MyToken__factory(signer);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    
    console.log(`contract address deployed to ${contract.address}\n`);

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
