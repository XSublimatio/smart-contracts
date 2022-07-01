import { ethers } from 'hardhat';

async function main() {
    const [deployer] = await ethers.getSigners();

    const deployerAddress = await deployer.getAddress();
    const baseUri = process.env.BASE_URI ?? 'http://127.0.0.1:5001/';
    const pricePerTokenMint = process.env.PRICE_PER_TOKEN_MINT ?? ethers.utils.parseUnits('0.2', 'ether');
    const launchTimestamp = process.env.LAUNCH_TIMESTAMP ?? 0;

    console.log(`Using Base URI: ${baseUri}`);
    console.log(`Using price per token mint: ${pricePerTokenMint} wei (ETH)`);
    console.log(`Using launch timestamp: ${launchTimestamp}`);

    const contract = await (
        await (await ethers.getContractFactory('XSublimatio')).deploy(baseUri, deployerAddress, pricePerTokenMint, launchTimestamp)
    ).deployed();

    console.log(`XSublimatio contract deployed to: ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
