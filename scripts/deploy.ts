import { ethers } from 'hardhat';

async function main() {
    const [deployer] = await ethers.getSigners();

    const deployerAddress = await deployer.getAddress();
    const baseUri = process.env.BASE_URI ?? 'http://127.0.0.1:5001';

    console.log(`Using Base URI: ${baseUri}`);

    const contract = await (await (await ethers.getContractFactory('XSublimatio')).deploy(baseUri, deployerAddress)).deployed();

    console.log(`XSublimatio contract deployed to: ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
