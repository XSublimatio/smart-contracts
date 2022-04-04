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
    'Lactupicrin',
    'Lactuside A',
    'Codeine',
    'Noscapine',
    'Papaverine',
    'Baeocystin',
    'Norbaeocystin',
    'Psilocin',
    'Psilocybine',
    'Belladonnine',
    'Scopoletin',
    'GHB',
    'LSD',
    'Chloroquine',
    'Mandragorin',
    'Divinatorin A',
    'Divinatorin B',
    'DMT',
    'Harmol',
    'Nicotine',
    'Salvidivin B',
    'Salvinicin A',
    'Salvinorin A',
    'Harmine',
    'Tetrahydroharmine',
    'Acetylcholine',
    'Dopamine',
    'Dynorphin',
    'Metenkephalin',
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

export const MOLECULE_FORMULAS: string[] = [
    'H2_O',
    'CH3_CH2_O_H',
    'C10_H15_N',
    'C8_H10_N4_O2',
    'C7_H8_N4_O2',
    'C9_H13_N_O',
    'C9_H11_N_O',
    'C10_H13_N_O',
    'C17_H21_N_O4',
    'C21_H30_O2',
    'C21_H30_O2',
    'C21_H32_O2',
    'C21_H26_O2',
    'C21_H30_O2',
    'C17_H19_N_O3',
    'C13_H16_Cl_N_O',
    'C17_H23_N_O3',
    'C17_H23_N_O3',
    'C17_H21_N_O4',
    'C15_H16_O5',
    'C23_H22_O7',
    'C21_H30_O9',
    'C18_H21_N_O3',
    'C22_H23_N_O7',
    'C20_H22_Cl_N_O4',
    'C11_H15_N2_O4_P',
    'C10_H13_N2_O4_P',
    'C12_H16_N2_O',
    'C12_H17_N2_O4_P',
    'C34_H42_N2_O4',
    'C10_H8_O4',
    'C4_H8_O3',
    'C20_H25_N3_O',
    'C18_H26_Cl_N3',
    'C13_H24_N2_O',
    'C20_H28_O4',
    'C21_H30_O5',
    'C12_H16_N2',
    'C12_H10_N2_O',
    'C10_H14_N2',
    'C23_H28_O10',
    'C25_H36_O12',
    'C23_H28_O8',
    'C13_H12_N2_O',
    'C13_H16_N2_O',
    'C7_H16_N_O2+',
    'C8_H11_N_O2',
    'C99_H155_N31_O23',
    'C27_H35_N5_O7_S',
    'C11_H16_Cl_N_O2',
    'C43_H66_N12_O12_S2',
    'C8_H11_N',
    'H2_O',
    'H2_O',
    'H2_O',
    'H2_O',
    'H2_O',
    'H2_O',
    'H2_O',
    'H2_O',
    'H2_O',
    'H2_O',
    'H2_O',
];

export const DRUG_NAMES: string[] = [
    'Alcohol (Iso)',
    'Chloroquine (Iso)',
    'Cocaine (Iso)',
    'GHB (Iso)',
    'Ketamine (Iso)',
    'LSD (Iso)',
    'Methamphetamine (Iso)',
    'Morphine (Iso)',
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

export const DRUG_DESCRIPTIONS: string[] = [
    'GABA receptor',
    'Chloroquine resistance transporter',
    'Noradrenaline transporter',
    'IP03705p',
    'NMDA 1',
    '5-HT2A receptor',
    'TAAR1',
    'Opioid receptor',
    'Acetylcholinesterase',
    'Acetylcholine receptor',
    'Cannabinoid receptor',
    'Adrenergic receptor',
    'PTGS2',
    'Oxytocin receptor',
    'Serotonin receptor',
    'Dopamine transporter',
    'Adenosine receptor',
    'Kappa-type opioid receptor',
    'Delta-type opioid receptor',
];

export const MOLECULE_LIGHTING_TYPES: string[] = ['Mixed', 'Zones'];

export const MOLECULE_INTEGRITY_TYPES: string[] = ['Medium', 'High', 'Very High', 'Full'];

export const DEFORMATION_TYPES: string[] = ['None', 'Medium', 'High'];

export const STRIPES_COLOR_SHIFT_TYPES: string[] = ['Off', 'On'];

export const STRIPES_AMOUNT_TYPES: string[] = ['Low', 'Medium', 'High'];

export const BLOB_TYPES: string[] = ['Triangle', 'Square', 'Circle'];

export const PALETTE_TYPES: string[] = ['Monochrome', 'Analogous', 'Complementary', 'S-Complementary', 'Triadic', 'Square'];

export interface Token {
    id: string;
    type: number;
    category: 'molecule' | 'drug';
    name: string;
}

export interface Molecule extends Token {
    moleculeType: number;
    formula: string;
}

export interface Drug extends Token {
    drugType: number;
    specialWaterIndex: number;
    description: string;
}

export interface Attribute {
    trait_type: string;
    value: string | number;
    display_type?: 'number';
}

export interface Metadata {
    attributes: Attribute[];
    description: string;
    name: string;
    background_color: string;
    image: string;
    animation_url: string;
}

export function getTokenFromId(tokenId: BigNumber | BigInt | string): Molecule | Drug {
    const tokenIdString = tokenId.toString();
    const id = BigNumber.from(tokenIdString);

    if (id.gte(BigNumber.from(1).shl(256))) throw 'Invalid Token Id';

    const type = id.shr(248).toNumber();

    if (type > 81) throw 'Invalid Token Id';

    if (type < 63) {
        return {
            id: tokenIdString,
            type,
            category: 'molecule',
            name: MOLECULE_NAMES[type],
            moleculeType: type,
            formula: MOLECULE_FORMULAS[type],
        };
    }

    const drugType = type - 63;
    const specialWaterIndex = id.shr(240).mask(8).toNumber();

    if (specialWaterIndex > RECIPES[drugType].length) throw 'Invalid Token Id';

    return {
        id: tokenIdString,
        type,
        category: 'drug',
        name: DRUG_NAMES[drugType],
        drugType,
        specialWaterIndex,
        description: DRUG_DESCRIPTIONS[drugType],
    };
}

export function canBrew(drugType: number, tokens: Molecule[] | BigNumber[] | BigInt[] | string[]): boolean {
    const molecules = tokens
        .map((t): Token => ((t as Token).category ? (t as Token) : getTokenFromId(t.toString())))
        .filter(({ category }) => category === 'molecule');

    return RECIPES[drugType].reduce(
        (accumulator: boolean, moleculeType: number) => accumulator && !!molecules.find(({ type }) => type === moleculeType),
        true
    );
}

export function getMissingForBrew(drugType: number, tokens: Molecule[] | BigNumber[] | BigInt[] | string[]): number[] {
    const molecules = tokens
        .map((t): Token => ((t as Token).category ? (t as Token) : getTokenFromId(t.toString())))
        .filter(({ category }) => category === 'molecule');

    return RECIPES[drugType].reduce(
        (accumulator: number[], moleculeType: number) =>
            molecules.find(({ type }) => type === moleculeType) ? accumulator : accumulator.concat(moleculeType),
        []
    );
}

export function getMetadata(token: Token | BigNumber | BigInt | string, mediaUri: string): Metadata {
    const tokenData = (token as Token).category ? (token as Token) : getTokenFromId(token.toString());

    const { id, category, name, type } = tokenData;

    const bigNumberId = BigNumber.from(id);

    const seed = ~~`0b${bigNumberId.mask(32).toBigInt().toString(2)}`;
    const brt = bigNumberId.shr(32).mask(16).toNumber();
    const sat = bigNumberId.shr(48).mask(16).toNumber();
    const hue = bigNumberId.shr(64).mask(16).toNumber();

    const moleculeLightingType = bigNumberId.shr(80).mask(8).toNumber();

    if (moleculeLightingType >= 2) throw Error('Invalid token id.');

    const moleculeIntegrityType = bigNumberId.shr(88).mask(8).toNumber();

    if (moleculeIntegrityType >= 4) throw Error('Invalid token id.');

    const deformationType = bigNumberId.shr(96).mask(8).toNumber();

    if (deformationType >= 3) throw Error('Invalid token id.');

    const stripesColorShiftType = bigNumberId.shr(104).mask(8).toNumber();

    if (stripesColorShiftType >= 2) throw Error('Invalid token id.');

    const stripesAmountType = bigNumberId.shr(112).mask(8).toNumber();

    if (stripesAmountType >= 3) throw Error('Invalid token id.');

    const blobType = bigNumberId.shr(120).mask(8).toNumber();

    if (blobType >= 3) throw Error('Invalid token id.');

    const paletteType = bigNumberId.shr(128).mask(8).toNumber();

    if (paletteType >= 6) throw Error('Invalid token id.');

    const attributes: Attribute[] = [
        { trait_type: 'Category', value: category },
        { trait_type: 'Name', value: name },
        { trait_type: 'Type', display_type: 'number', value: type },
        { trait_type: 'Hue', display_type: 'number', value: hue },
        { trait_type: 'Saturation', display_type: 'number', value: sat },
        { trait_type: 'Brightness', display_type: 'number', value: brt },
        { trait_type: 'Seed', display_type: 'number', value: seed },
        { trait_type: 'Deformation', value: DEFORMATION_TYPES[deformationType] },
        { trait_type: 'Stripes Color Shift', value: STRIPES_COLOR_SHIFT_TYPES[stripesColorShiftType] },
        { trait_type: 'Stripes Amount', value: STRIPES_AMOUNT_TYPES[stripesAmountType] },
        { trait_type: 'Blob', value: BLOB_TYPES[blobType] },
        { trait_type: 'Palette', value: PALETTE_TYPES[paletteType] },
    ];

    if (tokenData.category === 'drug') {
        attributes.push({ trait_type: 'Description', value: (tokenData as Drug).description });
        attributes.push({ trait_type: 'Special Water Index', display_type: 'number', value: (tokenData as Drug).specialWaterIndex });
    }

    if (tokenData.category === 'molecule') {
        attributes.push({ trait_type: 'Formula', value: (tokenData as Molecule).formula });
        attributes.push({ trait_type: 'Molecule Lighting', value: MOLECULE_LIGHTING_TYPES[moleculeLightingType] });
        attributes.push({ trait_type: 'Molecule Integrity', value: MOLECULE_INTEGRITY_TYPES[moleculeIntegrityType] });
    }

    return {
        attributes,
        description: `An xSublimatio ${category}`,
        name,
        background_color: 'ffffff',
        image: `${mediaUri}/${id}.png`,
        animation_url: `${mediaUri}/${id}.webm`,
    };
}
