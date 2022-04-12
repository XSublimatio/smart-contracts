import { MOLECULE_MAX_SUPPLIES, MOLECULE_MAX_SUPPLY, DRUG_MAX_SUPPLIES, DRUG_MAX_SUPPLY } from '../src';

const totalMolecules = MOLECULE_MAX_SUPPLIES.reduce((sum, quantity) => sum + quantity, 0);

if (MOLECULE_MAX_SUPPLY !== totalMolecules) throw 'MOLECULE_MAX_SUPPLY mismatch';

const totalDrugs = DRUG_MAX_SUPPLIES.reduce((sum, quantity) => sum + quantity, 0);

if (DRUG_MAX_SUPPLY !== totalDrugs) throw 'DRUG_MAX_SUPPLY mismatch';

const COMPACT_STATE_1 = MOLECULE_MAX_SUPPLIES.slice(0, 23).reduce(
    (constant, maxSupply, index) => constant + (BigInt(maxSupply) << BigInt(index * 11)),
    BigInt(0)
);

const COMPACT_STATE_2 = MOLECULE_MAX_SUPPLIES.slice(23, 46).reduce(
    (constant, maxSupply, index) => constant + (BigInt(maxSupply) << BigInt(index * 11)),
    BigInt(0)
);

const COMPACT_STATE_3 =
    MOLECULE_MAX_SUPPLIES.slice(46).reduce(
        (constant, maxSupply, index) => constant + (BigInt(maxSupply) << BigInt(index * 11)),
        BigInt(0)
    ) +
    (BigInt(totalMolecules) << BigInt(MOLECULE_MAX_SUPPLIES.slice(46).length * 11));

const COMPACT_STATE_4 =
    DRUG_MAX_SUPPLIES.reduce((constant, maxSupply, index) => constant + (BigInt(maxSupply) << BigInt(index * 8)), BigInt(0)) +
    (BigInt(totalDrugs) << BigInt(DRUG_MAX_SUPPLIES.length * 8));

console.log(`COMPACT_STATE_1: ${COMPACT_STATE_1}`);
console.log(`COMPACT_STATE_2: ${COMPACT_STATE_2}`);
console.log(`COMPACT_STATE_3: ${COMPACT_STATE_3}`);
console.log(`COMPACT_STATE_4: ${COMPACT_STATE_4}`);
