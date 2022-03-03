import { BigNumber } from 'ethers';

export const MOLECULE_MAX_SUPPLIES: number[] = [
    1134, 250, 142, 121, 121, 120, 120, 120, 107, 97, 95, 95, 95, 95, 82, 50, 36, 36, 36, 34, 34, 34, 32, 32, 32, 29, 29, 29, 29, 24, 24,
    21, 20, 18, 12, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

export const DRUG_MAX_SUPPLIES: number[] = [250, 18, 100, 21, 50, 20, 142, 50, 7, 24, 95, 120, 34, 2, 29, 12, 121, 32, 7];

export const RECIPES: number[][] = [
    [0, 1],
    [0, 33],
    [0, 8],
    [0, 31],
    [0, 15],
    [0, 32],
    [0, 2],
    [0, 14],
    [0, 8, 37, 38, 39, 43, 44],
    [0, 16, 17, 18, 29, 30],
    [0, 9, 10, 11, 12, 13],
    [0, 5, 6, 7],
    [0, 19, 20, 21],
    [0, 9, 45, 46, 47, 48, 49, 50, 51],
    [0, 25, 26, 27, 28],
    [0, 16, 17, 18, 34],
    [0, 3, 4],
    [0, 14, 22, 23, 24],
    [0, 35, 36, 40, 41, 42],
];

export const MOLECULE_NAMES: string[] = [
    'Water',
    'Alcohol',
    'Methamphetamine',
    'Caffeine',
    'Theobromine',
    'Cathine',
    'Cathinone',
    'Methcathinone',
    'Cocaine',
    'CBD',
    'CBC',
    'CBG',
    'CBN',
    'THC',
    'Morphine',
    'Ketamine',
    'Atropine',
    'Hyoscyamine',
    'Scopolamine',
    'Lactucine',
    'Lactucopicrin',
    'Lactuside-A',
    'Codeine',
    'Noscapine',
    'Papaverine',
    'Baeocystin',
    'Norbaeocystin',
    'Psilocin',
    'Psilocybin',
    'Belladonnine',
    'Scopoletol',
    'GHB',
    'LSD',
    'Chloroquine',
    'Mandragorin',
    'Divinatorin-A',
    'Divinatorin-B',
    'DMT',
    'Harmol',
    'Nicotine',
    'Salvidivin-B',
    'Salvinicin-A',
    'Salvinorin-A',
    'Telepathine',
    'Tetrahydroharmine',
    'Acetylcholine',
    'Dopamine',
    'Dynorphin',
    'Enkephalin',
    'MDMA',
    'Oxytocin',
    'Phenethylamine',
    'Water (Ayahuasca)',
    'Water (Belladonna)',
    'Water (Cannabis)',
    'Water (Khat)',
    'Water (Lactuca Virosa)',
    'Water (Love Elixir)',
    'Water (Magic Truffle)',
    'Water (Mandrake)',
    'Water (Mate)',
    'Water (Opium)',
    'Water (Salvia Divinorum)',
];

export const DRUG_NAMES: string[] = [
    'Alcohol (Isolated)',
    'Chloroquine (Isolated)',
    'Cocaine (Isolated)',
    'GHB (Isolated)',
    'Ketamine (Isolated)',
    'LSD (Isolated)',
    'Methamphetamine (Isolated)',
    'Morphine (Isolated)',
    'Ayahuasca',
    'Belladonna',
    'Cannabis',
    'Khat',
    'Lactuca Virosa',
    'Love Elixir',
    'Magic Truffle',
    'Mandrake',
    'Mate',
    'Opium',
    'Salvia Divinorum',
];

export interface Token {
    type: number;
    seed: BigNumber;
    category: 'molecule' | 'drug';
    name: string;
}

export interface Molecule extends Token {
    moleculeType: number;
}

export interface Drug extends Token {
    drugType: number;
    specialWaterIndex: number;
}

export function getTokenFromId(tokenId: BigNumber): Molecule | Drug {
    const type = tokenId.shr(248).toNumber();
    const seed = tokenId.mask(240);

    return type < 63
        ? {
              type,
              seed,
              category: 'molecule',
              name: MOLECULE_NAMES[type],
              moleculeType: type,
          }
        : {
              type,
              seed,
              category: 'drug',
              name: DRUG_NAMES[type - 63],
              drugType: type - 63,
              specialWaterIndex: tokenId.shr(240).mask(8).toNumber(),
          };
}

export function canBrew(drugType: number, tokenIds: BigNumber[]): boolean {
    const molecules = tokenIds.map(getTokenFromId).filter(({ category }) => category === 'molecule');

    return RECIPES[drugType].reduce(
        (accumulator: boolean, moleculeType: number) => accumulator && !!molecules.find(({ type }) => type === moleculeType),
        true
    );
}

// TODO: metadata
