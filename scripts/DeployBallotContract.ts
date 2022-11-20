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
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(
      `Working on Goerli Testnet connected to wallet ${signer.address} with balance of ${balance}`
    );
    const contractFactory = new TokenizedBallot__factory(signer);
    const PROPOSALS = ["vanilla", "chocolate", "mint chocolate chip", "half-baked"];
    let PROPOSALSBYTES32 = [];
    for (let proposal of PROPOSALS) {
      PROPOSALSBYTES32.push(ethers.utils.hexlify(proposal))
    }

    const GOERLI_BLOCK = 7988375;
    const TOKEN_CONTRACT="0x02bc85092257eFDe8605beA90cC594042B865B5F";

    const contract = await contractFactory.deploy(PROPOSALSBYTES32, TOKEN_CONTRACT, GOERLI_BLOCK);
    await contract.deployed();
  
    console.log(`contract address deployed to ${contract.address}\n`);

}
main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
