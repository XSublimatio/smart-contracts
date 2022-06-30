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
    const compactState3 = await instance.COMPACT_STATE_3();
    const drugsAvailable = compactState3.shr(152).mask(11);
    const moleculesAvailable = compactState3.shr(163).mask(13);

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

describe('XSublimatio', () => {
    const pricePerTokenMint = ethers.utils.parseUnits('0.2', 'ether');
    const contractURI = 'http://127.0.0.1:8080/';

    let contract: XSublimatio;
    let alice: Signer;
    let bob: Signer;
    let charlie: Signer;

    beforeEach(async () => {
        [alice, bob, charlie] = await ethers.getSigners();

        const contractFactory = new XSublimatio__factory(alice);

        contract = await contractFactory.deploy(contractURI, await alice.getAddress(), await bob.getAddress(), pricePerTokenMint, 0);

        await contract.deployed();
    });

    it('Correctly initialized', async () => {
        expect(contract.address).to.properAddress;

        expect(await contract.name()).to.equal('XSublimatio');
        expect(await contract.symbol()).to.equal('XSUB');
        expect(await contract.totalSupply()).to.equal(0);

        expect(await contract.PROCEEDS_DESTINATION()).to.equal(await bob.getAddress());
        expect(await contract.PRICE_PER_TOKEN_MINT()).to.equal(pricePerTokenMint);
        expect(await contract.LAUNCH_TIMESTAMP()).to.equal(0);

        expect(await contract.owner()).to.equal(await alice.getAddress());
        expect(await contract.pendingOwner()).to.equal(ethers.constants.AddressZero);
        expect(await contract.baseURI()).to.equal('http://127.0.0.1:8080/');

        expect(await contract.COMPACT_STATE_1()).to.equal('60087470205620319587750252891185586116542855063423969629534558109603704138');
        expect(await contract.COMPACT_STATE_2()).to.equal('114873104402099400223353432978706708436353982610412083425164130989245597730');
        expect(await contract.COMPACT_STATE_3()).to.equal('67212165445492353831982701316699907697777805738906362');

        const [moleculeAvailabilities, drugAvailabilities] = await contract.availabilities();

        expect(moleculeAvailabilities.map((x) => x.toNumber())).to.deep.equal(MOLECULE_MAX_SUPPLIES);
        expect(drugAvailabilities.map((x) => x.toNumber())).to.deep.equal(DRUG_MAX_SUPPLIES);

        expect(await contract.contractURI()).to.equal(`${contractURI}info`);
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

    describe('purchase', () => {
        // TODO: test NO_MOLECULES_AVAILABLE (difficult setup)

        it('Cannot purchase molecules if cannot fullfil request', async () => {
            const aliceAddress = await alice.getAddress();
            await expect(contract.purchase(aliceAddress, 5749, 5749)).to.be.revertedWith('CANNOT_FULLFIL_REQUEST');
        });

        it('Cannot purchase molecules if insufficient funds provided', async () => {
            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint.mul(4);
            await expect(contract.purchase(aliceAddress, 5, 5, { value })).to.be.revertedWith('INCORRECT_VALUE');
        });

        it('Can purchase a batch of 5 molecules', async () => {
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

        it('Can purchase all molecules in batchers of 120', async () => {
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
    });

    describe('purchase and brew', () => {
        it('Cannot brew an invalid drug type', async () => {
            const aliceAddress = await alice.getAddress();
            await expect(contract.brew([0, 1, 2], 19, aliceAddress)).to.be.revertedWith('INVALID_DRUG_TYPE');
        });

        // TODO: test DRUG_NOT_AVAILABLE (difficult starting condition)

        // TODO: test NOT_OWNER (difficult starting condition)

        // TODO: test INVALID_MOLECULE (difficult starting condition)

        it('Can brew one of each drug', async () => {
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
        it('Cannot decompose for token not owned', async () => {
            const aliceAddress = await alice.getAddress();
            const value = pricePerTokenMint;

            const tx = await (await contract.purchase(aliceAddress, 1, 0, { value })).wait();
            const tokenIds = tx.events?.map(({ args }) => args?.tokenId) as BigNumber[];

            await expect(contract.connect(bob).decompose(tokenIds[0])).to.be.revertedWith('NOT_OWNER');
        });
    });
});
