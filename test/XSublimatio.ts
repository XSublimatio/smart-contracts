import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { XSublimatio__factory, XSublimatio, RECIPES, Molecule, Drug, getTokenFromId } from '../src';
import { BigNumber, Signer } from 'ethers';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('XSublimatio', () => {
    let contract: XSublimatio;
    let alice: Signer;
    let bob: Signer;
    let charlie: Signer;

    beforeEach(async () => {
        [alice, bob, charlie] = await ethers.getSigners();

        const contractFactory = new XSublimatio__factory(alice);

        contract = await contractFactory.deploy('http://127.0.0.1:8080/', await alice.getAddress());
        await contract.deployed();

        expect(contract.address).to.properAddress;
        expect(await contract.baseURI()).to.equal('http://127.0.0.1:8080/');
        expect(await contract.name()).to.equal('XSublimatio');
        expect(await contract.symbol()).to.equal('XSUB');
        expect(await contract.drugsAvailable()).to.equal(1134);
        expect(await contract.moleculesAvailable()).to.equal(3480);
    });

    describe('purchase', () => {
        // TODO: test NO_MOLECULES_AVAILABLE (difficult setup)

        it('Cannot purchase molecules if cannot fullfil request', async () => {
            const aliceAddress = await alice.getAddress();
            await expect(contract.purchase(aliceAddress, 6)).to.be.revertedWith('CANNOT_FULLFIL_REQUEST');
        });

        it('Cannot purchase molecules if insufficient funds provided', async () => {
            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('0.99999999');
            await expect(contract.purchase(aliceAddress, 5, { value })).to.be.revertedWith('INCORRECT_VALUE');
        });

        it('Can purchase molecules', async () => {
            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('1.0');
            const tx = await (await contract.purchase(aliceAddress, 5, { value })).wait();

            expect(await contract.totalSupply()).to.equal(5);
            expect(await contract.moleculesAvailable()).to.equal(3480 - 5);
            expect(await contract.balanceOf(aliceAddress)).to.equal(5);

            tx.events?.forEach(({ event, args }) => {
                expect(event).to.equal('Transfer');
                expect(args?.from).to.equal(ethers.constants.AddressZero);
                expect(args?.to).to.equal(aliceAddress);

                const token = getTokenFromId(args?.tokenId) as Molecule;

                expect(token?.type).to.be.lessThan(63);
                expect(token?.category).to.equal('molecule');
                expect(token?.moleculeType).to.lessThan(63);
            });
        });

        it('Can purchase all molecules', async () => {
            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('1.0');

            for (let i = 1; i <= 696; ++i) {
                process.stdout.write(`\r        Purchase ${i}: ${((100 * i) / 696).toFixed(0)}%`);
                const tx = await (await contract.purchase(aliceAddress, 0, { value })).wait();
                expect(tx.events?.length).to.equal(5);
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            expect(await contract.totalSupply()).to.equal(3480);
            expect(await contract.moleculesAvailable()).to.equal(0);
            expect(await contract.balanceOf(aliceAddress)).to.equal(3480);

            for (let moleculeType = 0; moleculeType < 63; ++moleculeType) {
                expect(await contract.getMoleculeAvailability(moleculeType)).to.equal(0);
            }
        }).timeout(1_000_000);
    });

    describe('purchase and brew', () => {
        beforeEach(async () => {
            await (await contract.enableBrewing()).wait();
        });

        it('Cannot brew an invalid drug type', async () => {
            const aliceAddress = await alice.getAddress();
            await expect(contract.brew([0, 1, 2], 19, aliceAddress)).to.be.revertedWith('INVALID_DRUG_TYPE');
        });

        // TODO: test DRUG_NOT_AVAILABLE (difficult starting condition)

        // TODO: test NOT_OWNER (difficult starting condition)

        // TODO: test INVALID_MOLECULE (difficult starting condition)

        it('Can brew one of each drug', async () => {
            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('1.0');

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

                const tx = await (await contract.purchase(aliceAddress, 0, { value })).wait();

                moleculesMinted += tx.events?.length ?? 0;

                tx.events?.forEach(({ args }) => {
                    const token = getTokenFromId(args?.tokenId) as Molecule;

                    moleculeIds[token?.moleculeType].push(args?.tokenId);

                    if (!moleculesNeeded[token?.moleculeType]) return;

                    moleculesNeeded[token?.moleculeType]--;
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

                const tx = await (await contract.brew(tokenIds, drugType, aliceAddress)).wait();

                moleculesConsumed += tokenIds.length;

                tx.events?.forEach(({ event, args }, eventIndex) => {
                    if (eventIndex == recipe.length * 2) {
                        expect(event).to.equal('Transfer');
                        expect(args?.from).to.equal(ethers.constants.AddressZero);
                        expect(args?.to).to.equal(aliceAddress);

                        const token = getTokenFromId(args?.tokenId) as Drug;

                        expect(token?.type).to.be.equal(drugType + 63);
                        expect(token?.category).to.equal('drug');
                        expect(token?.drugType).to.lessThan(19);
                        expect(token?.specialWaterIndex).to.equal(0);
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
                    expect(args?.to).to.equal(ethers.constants.AddressZero);
                });
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            expect(await contract.totalSupply()).to.equal(moleculesMinted - moleculesConsumed + 19);
            expect(await contract.drugsAvailable()).to.equal(1134 - 19);
            expect(await contract.moleculesAvailable()).to.equal(3480 - moleculesMinted);
            expect(await contract.balanceOf(aliceAddress)).to.equal(moleculesMinted - moleculesConsumed + 19);
        }).timeout(1_000_000);

        it('Can brew one of each drug with special water', async () => {
            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('1.0');

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

                const tx = await (await contract.purchase(aliceAddress, 0, { value })).wait();

                moleculesMinted += tx.events?.length ?? 0;

                tx.events?.forEach(({ args }) => {
                    const token = getTokenFromId(args?.tokenId) as Molecule;

                    moleculeIds[token?.moleculeType].push(args?.tokenId);

                    if (!moleculesNeeded[token?.moleculeType]) return;

                    moleculesNeeded[token?.moleculeType]--;
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

                tx.events?.forEach(({ event, args }, eventIndex) => {
                    if (eventIndex == recipe.length * 2) {
                        expect(event).to.equal('Transfer');
                        expect(args?.from).to.equal(ethers.constants.AddressZero);
                        expect(args?.to).to.equal(aliceAddress);

                        const token = getTokenFromId(args?.tokenId) as Drug;

                        expect(token?.type).to.be.equal(drugType + 63);
                        expect(token?.category).to.equal('drug');
                        expect(token?.drugType).to.lessThan(19);
                        expect(token?.specialWaterIndex).to.equal(recipe.length);
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
                    expect(args?.to).to.equal(ethers.constants.AddressZero);
                });
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            expect(await contract.totalSupply()).to.equal(moleculesMinted - moleculesConsumed + 11);
            expect(await contract.drugsAvailable()).to.equal(1134 - 11);
            expect(await contract.moleculesAvailable()).to.equal(3480 - moleculesMinted);
            expect(await contract.balanceOf(aliceAddress)).to.equal(moleculesMinted - moleculesConsumed + 11);
        }).timeout(1_000_000);
    });

    describe('purchase, brew, startDecomposition, and decompose', () => {
        beforeEach(async () => {
            await (await contract.enableBrewing()).wait();
            await (await contract.enableConsumingFor(await alice.getAddress())).wait();
        });

        it('Cannot startDecomposition for non-consumer', async () => {
            const bobAddress = await bob.getAddress();
            const value = ethers.utils.parseUnits('1.0');

            const tx = await (await contract.connect(bob).purchase(bobAddress, 0, { value })).wait();
            const tokenIds = tx.events?.map(({ args }) => args?.tokenId) as BigNumber[];

            await expect(contract.connect(bob).startDecomposition(tokenIds[0])).to.be.revertedWith('CONSUMER_NOT_ENABLED');
        });

        it('Cannot startDecomposition for token not owned', async () => {
            await (await contract.enableConsumingFor(await bob.getAddress())).wait();

            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('1.0');

            const tx = await (await contract.purchase(aliceAddress, 0, { value })).wait();
            const tokenIds = tx.events?.map(({ args }) => args?.tokenId) as BigNumber[];

            await expect(contract.connect(bob).startDecomposition(tokenIds[0])).to.be.revertedWith('NOT_OWNER');
        });

        it('Cannot startDecomposition for molecule', async () => {
            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('1.0');

            const tx = await (await contract.purchase(aliceAddress, 0, { value })).wait();
            const tokenIds = tx.events?.map(({ args }) => args?.tokenId) as BigNumber[];

            await expect(contract.startDecomposition(tokenIds[0])).to.be.revertedWith('NOT_DRUG');
        });

        it('Can decompose a drug', async () => {
            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('1.0');
            const moleculesNeeded = [1, 1];
            let totalMoleculesNeeded = 2;
            const moleculeIds = new Array(63);

            for (let moleculeType = 0; moleculeType < 63; ++moleculeType) {
                moleculeIds[moleculeType] = [];
            }

            while (totalMoleculesNeeded > 0) {
                process.stdout.write(`\r        Purchasing since ${totalMoleculesNeeded} specific molecules still needed...`);

                const tx = await (await contract.purchase(aliceAddress, 0, { value })).wait();

                tx.events?.forEach(({ args }) => {
                    const token = getTokenFromId(args?.tokenId) as Molecule;

                    moleculeIds[token?.moleculeType].push(args?.tokenId);

                    if (!moleculesNeeded[token?.moleculeType]) return;

                    moleculesNeeded[token?.moleculeType]--;
                    totalMoleculesNeeded--;
                });
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            const tokenIds = [moleculeIds[0].pop(), moleculeIds[1].pop()];
            const brewTx = await (await contract.brew(tokenIds, 0, aliceAddress)).wait();
            const drugToken = brewTx.events?.[4]?.args?.tokenId;

            const startDecompositionTx = await (await contract.startDecomposition(drugToken)).wait();
            const decompositionEvent = startDecompositionTx.events?.[0];

            expect(decompositionEvent?.event).to.equal('DecompositionStarted');
            expect(decompositionEvent?.args?.owner).to.equal(aliceAddress);
            expect(decompositionEvent?.args?.tokenId).to.equal(drugToken);

            const { timestamp } = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());

            expect(decompositionEvent?.args?.burnDate).to.equal(timestamp + 864000);
            expect(await contract.ownerOf(drugToken)).to.equal(contract.address);

            await ethers.provider.send('evm_increaseTime', [864000]);

            const molecule0Availability = await contract.getMoleculeAvailability(0);
            const molecule1Availability = await contract.getMoleculeAvailability(1);

            const decomposeTx = await (await contract.decompose(drugToken)).wait();
            const burnEvent = decomposeTx.events?.[1];

            expect(burnEvent?.event).to.equal('Transfer');
            expect(burnEvent?.args?.from).to.equal(contract.address);
            expect(burnEvent?.args?.to).to.equal(ethers.constants.AddressZero);
            expect(burnEvent?.args?.tokenId).to.equal(drugToken);

            expect(await contract.getMoleculeAvailability(0)).to.equal(molecule0Availability.add(1));
            expect(await contract.getMoleculeAvailability(1)).to.equal(molecule1Availability.add(1));
            expect(await contract.getDrugAvailability(0)).to.equal(250);
        }).timeout(1_000_000);

        it('Can decompose a drug with a special water', async () => {
            const aliceAddress = await alice.getAddress();
            const value = ethers.utils.parseUnits('1.0');

            const moleculesNeeded = new Array(63).fill(0);
            moleculesNeeded[0] = 1;
            moleculesNeeded[3] = 1;
            moleculesNeeded[60] = 1;

            let totalMoleculesNeeded = 3;
            const moleculeIds = new Array(63);

            for (let moleculeType = 0; moleculeType < 63; ++moleculeType) {
                moleculeIds[moleculeType] = [];
            }

            while (totalMoleculesNeeded > 0) {
                process.stdout.write(`\r        Purchasing since ${totalMoleculesNeeded} specific molecules still needed...`);

                const tx = await (await contract.purchase(aliceAddress, 0, { value })).wait();

                tx.events?.forEach(({ args }) => {
                    const token = getTokenFromId(args?.tokenId) as Molecule;

                    moleculeIds[token?.moleculeType].push(args?.tokenId);

                    if (!moleculesNeeded[token?.moleculeType]) return;

                    moleculesNeeded[token?.moleculeType]--;
                    totalMoleculesNeeded--;
                });
            }

            process.stdout.write(`\r                                                                                                    `);
            process.stdout.write(`\r`);

            const tokenIds = [moleculeIds[0].pop(), moleculeIds[3].pop(), moleculeIds[60].pop()];
            const brewTx = await (await contract.brew(tokenIds, 16, aliceAddress)).wait();
            const drugToken = brewTx.events?.[6]?.args?.tokenId;

            const startDecompositionTx = await (await contract.startDecomposition(drugToken)).wait();
            const decompositionEvent = startDecompositionTx.events?.[0];

            expect(decompositionEvent?.event).to.equal('DecompositionStarted');
            expect(decompositionEvent?.args?.owner).to.equal(aliceAddress);
            expect(decompositionEvent?.args?.tokenId).to.equal(drugToken);

            const { timestamp } = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());

            expect(decompositionEvent?.args?.burnDate).to.equal(timestamp + 864000);
            expect(await contract.ownerOf(drugToken)).to.equal(contract.address);

            await ethers.provider.send('evm_increaseTime', [864000]);

            const molecule0Availability = await contract.getMoleculeAvailability(0);
            const molecule3Availability = await contract.getMoleculeAvailability(3);
            const molecule60Availability = await contract.getMoleculeAvailability(60);

            const decomposeTx = await (await contract.decompose(drugToken)).wait();
            const burnEvent = decomposeTx.events?.[1];

            expect(burnEvent?.event).to.equal('Transfer');
            expect(burnEvent?.args?.from).to.equal(contract.address);
            expect(burnEvent?.args?.to).to.equal(ethers.constants.AddressZero);
            expect(burnEvent?.args?.tokenId).to.equal(drugToken);

            expect(await contract.getMoleculeAvailability(0)).to.equal(molecule0Availability.add(1));
            expect(await contract.getMoleculeAvailability(3)).to.equal(molecule3Availability.add(1));
            expect(await contract.getMoleculeAvailability(60)).to.equal(molecule60Availability.add(1));
            expect(await contract.getDrugAvailability(0)).to.equal(250);
        }).timeout(1_000_000);
    });

    describe('getters', () => {
        it('Can provide correct recipes', async () => {
            for (let drugType = 0; drugType < 19; ++drugType) {
                const recipe = await contract.getRecipe(drugType);
                expect(recipe).to.deep.equal(RECIPES[drugType]);
            }
        });
    });
});
