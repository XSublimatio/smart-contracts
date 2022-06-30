import { MOLECULE_MAX_SUPPLIES, MOLECULE_MAX_SUPPLY, DRUG_MAX_SUPPLIES, DRUG_MAX_SUPPLY } from '../src';

const totalMolecules = MOLECULE_MAX_SUPPLIES.reduce((sum, quantity) => sum + quantity, 0);

if (MOLECULE_MAX_SUPPLY !== totalMolecules) throw 'MOLECULE_MAX_SUPPLY mismatch';

const totalDrugs = DRUG_MAX_SUPPLIES.reduce((sum, quantity) => sum + quantity, 0);

if (DRUG_MAX_SUPPLY !== totalDrugs) throw 'DRUG_MAX_SUPPLY mismatch';

// First 21 molecule quantities are stored as 12-bit values in first compact state.
const COMPACT_STATE_1 = MOLECULE_MAX_SUPPLIES.slice(0, 21).reduce(
    (constant, maxSupply, index) => constant + (BigInt(maxSupply) << BigInt(index * 12)),
    BigInt(0)
);

// Last 42 molecule quantities are stored as 6-bit values in second compact state.
const COMPACT_STATE_2 = MOLECULE_MAX_SUPPLIES.slice(21, 63).reduce(
    (constant, maxSupply, index) => constant + (BigInt(maxSupply) << BigInt(index * 6)),
    BigInt(0)
);

// 19 drug quantities are stored as 8-bit values in third compact state.
// Total drug quantity is stored as 11-bit values in third compact state.
// Total molecule quantity is stored as 13-bit values in third compact state.
// 80 remaining bits in this compact state is the token nonce.
const COMPACT_STATE_3 =
    DRUG_MAX_SUPPLIES.reduce((constant, maxSupply, index) => constant + (BigInt(maxSupply) << BigInt(index * 8)), BigInt(0)) +
    (BigInt(totalDrugs) << BigInt(152)) +
    (BigInt(totalMolecules) << BigInt(152 + 11));

console.log(`COMPACT_STATE_1: ${COMPACT_STATE_1}`);
console.log(`COMPACT_STATE_2: ${COMPACT_STATE_2}`);
console.log(`COMPACT_STATE_3: ${COMPACT_STATE_3}`);
