import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // deploy the contract
    const provider = ethers.getDefaultProvider("goerli", {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
        etherscan: process.env.ETHERSCAN_API_KEY,
      });
      const block = await provider.getBlock("latest");
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
      const signer = wallet.connect(provider);
      const balance = await signer.getBalance();
      console.log(
        `Working on Goerli Testnet connected to wallet ${signer.address} with balance of ${balance}`
      );
      const contractFactory = new TokenizedBallot__factory(signer);
      const vanilla = ethers.utils.formatBytes32String("vanilla");
      const chocolate = ethers.utils.formatBytes32String("chocolate");
      const mint = ethers.utils.formatBytes32String("mint chocolate chip");
      const baked = ethers.utils.formatBytes32String("half-baked");
      const PROPOSALS = [vanilla, chocolate, mint, baked];
      console.log("process.argv[2]", process.argv[2]);
      console.log("process.argv[3]", process.argv[3]);



      const contract = await contractFactory.deploy(PROPOSALS, process.argv[2], process.argv[3]);
      await contract.deployed();
      console.log(`contract address deployed to ${contract.address}\n`);

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
