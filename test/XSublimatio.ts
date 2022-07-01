import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { BigNumber, Signer } from 'ethers';
import {
    MOLECULE_MAX_SUPPLY,
    MOLECULE_MAX_SUPPLIES,
    DRUG_MAX_SUPPLY,
    DRUG_MAX_SUPPLIES,
    RECIPES,
    MOLECULES,
    DRUGS,
    getTokenFromId,
} from '../src';
import { XSublimatio__factory, XSublimatio } from '../src/ethers';

chai.use(chaiAsPromised);
const { expect } = chai;

const checkInvariants = async (instance: XSublimatio) => {
    const [compactState1, compactState2, compactState3] = await instance.compactStates();
    const drugsAvailable = compactState3.shr(152).mask(11);
    const moleculesAvailable = compactState3.shr(163).mask(13);
    // const tokenNonce = compactState3.shr(176).mask(80);

    const [moleculeAvailabilities, drugAvailabilities] = await instance.availabilities();

    const { check: check1, count: count1 } = moleculeAvailabilities.reduce(
        ({ check, count }, availability, index) => {
            return {
                check: check && availability.toNumber() <= MOLECULE_MAX_SUPPLIES[index],
                count: count + availability.toNumber(),
            };
        },
        { check: true, count: 0 }
    );

    if (!check1) return false;

    if (count1 > MOLECULE_MAX_SUPPLY) return false;

    if (count1 !== moleculesAvailable.toNumber()) return false;

    const { check: check2, count: count2 } = drugAvailabilities.reduce(
        ({ check, count }, availability, index) => {
            return {
                check: check && availability.toNumber() <= DRUG_MAX_SUPPLIES[index],
                count: count + availability.toNumber(),
            };
        },
        { check: true, count: 0 }
    );

    if (!check2) return false;

    if (count2 > DRUG_MAX_SUPPLY) return false;

    if (count2 !== drugsAvailable.toNumber()) return false;

    return true;
};

const getBlockTimestamp = async () => {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    return blockBefore.timestamp;
};

describe('XSublimatio', () => {
    const pricePerTokenMint = ethers.utils.parseUnits('0.2', 'ether');
    const contractURI = 'http://127.0.0.1:8080';

    let contract: XSublimatio;
    let alice: Signer;
    let bob: Signer;
    let charlie: Signer;

    let launchTimestamp: number;

    beforeEach(async () => {
        [alice, bob, charlie] = await ethers.getSigners();

        const contractFactory = new XSublimatio__factory(alice);

        launchTimestamp = (await getBlockTimestamp()) + 1000;

        contract = await contractFactory.deploy(contractURI, await alice.getAddress(), pricePerTokenMint, launchTimestamp);

        await contract.deployed();
    });

    describe('miscellaneous', () => {
        it('Correctly initialized', async () => {
            expect(contract.address).to.properAddress;

            expect(await contract.name()).to.equal('XSublimatio');
            expect(await contract.symbol()).to.equal('XSUB');
            expect(await contract.totalSupply()).to.equal(0);

            expect(await contract.LAUNCH_TIMESTAMP()).to.equal(launchTimestamp);

            expect(await contract.owner()).to.equal(await alice.getAddress());
            expect(await contract.pendingOwner()).to.equal(ethers.constants.AddressZero);
            expect(await contract.proceedsDestination()).to.equal(ethers.constants.AddressZero);
            expect(await contract.baseURI()).to.equal('http://127.0.0.1:8080');
            expect(await contract.pricePerTokenMint()).to.equal(pricePerTokenMint);

            const [compactState1, compactState2, compactState3] = await contract.compactStates();

            expect(compactState1).to.equal('60087470205620319587750252891185586116542855063423969629534558109603704138');
            expect(compactState2).to.equal('114873104402099400223353432978706708436353982610412083425164130989245597730');
            expect(compactState3).to.equal('67212165445492353831982701316699907697777805738906362');

            const [moleculeAvailabilities, drugAvailabilities] = await contract.availabilities();

            expect(moleculeAvailabilities.map((x) => x.toNumber())).to.deep.equal(MOLECULE_MAX_SUPPLIES);
            expect(drugAvailabilities.map((x) => x.toNumber())).to.deep.equal(DRUG_MAX_SUPPLIES);

            expect(await contract.contractURI()).to.equal(`${contractURI}`);
            expect(await contract.drugsAvailable()).to.equal(1134);

            for (let i = 0; i < 19; ++i) {
                expect(await contract.getAvailabilityOfDrug(i)).to.equal(DRUG_MAX_SUPPLIES[i]);
            }

            for (let i = 0; i < 63; ++i) {
                expect(await contract.getAvailabilityOfMolecule(i)).to.equal(MOLECULE_MAX_SUPPLIES[i]);
            }

            for (let i = 0; i < 19; ++i) {
                expect(await contract.getRecipeOfDrug(i)).to.deep.equal(RECIPES[i]);
            }

            expect(await contract.moleculesAvailable()).to.equal(5748);

            expect(await checkInvariants(contract)).to.be.true;
        });

        it('Has proper helpers', async () => {
            expect(MOLECULE_MAX_SUPPLY).to.equal(5748);

            expect(MOLECULE_MAX_SUPPLIES.reduce((acc, ele) => acc + ele)).to.equal(5748);

            expect(DRUG_MAX_SUPPLY).to.equal(1134);

            expect(DRUG_MAX_SUPPLIES.reduce((acc, ele) => acc + ele)).to.equal(1134);

            expect(RECIPES.length).to.equal(DRUG_MAX_SUPPLIES.length);

            RECIPES.forEach((recipe) => recipe.forEach((moleculeType) => expect(moleculeType).be.lessThan(MOLECULE_MAX_SUPPLIES.length)));

            MOLECULES.forEach((molecule) => {
                expect(molecule.type).to.be.a('number');
                expect(molecule.name).to.be.a('string');
                expect(molecule.description).to.be.a('string');
                expect(molecule.label).to.be.a('string');
                expect(molecule.maxSupply).to.be.a('number');
                expect(molecule.image).to.be.a('string');
                expect(molecule.getSupply).to.be.a('function');
            });

            DRUGS.forEach((drug) => {
                expect(drug.type).to.be.a('number');
                expect(drug.name).to.be.a('string');
                expect(drug.description).to.be.a('string');
                expect(drug.label).to.be.a('string');
                expect(drug.maxSupply).to.be.a('number');

                drug.recipe.forEach((molecule) => expect(molecule).to.equal(MOLECULES[molecule.type]));

                expect(drug.image).to.be.a('string');
                expect(drug.getBrewPossibility).to.be.a('function');
                expect(drug.getSupply).to.be.a('function');
            });
        });

        it('Can change owner', async () => {
            await (await contract.proposeOwnership(await bob.getAddress())).wait();
            await (await contract.connect(bob).acceptOwnership()).wait();
            expect(await contract.owner()).to.equal(await bob.getAddress());
            expect(await contract.pendingOwner()).to.equal(ethers.constants.AddressZero);
        });

        it('Cannot propose owner if not owner', async () => {
            await expect(contract.connect(bob).proposeOwnership(await bob.getAddress())).to.be.revertedWith('UNAUTHORIZED');
        });

        it('Cannot accept owner if not pending owner', async () => {
            await (await contract.proposeOwnership(await bob.getAddress())).wait();
            await expect(contract.connect(charlie).acceptOwnership()).to.be.revertedWith('UNAUTHORIZED');
        });

        it('Cannot set asset generator hash if not owner', async () => {
            expect(
                contract.connect(bob).setAssetGeneratorHash('0x1234567812345678123456781234567812345678123456781234567812345678')
            ).to.be.revertedWith('UNAUTHORIZED');
        });

        it('Can set asset generator hash before launch', async () => {
            await (await contract.setAssetGeneratorHash('0x1234567812345678123456781234567812345678123456781234567812345678')).wait();
            expect(await contract.assetGeneratorHash()).to.equal('0x1234567812345678123456781234567812345678123456781234567812345678');
        });

        it('Cannot set base URI if not owner', async () => {
            expect(contract.connect(bob).setBaseURI('test')).to.be.revertedWith('UNAUTHORIZED');
        });

        it('Can set base URI', async () => {
            await (await contract.setBaseURI('test')).wait();
            expect(await contract.baseURI()).to.equal('test');
        });

        it('Cannot set proceeds destination if not owner', async () => {
            const charlieAddress = await charlie.getAddress();
            expect(contract.connect(bob).setProceedsDestination(charlieAddress)).to.be.revertedWith('UNAUTHORIZED');
        });

        it('Can set proceeds destination before launch', async () => {
            const charlieAddress = await charlie.getAddress();
            await (await contract.setProceedsDestination(charlieAddress)).wait();
            expect(await contract.proceedsDestination()).to.equal(charlieAddress);
        });

        it('Can set asset generator hash after launch, if it has not yet been set', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            await (await contract.setAssetGeneratorHash('0x1234567812345678123456781234567812345678123456781234567812345678')).wait();
            expect(await contract.assetGeneratorHash()).to.equal('0x1234567812345678123456781234567812345678123456781234567812345678');
        });

        it('Can set proceeds destination after launch, if it has not yet been set', async () => {
            const charlieAddress = await charlie.getAddress();
            await (await contract.setProceedsDestination(charlieAddress)).wait();

            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            expect(await contract.proceedsDestination()).to.equal(charlieAddress);
        });

        it('Cannot set asset generator hash after launch, if it has been set', async () => {
            await (await contract.setAssetGeneratorHash('0x1234567812345678123456781234567812345678123456781234567812345678')).wait();

            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            expect(contract.setAssetGeneratorHash('0x1234567812345678123456781234567812345678123456781234567812345678')).to.be.revertedWith(
                'ALREADY_LAUNCHED'
            );
        });

        it('Cannot set proceeds destination after launch, if it has been set', async () => {
            await (await contract.setProceedsDestination(await charlie.getAddress())).wait();

            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            expect(contract.setProceedsDestination(await charlie.getAddress())).to.be.revertedWith('ALREADY_LAUNCHED');
        });

        it('Can decrease price per token mint', async () => {
            const newPricePerTokenMint = ethers.utils.parseUnits('0.1', 'ether');
            await (await contract.setPricePerTokenMint(newPricePerTokenMint)).wait();
            expect(await contract.pricePerTokenMint()).to.equal(newPricePerTokenMint);
        });

        it('Can increase price per token mint', async () => {
            const newPricePerTokenMint = ethers.utils.parseUnits('1', 'ether');
            await (await contract.setPricePerTokenMint(newPricePerTokenMint)).wait();
            expect(await contract.pricePerTokenMint()).to.equal(newPricePerTokenMint);
        });

        it('Cannot change price per token mint if not owner', async () => {
            const newPricePerTokenMint = ethers.utils.parseUnits('0.1', 'ether');
            expect(contract.connect(bob).setPricePerTokenMint(newPricePerTokenMint)).to.be.revertedWith('UNAUTHORIZED');
        });

        it('Cannot change price per token mint after launch', async () => {
            const newPricePerTokenMint = ethers.utils.parseUnits('0.1', 'ether');
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            expect(contract.setPricePerTokenMint(newPricePerTokenMint)).to.be.revertedWith('ALREADY_LAUNCHED');
        });
    });

    describe('purchase and withdraw proceeds', () => {
        it('Cannot purchase molecules before launch', async () => {
            const aliceAddress = await alice.getAddress();
            await expect(contract.purchase(aliceAddress, 5749, 5749)).to.be.revertedWith('NOT_LAUNCHED_YET');
        });

        it('Cannot purchase molecules if cannot fullfil request', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            const aliceAddress = await alice.getAddress();
            await expect(contract.purchase(aliceAddress, 5749, 5749)).to.be.revertedWith('CANNOT_FULLFIL_REQUEST');
        });

        it('Cannot purchase molecules if insufficient funds provided', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(4);
            await expect(contract.purchase(aliceAddress, 5, 5, { value })).to.be.revertedWith('INCORRECT_VALUE');
        });

        it('Can purchase a batch of 5 molecules', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);

            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(5);
            const tx = await (await contract.purchase(aliceAddress, 5, 5, { value })).wait();

            expect(await contract.totalSupply()).to.equal(5);
            expect(await contract.moleculesAvailable()).to.equal(5748 - 5);
            expect(await contract.balanceOf(aliceAddress)).to.equal(5);

            const tokenIds = await Promise.all(
                (tx.events ?? [])?.map(async ({ event, args }) => {
                    expect(event).to.equal('Transfer');
                    expect(args?.from).to.equal(ethers.constants.AddressZero);
                    expect(args?.to).to.equal(aliceAddress);

                    const { globalType, type, category } = getTokenFromId(args?.tokenId);

                    expect(globalType).to.lessThan(63);
                    expect(type).to.be.lessThan(63);
                    expect(globalType).to.equal(type);
                    expect(category).to.equal('molecule');

                    const tokeURI = await contract.tokenURI(args?.tokenId);

                    expect(tokeURI).to.equal(`http://127.0.0.1:8080/${args?.tokenId.toString()}`);

                    return args?.tokenId;
                })
            );

            expect(await contract.tokensOfOwner(await alice.getAddress())).to.deep.equal(tokenIds);

            const availabilities = await contract.moleculeAvailabilities();

            const totalMoleculeAvailability = availabilities.reduce((acc, item) => acc + parseInt(item.toString()), 0);

            expect(totalMoleculeAvailability).to.equal(MOLECULE_MAX_SUPPLY - tokenIds.length);

            expect(await checkInvariants(contract)).to.be.true;
        });

        it('Can purchase a batch of 60 molecules', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);

            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(60);
            const tx = await (await contract.purchase(aliceAddress, 60, 60, { value })).wait();

            expect(await contract.totalSupply()).to.equal(60);
            expect(await contract.moleculesAvailable()).to.equal(5748 - 60);
            expect(await contract.balanceOf(aliceAddress)).to.equal(60);

            const tokenIds = await Promise.all(
                (tx.events ?? [])?.map(async ({ event, args }) => {
                    expect(event).to.equal('Transfer');
                    expect(args?.from).to.equal(ethers.constants.AddressZero);
                    expect(args?.to).to.equal(aliceAddress);

                    const { globalType, type, category } = getTokenFromId(args?.tokenId);

                    expect(globalType).to.lessThan(63);
                    expect(type).to.be.lessThan(63);
                    expect(globalType).to.equal(type);
                    expect(category).to.equal('molecule');

                    const tokeURI = await contract.tokenURI(args?.tokenId);

                    expect(tokeURI).to.equal(`http://127.0.0.1:8080/${args?.tokenId.toString()}`);

                    return args?.tokenId;
                })
            );

            expect(await contract.tokensOfOwner(await alice.getAddress())).to.deep.equal(tokenIds);

            const availabilities = await contract.moleculeAvailabilities();

            const totalMoleculeAvailability = availabilities.reduce((acc, item) => acc + parseInt(item.toString()), 0);

            expect(totalMoleculeAvailability).to.equal(MOLECULE_MAX_SUPPLY - tokenIds.length);

            expect(await checkInvariants(contract)).to.be.true;
        });

        it('Can purchase all molecules in batches of 120', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);

            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(120);

            const purchases = Math.ceil(5748 / 120);

            for (let i = 1; i <= purchases; ++i) {
                process.stdout.write(`\r        Purchase ${i} of ${purchases}`);
                const tx = await (await contract.purchase(aliceAddress, 120, 0, { value })).wait();
                expect(tx.events?.length).to.equal(i == purchases ? 5748 % 120 : 120);

                if (i % 8 === 0) {
                    expect(await checkInvariants(contract)).to.be.true;
                }
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            expect(await contract.totalSupply()).to.equal(5748);
            expect(await contract.moleculesAvailable()).to.equal(0);
            expect(await contract.balanceOf(aliceAddress)).to.equal(5748);

            for (let moleculeType = 0; moleculeType < 63; ++moleculeType) {
                expect(await contract.getAvailabilityOfMolecule(moleculeType)).to.equal(0);
            }

            expect(await checkInvariants(contract)).to.be.true;
        }).timeout(1_000_000);

        it('Can withdraw proceeds to owner, if no proceeds destination set', async () => {
            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(60);

            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);

            await (await contract.purchase(aliceAddress, 60, 60, { value })).wait();

            const aliceBalanceBeforeWithdrawal = await alice.getBalance();

            await (await contract.connect(bob).withdrawProceeds()).wait();

            const aliceBalanceAfterWithdrawal = await alice.getBalance();

            expect(aliceBalanceAfterWithdrawal.sub(aliceBalanceBeforeWithdrawal)).to.equal(value);
        });

        it('Can withdraw proceeds to proceeds destination, if set', async () => {
            const aliceAddress = await alice.getAddress();
            const bobAddress = await bob.getAddress();
            const value = pricePerTokenMint.mul(60);

            await (await contract.setProceedsDestination(bobAddress)).wait();

            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);

            await (await contract.purchase(aliceAddress, 60, 60, { value })).wait();

            const bobBalanceBeforeWithdrawal = await bob.getBalance();

            await (await contract.withdrawProceeds()).wait();

            const bobBalanceAfterWithdrawal = await bob.getBalance();

            expect(bobBalanceAfterWithdrawal.sub(bobBalanceBeforeWithdrawal)).to.equal(value);
        });
    });

    describe('purchase and brew', () => {
        it('Cannot brew before launch', async () => {
            const aliceAddress = await alice.getAddress();
            await expect(contract.brew([0, 1, 2], 19, aliceAddress)).to.be.revertedWith('NOT_LAUNCHED_YET');
        });

        it('Cannot brew an invalid drug type', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            const aliceAddress = await alice.getAddress();
            await expect(contract.brew([0, 1, 2], 19, aliceAddress)).to.be.revertedWith('INVALID_DRUG_TYPE');
        });

        it('Can brew one of each drug', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);

            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(120);

            const moleculesNeeded = RECIPES.flat().reduce((needed, moleculeType) => {
                needed[moleculeType]++;
                return needed;
            }, new Array(63).fill(0));

            let totalMoleculesNeeded = moleculesNeeded.reduce((sum, value) => sum + value, 0);

            const moleculeIds = new Array(63);

            for (let moleculeType = 0; moleculeType < 63; ++moleculeType) {
                moleculeIds[moleculeType] = [];
            }

            let moleculesMinted = 0;

            while (totalMoleculesNeeded > 0) {
                process.stdout.write(`\r        Purchasing since ${totalMoleculesNeeded} specific molecules still needed...`);

                const tx = await (await contract.purchase(aliceAddress, 120, 0, { value })).wait();

                moleculesMinted += tx.events?.length ?? 0;

                tx.events?.forEach(({ args }) => {
                    const { type } = getTokenFromId(args?.tokenId);

                    moleculeIds[type].push(args?.tokenId);

                    if (!moleculesNeeded[type]) return;

                    moleculesNeeded[type]--;
                    totalMoleculesNeeded--;
                });
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            let moleculesConsumed = 0;

            for (let drugType = 0; drugType <= 18; ++drugType) {
                const recipe = RECIPES[drugType];
                const tokenIds = recipe.map((moleculeType) => moleculeIds[moleculeType].pop());

                process.stdout.write(`\r        Brew ${drugType}: ${((100 * drugType) / 18).toFixed(0)}%`);

                const { canBrew, recipeMolecules } = DRUGS[drugType].getBrewPossibility(tokenIds);

                expect(canBrew).to.be.true;

                recipeMolecules.forEach((element) => expect(element.length).to.be.greaterThan(0));

                const tx = await (await contract.brew(tokenIds, drugType, aliceAddress)).wait();

                moleculesConsumed += tokenIds.length;

                const drugToken = tx.events?.[recipe.length * 2].args?.tokenId;

                tx.events?.forEach(({ event, args }, eventIndex) => {
                    if (eventIndex == recipe.length * 2) {
                        expect(event).to.equal('Transfer');
                        expect(args?.from).to.equal(ethers.constants.AddressZero);
                        expect(args?.to).to.equal(aliceAddress);

                        const { globalType, type, category } = getTokenFromId(args?.tokenId);

                        expect(globalType).to.be.equal(drugType + 63);
                        expect(type).to.equal(drugType);
                        expect(category).to.equal('drug');
                        return;
                    }

                    expect(args?.tokenId).to.equal(tokenIds[eventIndex >> 1]);

                    if (eventIndex % 2 === 0) {
                        expect(event).to.equal('Approval');
                        expect(args?.owner).to.equal(aliceAddress);
                        expect(args?.approved).to.equal(ethers.constants.AddressZero);
                        return;
                    }

                    expect(event).to.equal('Transfer');
                    expect(args?.from).to.equal(aliceAddress);
                    expect(BigNumber.from(args?.to)).to.equal(drugToken);
                });
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            expect(await contract.totalSupply()).to.equal(moleculesMinted + 19);
            expect(await contract.drugsAvailable()).to.equal(1134 - 19);
            expect(await contract.moleculesAvailable()).to.equal(5748 - moleculesMinted);
            expect(await contract.balanceOf(aliceAddress)).to.equal(moleculesMinted - moleculesConsumed + 19);
        }).timeout(1_000_000);

        it('Can brew one of each drug with special water', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);

            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(120);

            const recipesWithRarestReplacedWithSpecialWater = RECIPES
                // replace the last needed molecule (and rarest) with the special water for each recipe
                .map((recipe, drugType) =>
                    recipe.map((moleculeType, index, array) => (index === array.length - 1 ? drugType + 44 : moleculeType))
                )
                // drop the first 8 recipes, which are for isolated drugs
                .slice(8);

            const moleculesNeeded = recipesWithRarestReplacedWithSpecialWater.flat().reduce((needed, moleculeType) => {
                needed[moleculeType]++;
                return needed;
            }, new Array(63).fill(0));

            let totalMoleculesNeeded = moleculesNeeded.reduce((sum, value) => sum + value, 0);

            const moleculeIds = new Array(63);

            for (let moleculeType = 0; moleculeType < 63; ++moleculeType) {
                moleculeIds[moleculeType] = [];
            }

            let moleculesMinted = 0;

            while (totalMoleculesNeeded > 0) {
                process.stdout.write(`\r        Purchasing since ${totalMoleculesNeeded} specific molecules still needed...`);

                const tx = await (await contract.purchase(aliceAddress, 120, 0, { value })).wait();

                moleculesMinted += tx.events?.length ?? 0;

                tx.events?.forEach(({ args }) => {
                    const { type } = getTokenFromId(args?.tokenId);

                    moleculeIds[type].push(args?.tokenId);

                    if (!moleculesNeeded[type]) return;

                    moleculesNeeded[type]--;
                    totalMoleculesNeeded--;
                });
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            let moleculesConsumed = 0;

            for (let drugType = 8; drugType <= 18; ++drugType) {
                const recipe = recipesWithRarestReplacedWithSpecialWater[drugType - 8];
                const tokenIds = recipe.map((moleculeType) => moleculeIds[moleculeType].pop());

                process.stdout.write(`\r        Brew ${drugType}: ${((100 * drugType) / 11).toFixed(0)}%`);

                const tx = await (await contract.brew(tokenIds, drugType, aliceAddress)).wait();

                moleculesConsumed += tokenIds.length;

                const drugToken = tx.events?.[recipe.length * 2].args?.tokenId;

                tx.events?.forEach(({ event, args }, eventIndex) => {
                    if (eventIndex == recipe.length * 2) {
                        expect(event).to.equal('Transfer');
                        expect(args?.from).to.equal(ethers.constants.AddressZero);
                        expect(args?.to).to.equal(aliceAddress);

                        const { globalType, type, category } = getTokenFromId(args?.tokenId);

                        expect(globalType).to.be.equal(drugType + 63);
                        expect(type).to.be.equal(drugType);
                        expect(category).to.equal('drug');
                        return;
                    }

                    expect(args?.tokenId).to.equal(tokenIds[eventIndex >> 1]);

                    if (eventIndex % 2 === 0) {
                        expect(event).to.equal('Approval');
                        expect(args?.owner).to.equal(aliceAddress);
                        expect(args?.approved).to.equal(ethers.constants.AddressZero);
                        return;
                    }

                    expect(event).to.equal('Transfer');
                    expect(args?.from).to.equal(aliceAddress);
                    expect(BigNumber.from(args?.to)).to.equal(drugToken);
                });

                expect(await checkInvariants(contract)).to.be.true;
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            expect(await contract.totalSupply()).to.equal(moleculesMinted + 11);
            expect(await contract.drugsAvailable()).to.equal(1134 - 11);
            expect(await contract.moleculesAvailable()).to.equal(5748 - moleculesMinted);
            expect(await contract.balanceOf(aliceAddress)).to.equal(moleculesMinted - moleculesConsumed + 11);
        }).timeout(1_000_000);
    });

    describe('purchase, brew, and decompose', () => {
        beforeEach(async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
        });

        it('Cannot decompose for token not owned', async () => {
            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint;

            const tx = await (await contract.purchase(aliceAddress, 1, 0, { value })).wait();
            const tokenIds = tx.events?.map(({ args }) => args?.tokenId) as BigNumber[];

            await expect(contract.connect(bob).decompose(tokenIds[0])).to.be.revertedWith('NOT_OWNER');
        });

        it('Cannot decompose for molecule', async () => {
            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint;

            const tx = await (await contract.purchase(aliceAddress, 1, 0, { value })).wait();
            const tokenIds = tx.events?.map(({ args }) => args?.tokenId) as BigNumber[];

            await expect(contract.decompose(tokenIds[0])).to.be.revertedWith('NOT_DRUG');
        });

        it('Can decompose a drug', async () => {
            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(120);
            const moleculesNeeded = [1, 1];
            let totalMoleculesNeeded = 2;
            const moleculeIds = new Array(63);

            for (let moleculeType = 0; moleculeType < 63; ++moleculeType) {
                moleculeIds[moleculeType] = [];
            }

            while (totalMoleculesNeeded > 0) {
                process.stdout.write(`\r        Purchasing since ${totalMoleculesNeeded} specific molecules still needed...`);

                const tx = await (await contract.purchase(aliceAddress, 120, 0, { value })).wait();

                tx.events?.forEach(({ args }) => {
                    const { type } = getTokenFromId(args?.tokenId);

                    moleculeIds[type].push(args?.tokenId);

                    if (!moleculesNeeded[type]) return;

                    moleculesNeeded[type]--;
                    totalMoleculesNeeded--;
                });
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            const tokenIds = [moleculeIds[0].pop(), moleculeIds[1].pop()];
            const brewTx = await (await contract.brew(tokenIds, 0, aliceAddress)).wait();
            const drugToken = brewTx.events?.[4]?.args?.tokenId;
            const decomposeTx = await (await contract.decompose(drugToken)).wait();

            decomposeTx.events?.forEach(({ event, args }, eventIndex, events) => {
                // 4th last event is clearing of water approval
                if (eventIndex == events.length - 4) {
                    expect(event).to.equal('Approval');
                    expect(BigNumber.from(args?.owner)).to.equal(drugToken);
                    expect(args?.approved).to.equal(ethers.constants.AddressZero);
                    expect(args?.tokenId).to.equal(tokenIds[0]);
                    return;
                }

                // 3rd last event is burning of water
                if (eventIndex == events.length - 3) {
                    expect(event).to.equal('Transfer');
                    expect(BigNumber.from(args?.from)).to.equal(drugToken);
                    expect(args?.to).to.equal(ethers.constants.AddressZero);

                    const { globalType, type, category } = getTokenFromId(args?.tokenId);

                    expect(globalType).to.be.equal(0);
                    expect(type).to.equal(0);
                    expect(category).to.equal('molecule');
                    return;
                }

                // 2nd last event is clearing of drug approval
                if (eventIndex == events.length - 2) {
                    expect(event).to.equal('Approval');
                    expect(args?.owner).to.equal(aliceAddress);
                    expect(args?.approved).to.equal(ethers.constants.AddressZero);
                    expect(args?.tokenId).to.equal(drugToken);
                    return;
                }

                // Last event is burning of drug
                if (eventIndex == events.length - 1) {
                    expect(event).to.equal('Transfer');
                    expect(args?.from).to.equal(aliceAddress);
                    expect(args?.to).to.equal(ethers.constants.AddressZero);

                    const { globalType, type, category } = getTokenFromId(args?.tokenId);

                    expect(globalType).to.be.equal(63);
                    expect(type).to.equal(0);
                    expect(category).to.equal('drug');
                    return;
                }

                expect(args?.tokenId).to.equal(tokenIds[1 - (eventIndex >> 1)]);

                if (eventIndex % 2 === 0) {
                    expect(event).to.equal('Approval');
                    expect(BigNumber.from(args?.owner)).to.equal(drugToken);
                    expect(args?.approved).to.equal(ethers.constants.AddressZero);
                    return;
                }

                expect(event).to.equal('Transfer');
                expect(BigNumber.from(args?.from)).to.equal(drugToken);
                expect(args?.to).to.equal(aliceAddress);
            });

            await expect(contract.ownerOf(drugToken)).to.be.revertedWith('ERC721: invalid token ID');
            await expect(contract.ownerOf(tokenIds[0])).to.be.revertedWith('ERC721: invalid token ID');
            expect(await contract.ownerOf(tokenIds[1])).to.equal(aliceAddress);

            expect(await checkInvariants(contract)).to.be.true;
        }).timeout(1_000_000);
    });

    describe('claim water', () => {
        it('Cannot claim water if not whitelisted', async () => {
            await expect(contract.connect(charlie).claimWater(await charlie.getAddress())).to.be.revertedWith('CANNOT_CLAIM');
        });

        it('Can claim water before launch, if added to whitelisted', async () => {
            await (await contract.setPromotionAccounts([await bob.getAddress(), await charlie.getAddress()])).wait();
            const tx1 = await (await contract.connect(bob).claimWater(await bob.getAddress())).wait();
            const tx2 = await (await contract.connect(charlie).claimWater(await charlie.getAddress())).wait();

            expect(tx1.events?.[0].args?.to).to.equal(await bob.getAddress());
            expect(getTokenFromId(tx1.events?.[0].args?.tokenId).type).to.equal(0);
            expect(tx2.events?.[0].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx2.events?.[0].args?.tokenId).type).to.equal(0);
        });

        it('Cannot claim water if removed from whitelisted', async () => {
            await (await contract.setPromotionAccounts([await bob.getAddress(), await charlie.getAddress()])).wait();
            await (await contract.unsetPromotionAccounts([await charlie.getAddress()])).wait();
            await (await contract.connect(bob).claimWater(await bob.getAddress())).wait();
            await expect(contract.connect(charlie).claimWater(await charlie.getAddress())).to.be.revertedWith('CANNOT_CLAIM');
        });

        it('Cannot claim water after launch', async () => {
            await (await contract.setPromotionAccounts([await bob.getAddress(), await charlie.getAddress()])).wait();

            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            await expect(contract.connect(charlie).claimWater(await charlie.getAddress())).to.be.revertedWith('CANNOT_CLAIM');
        });
    });

    describe('give waters and random molecules', () => {
        it('Cannot give water as non-owner', async () => {
            await expect(contract.connect(charlie).giveWaters([await charlie.getAddress()], [1])).to.be.revertedWith('UNAUTHORIZED');
        });

        it('Cannot give molecules as non-owner', async () => {
            await expect(contract.connect(charlie).giveWaters([await charlie.getAddress()], [1])).to.be.revertedWith('UNAUTHORIZED');
        });

        it('Can give water before launch', async () => {
            const destinations = [await bob.getAddress(), await charlie.getAddress()];
            const amounts = [1, 4];

            const tx = await (await contract.giveWaters(destinations, amounts, { gasLimit: 1000000 })).wait();

            expect(tx.events?.[0].args?.to).to.equal(await bob.getAddress());
            expect(getTokenFromId(tx.events?.[0].args?.tokenId).globalType).to.equal(0);

            expect(tx.events?.[1].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx.events?.[1].args?.tokenId).globalType).to.equal(0);

            expect(tx.events?.[2].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx.events?.[2].args?.tokenId).globalType).to.equal(0);

            expect(tx.events?.[3].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx.events?.[3].args?.tokenId).globalType).to.equal(0);

            expect(tx.events?.[4].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx.events?.[4].args?.tokenId).globalType).to.equal(0);
        });

        it('Can give water before launch', async () => {
            const destinations = [await bob.getAddress(), await charlie.getAddress()];
            const amounts = [1, 4];

            const tx = await (await contract.giveMolecules(destinations, amounts, { gasLimit: 1000000 })).wait();

            expect(tx.events?.[0].args?.to).to.equal(await bob.getAddress());
            expect(getTokenFromId(tx.events?.[0].args?.tokenId).category).to.equal('molecule');

            expect(tx.events?.[1].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx.events?.[1].args?.tokenId).category).to.equal('molecule');

            expect(tx.events?.[2].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx.events?.[2].args?.tokenId).category).to.equal('molecule');

            expect(tx.events?.[3].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx.events?.[3].args?.tokenId).category).to.equal('molecule');

            expect(tx.events?.[4].args?.to).to.equal(await charlie.getAddress());
            expect(getTokenFromId(tx.events?.[4].args?.tokenId).category).to.equal('molecule');
        });

        it('Cannot give water after launch', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            await expect(contract.giveWaters([await charlie.getAddress()], [1])).to.be.revertedWith('ALREADY_LAUNCHED');
        });

        it('Cannot give molecules after launch', async () => {
            await ethers.provider.send('evm_increaseTime', [launchTimestamp - (await getBlockTimestamp())]);
            await expect(contract.giveWaters([await charlie.getAddress()], [1])).to.be.revertedWith('ALREADY_LAUNCHED');
        });
    });
});
