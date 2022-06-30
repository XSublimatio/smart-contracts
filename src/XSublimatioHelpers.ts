import { BigNumber } from 'ethers';

export const MOLECULE_MAX_SUPPLY = 5748;

export const MOLECULE_MAX_SUPPLIES: number[] = [
    3402, 250, 142, 121, 121, 120, 120, 120, 107, 97, 95, 95, 95, 95, 82, 50, 36, 36, 36, 34, 34, 34, 32, 32, 32, 29, 29, 29, 29, 24, 24,
    21, 20, 18, 12, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

export const DRUG_MAX_SUPPLY = 1134;

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
    'Lactuside A',
    'Codeine',
    'Noscapine',
    'Papaverine',
    'Baeocystin',
    'Norbaeocystin',
    'Psilocin',
    'Psilocybin',
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
    'Telepathine',
    'Tetrahydroharmine',
    'Acetylcholine',
    'Dopamine',
    'Dynorphin',
    'Met-enkephalin',
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

export const MOLECULE_DESCRIPTIONS: string[] = [
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Ethanol is a psychotropic drug, and one of the oldest recreational drugs. It has many other applications, such as perfumery, pharmaceuticals or as biofuel.',
    'Methamphetamine, or N-methylamphetamine, is a highly addictive synthetic drug. It produces euphoric and stimulating effects similar to those of amphetamines.',
    'Caffeine, also known as theine or 1,3,7-trimethylxanthine, is an alkaloid that acts as a psychotropic stimulant and mild diuretic.',
    'Theobromine is a bitter compound of the methylxanthine family, very close to caffeine. It is found in particular in dark chocolate.',
    'Cathine is a phenylethylamine alkaloid. It is the principal product of degradation of the cathinone.',
    'Cathinone, or β-keto-amphetamine, is an alkaloid from the leaves of the African shrub khat. It has characteristics similar to those of amphetamines.',
    'Methcathinone is an amine related to cathinone and also has the pharmacological characteristics of the amphetamine class.',
    'Cocaine is a tropanic alkaloid extracted from the coca leaf. It is a stimulant drug which makes a person more alert and energetic.',
    'CBD is a molecule belonging to the cannabinoid family. Like THC, it is an active substance present in the hemp plant.',
    'Cannabichromene is one of over 120 cannabinoid compounds identified in the plant genus Cannabis. It is an anti-inflammatory that can contribute to the analgesic effect of cannabis.',
    'Cannabigerol is one of over 120 cannabinoid compounds identified in the plant genus Cannabis. It is still under laboratory research to determine its precise pharmacological properties.',
    'Cannabinol is a cannabinoid that is not present in the fresh plant, but its concentration increases with exposure to light and air because it is a product of the oxidation of THC. It is a sedative which could be responsible for depression, loss of motivation and loss of long-term memory.',
    'The Δ-9-tetrahydrocannabinol is an organic terpene compound of the cannabinoid family present in hemp resin. It is the main active molecule of cannabis.',
    'Morphine is an alkaloid extracted from the latex of the sleeping poppy. It is used in medicine as an analgesic and as a drug for its euphoric action.',
    'Ketamine is a psychotropic drug used as an injectable anesthetic. It has recently been used in the treatment of depression.',
    'Atropine is a tropane alkaloid. It relaxes the smooth muscles and therefore has an antispasmodic action. It is also used as an antidote for certain neurotoxic combat gases.',
    'Hyoscyamine is an alkaloid that acts by binding to muscarinic acetylcholine receptors in the central and peripheral nervous system, thus preventing the action of the neurotransmitter.',
    'Scopolamine is a parasympatholytic of the atropine type. It decreases intestinal motility and has a tachycardia effect. At the level of the central nervous system, it has a predominantly sedative effect.',
    'Lactucine is a molecule from the group of bitter lactones, which is responsible for the analgesic and sedative properties of lactucarium.',
    'Lactucopicrin is a lactone, component of lactucarium. It is a bitter substance which has a sedative and analgesic effect acting on the central nervous system.  ',
    'Lactuside A is a sesquiterpene lactone, a secondary plant metabolite that plays an initial role in plant defense.',
    'Codeine, or 3-methylmorphine, is one of the alkaloids contained in the sleeping poppy. A morphine agonist, it is used as an analgesic and a narcotic cough suppressant.',
    'Noscapine is an alkaloid with properties similar to those of codeine and morphine. At therapeutic doses, it does not cause addiction or dependence.',
    'Papaverine is an alkaloid found in opium extracted from the poppy. It is a muscle relaxant and a vasodilator.',
    'Baeocystin is an analog of psilocybin. This molecule presents psychoactive properties when combined with other metabolites of the mushroom.',
    'Norbaeocystin is an analog of psilocybin. This molecule presents psychoactive properties when combined with other metabolites of the mushroom.',
    'Psilocin is a hallucinogenic alkaloid isolated in trace amounts from Psilocybin mushrooms.',
    'Psilocybin is an alkaloid isolated from various genera of mushrooms. This molecule has hallucinogenic, anxiolytic and psychoactive activities.',
    'Belladonnine is a member of class of tropane alkaloids. Belladonnine can be found in plants of family Solanaceae.',
    'Scopoletin is an aglycone coumarin. Although the mechanisms of action have not yet been established, this agent has potential antidopaminergic, antioxidant and anti-inflammatory effects.',
    'GHB is an endogenous substance, produced in the brain of mammals. It acts on endorphins which gives it sedative and anesthetic properties.',
    'LSD, from the German Lysergsäurediethylamid, is a compound of the lysergamid family. It causes powerful psychedelic effects and hallucinations.',
    'Chloroquine is a synthetic antimalarial drug substitute for quinine. Its therapeutic dose is close to its toxicity threshold.',
    'Mandragorin is an alkaloid of toxic tropanic structure extracted from the roots of mandrake.',
    'In reference to the "Salvia divinatorum", a powerful plant used by the Mazatec Indians to obtain religious visions, some of its constituents have been named divinatorin.',
    'In reference to the "Salvia divinatorum", a powerful plant used by the Mazatec Indians to obtain religious visions, some of its constituents have been named divinatorin.',
    'Dimethyltryptamine is a psychotropic substance. It provides an almost immediate and short-lived hallucinogenic effect and sometimes near-death experiences.',
    'Harmol is a chemical compound classified as a β-carboline. It is a natural product found in Festuca ovina or Passiflora foetida.',
    'Nicotine is a toxic alkaloid derived mainly from the tobacco plant and is used as a psychotropic drug. This molecule is partly responsible for tobacco addiction.',
    'Salvidivin B is the major deacetylated metabolite of Salvinorin A, a diterpene with reported psychotropic activity.',
    'Salvinicin A is a substance with hallucinogenic properties. It is the main active psychotropic constituent of the entheogenic plant Salvia divinorum.',
    'Salvinorin A is an active hallucinogenic substance of the salvinorin group. It has long been used in Mexican shamanism.',
    'Telepathine is a plant alkaloid found in hallucinogenic drinks made made in the western Amazon region. Combined with dimethyltryptamine, it gives Ayahuasca its hallucinogenic properties.',
    'Tetrahydroharmine is a fluorescent indole alkaloid that occurs in the tropical liana species Banisteriopsis caapi. THH weakly inhibits serotonin reuptake and it may contribute psychoactivity as a serotonin reuptake inhibitor.',
    'Acetylcholine is a neurotransmitter that plays a role in the central nervous system, where it is involved in memory and learning, as well as in the peripheral nervous system, particularly in muscle activity.',
    'Dopamine is a key neurotransmitter in the brain that affects motivation, productivity and concentration. It is also known as the happiness hormone.',
    'Dynorphins are a class of opioid peptides derived from prodynorphin. It is involved in pain, addiction and mood regulation.',
    'Met-enkephalin is a neurotransmitter, belonging to the category of endogenous opioids, which is released by neurons when a painful sensation is too intense.',
    'MDMA is a synthetic substance usually known as ecstasy. It has a stimulating effect on the central nervous system and has a weak hallucinogenic action.',
    'Oxytocin is a neuropeptide secreted by the hypothalamus and excreted by the posterior pituitary. It plays a role in trust, empathy, generosity, and sexuality.',
    'Phenethylamine is a monoamine alkaloid that acts as a neurotransmitter. It is also present in some fermented foods like red wine.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
    'Water is a very stable chemical substance, but also very reactive, is an excellent solvent in the liquid state. It is at the heart of the sulphurous theory of the "Memory of water", where it is purported that water which has been in contact with certain substances would keep an imprint of their properties even though they are no longer present.',
];

export const MOLECULE_LABELS: string[] = [
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
    'Alcohol',
    'Chloroquine',
    'Cocaine',
    'GHB',
    'Ketamine',
    'LSD',
    'Methamphetamine',
    'Morphine',
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
    'Ethanol is a psychotropic drug, and one of the oldest recreational drugs. It has many other applications, such as perfumery, pharmaceuticals or as biofuel.',
    'Chloroquine is a synthetic antimalarial drug substitute for quinine. Its therapeutic dose is close to its toxicity threshold.',
    'Cocaine is a tropanic alkaloid extracted from the coca leaf. It is a stimulant drug which makes a person more alert and energetic.',
    'GHB is an endogenous substance, produced in the brain of mammals. It acts on endorphins which gives it sedative and anesthetic properties.',
    'Ketamine is a psychotropic drug used as an injectable anesthetic. It has recently been used in the treatment of depression.',
    'LSD, from the German Lysergsäurediethylamid, is a compound of the lysergamid family. It causes powerful psychedelic effects and hallucinations. ',
    'Methamphetamine, or N-methylamphetamine, is a highly addictive synthetic drug. It produces euphoric and stimulating effects similar to those of amphetamines.',
    'Morphine is an alkaloid extracted from the latex of the sleeping poppy. It is used in medicine as an analgesic and as a drug for its euphoric action.',
    'Ayahuasca is a hallucinogenic decoction with a pungent taste, made from lianas. It is traditionally consumed by many tribes in the Amazon, who make it sacred and claim that it has healing, purifying, and magical properties.',
    'Belladonna is a plant of the Solanaceae family. It is an integral part of European witchcraft myths. Its properties, sometimes unpredictable and often fatal, are known and used since Antiquity.',
    'Cannabis is a botanical genus of annual plants in the Cannabaceae family. Recreational cannabis is considered a "soft" drug. Its ritual use as a psychotropic drug is attested 2500 years ago in China.',
    'Khat is a shrub of the Celastraceae family and also designates the psychotropic substance contained in the leaves of this plant. Its properties would seem to be known since the ancient Egyptians.',
    'Lactuca Virosa is considered a magical plant associated with black magic. Its latex has hypnotic and narcotic properties. It grows in uncultivated places, along roadsides and even in fields and gardens.',
    'The love potion is a digital drug, based on the very controversial water memory theory, and created as part of the project "please love party" by Pierre Pauze. The Homeopatic version is available for download on the dark web.',
    'Psilocybe Valhalla is described as a hallucinogenic or psychedelic mushroom. It is both one of the most common psilocybin mushrooms found in nature, and one of the most powerful.',
    'Mandrake is a herbaceous plant of the Mediterranean countries, belonging to the family of the solanacées. This plant, rich in alkaloids with hallucinogenic properties, is surrounded by many legends, the ancients attributing extraordinary magical virtues to it.',
    'Mate is a traditional South American beverage originating from the culture of the Guaraní Indians. Mate is a stimulant, improving reactivity and concentration capacities.',
    'Opium, or "the poets\' drug", is derived from the latex of the poppy plant and is an opiate that produces feelings of orgasmic ecstasy and intense relaxation.',
    'Salvia Divinorum is a plant of the family of Lamiaceae native of Mexico. It is known for its psychotropic effects and is traditionally used in a mystical context by the Mazatec Indians during religious divination rites.',
];

export const DRUG_LABELS: string[] = [
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

export const DRUG_PLACEHOLDERS: string[] = [
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/alcohol.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/chloroquine.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/cocaine.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/ghb.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/ketamine.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/lsd.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/methamphetamine.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/morphine.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/ayahuasca.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/belladonna.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/cannabis.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/khat.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/lactuca-virosa.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/love-elixir.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/magic-truffle.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/mandrake.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/mate.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/opium.png',
    'https://res.cloudinary.com/faction/image/upload/faction/xsublimatio/placeholders/salvia-divinorum.png',
];

export const MOLECULE_LIGHTING_TYPES: string[] = ['Mixed', 'Zones'];

export const MOLECULE_INTEGRITY_TYPES: string[] = ['Medium', 'High', 'Very High', 'Full'];

export const DEFORMATION_TYPES: string[] = ['None', 'Medium', 'High'];

export const STRIPES_COLOR_SHIFT_TYPES: string[] = ['Off', 'On'];

export const STRIPES_AMOUNT_TYPES: string[] = ['Low', 'Medium', 'High'];

export const BLOB_TYPES: string[] = ['Triangle', 'Square', 'Circle'];

export const PALETTE_TYPES: string[] = ['Monochrome', 'Analogous', 'Complementary', 'S-Complementary', 'Triadic', 'Square'];

export interface Molecule {
    type: number;
    name: string;
    description: string;
    label: string;
    maxSupply: number;
    image: string;
    getSupply: (available: number) => number;
}

export const MOLECULES: Molecule[] = MOLECULE_MAX_SUPPLIES.map((maxSupply, type) => ({
    type,
    name: MOLECULE_NAMES[type],
    description: MOLECULE_DESCRIPTIONS[type],
    label: MOLECULE_LABELS[type],
    maxSupply,
    image: 'TBD',
    getSupply: (available: number): number => getMoleculeSupply(type, available),
}));

export interface Drug {
    type: number;
    name: string;
    description: string;
    label: string;
    maxSupply: number;
    recipe: Molecule[];
    image: string;
    getBrewPossibility: (tokens: Token[] | BigNumber[] | BigInt[] | string[]) => BrewPossibility;
    getSupply: (available: number) => number;
}

export const DRUGS: Drug[] = DRUG_MAX_SUPPLIES.map((maxSupply, type) => ({
    type,
    name: DRUG_NAMES[type],
    description: DRUG_DESCRIPTIONS[type],
    label: DRUG_LABELS[type],
    maxSupply,
    recipe: RECIPES[type].map((moleculeType) => MOLECULES[moleculeType]),
    image: DRUG_PLACEHOLDERS[type],
    getBrewPossibility: (tokens: Token[] | BigNumber[] | BigInt[] | string[]): BrewPossibility => getBrewPossibility(type, tokens),
    getSupply: (available: number): number => getDrugSupply(type, available),
}));

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
    artist: string;
}

export interface ContractMetadata {
    name: string;
    description: string;
    image: string;
    external_link: string;
    seller_fee_basis_points: number;
    fee_recipient: string;
    artist: string;
    asset_generator_torrent_hash: string;
}

export interface Token {
    id: string;
    globalType: number;
    type: number;
    name: string;
    category: 'molecule' | 'drug';
    hue: number;
    saturation: number;
    brightness: number;
    seed: number;
    deformationType: keyof typeof DEFORMATION_TYPES;
    stripesColorShiftType: keyof typeof STRIPES_COLOR_SHIFT_TYPES;
    stripesAmountType: keyof typeof STRIPES_AMOUNT_TYPES;
    blobType: keyof typeof BLOB_TYPES;
    paletteType: keyof typeof PALETTE_TYPES;
    moleculeLightingType?: keyof typeof MOLECULE_LIGHTING_TYPES;
    moleculeIntegrityType?: keyof typeof MOLECULE_INTEGRITY_TYPES;
    metadata: Metadata;
}

export interface BrewPossibility {
    canBrew: boolean;
    useableSpecialWater?: Token;
    recipeMolecules: Token[][];
}

export function getTokenFromId(
    tokenId: BigNumber | BigInt | string,
    imageUri = '',
    videoUri = '',
    imageExtension = 'png',
    videoExtension = 'webm'
): Token {
    const id = BigNumber.from(tokenId.toString());

    if (id.gte(BigNumber.from(1).shl(256))) throw 'Invalid Token Id';

    const globalType = id.shr(93).toNumber();

    if (globalType > 81) throw 'Invalid Token Id';

    const name = globalType < 63 ? MOLECULE_NAMES[globalType] : DRUG_NAMES[globalType - 63];
    const category = globalType < 63 ? 'molecule' : 'drug';
    const type = globalType < 63 ? globalType : globalType - 63;

    const seed = ~~`0b${id.mask(32).toBigInt().toString(2)}`;
    const brightness = id.shr(32).mask(16).toNumber();
    const saturation = id.shr(48).mask(16).toNumber();
    const hue = id.shr(64).mask(16).toNumber();

    const moleculeLightingType = id.shr(80).mask(1).toNumber();

    if (moleculeLightingType >= 2) throw Error('Invalid token id.');

    const moleculeIntegrityType = id.shr(81).mask(2).toNumber();

    if (moleculeIntegrityType >= 4) throw Error('Invalid token id.');

    const deformationType = id.shr(83).mask(2).toNumber();

    if (deformationType >= 3) throw Error('Invalid token id.');

    const stripesColorShiftType = id.shr(85).mask(1).toNumber();

    if (stripesColorShiftType >= 2) throw Error('Invalid token id.');

    const stripesAmountType = id.shr(86).mask(2).toNumber();

    if (stripesAmountType >= 3) throw Error('Invalid token id.');

    const blobType = id.shr(88).mask(2).toNumber();

    if (blobType >= 3) throw Error('Invalid token id.');

    const paletteType = id.shr(90).mask(3).toNumber();

    if (paletteType >= 6) throw Error('Invalid token id.');

    const attributes: Attribute[] = [
        { trait_type: 'Category', value: category },
        { trait_type: 'Name', value: name },
        { trait_type: 'Hue', display_type: 'number', value: hue },
        { trait_type: 'Saturation', display_type: 'number', value: saturation },
        { trait_type: 'Brightness', display_type: 'number', value: brightness },
        { trait_type: 'Seed', display_type: 'number', value: seed },
        { trait_type: 'Deformation', value: DEFORMATION_TYPES[deformationType] },
        { trait_type: 'Stripes Color Shift', value: STRIPES_COLOR_SHIFT_TYPES[stripesColorShiftType] },
        { trait_type: 'Stripes Amount', value: STRIPES_AMOUNT_TYPES[stripesAmountType] },
        { trait_type: 'Blob', value: BLOB_TYPES[blobType] },
        { trait_type: 'Palette', value: PALETTE_TYPES[paletteType] },
    ];

    if (category === 'molecule') {
        attributes.push({ trait_type: 'Molecule Lighting', value: MOLECULE_LIGHTING_TYPES[moleculeLightingType] });
        attributes.push({ trait_type: 'Molecule Integrity', value: MOLECULE_INTEGRITY_TYPES[moleculeIntegrityType] });
    }

    return {
        id: id.toString(),
        globalType,
        type,
        name,
        category,
        hue,
        saturation,
        brightness,
        seed,
        deformationType,
        stripesColorShiftType,
        stripesAmountType,
        blobType,
        paletteType,
        moleculeLightingType: category === 'molecule' ? moleculeLightingType : undefined,
        moleculeIntegrityType: category === 'molecule' ? moleculeIntegrityType : undefined,
        metadata: {
            attributes,
            description: `An xSublimatio ${category}`,
            name,
            background_color: 'ffffff',
            image: `${imageUri}/${id}.${imageExtension}`,
            animation_url: `${videoUri}/${id}.${videoExtension}`,
            artist: 'Pierre Pauze',
        },
    };
}

function filterMolecules(tokens: Token[] | BigNumber[] | BigInt[] | string[]): Token[] {
    return tokens
        .map((t): Token => ((t as Token).category ? (t as Token) : getTokenFromId(t.toString())))
        .filter(({ category }) => category === 'molecule');
}

export function getBrewPossibility(drugType: number, tokens: Token[] | BigNumber[] | BigInt[] | string[]): BrewPossibility {
    const molecules = filterMolecules(tokens);

    const useableSpecialWater = molecules.find(({ type }) => type === drugType + 44);

    const recipeMolecules = RECIPES[drugType].map((moleculeType: number) => molecules.filter(({ type }) => type === moleculeType));

    const canBrew =
        RECIPES[drugType].length <=
        recipeMolecules.reduce((hits, recipeMolecules) => hits + (recipeMolecules.length ? 1 : 0), 0) + (useableSpecialWater ? 1 : 0);

    return { canBrew, useableSpecialWater, recipeMolecules };
}

export function getMoleculeSupply(moleculeType: number, available: number): number {
    return MOLECULE_MAX_SUPPLIES[moleculeType] - available;
}

export function getDrugSupply(drugType: number, available: number): number {
    return DRUG_MAX_SUPPLIES[drugType] - available;
}

export function getContractMetadata(
    imageUri = '',
    imageExtension = 'png',
    feeBasisPoints = 0,
    feeRecipient = '',
    torrentHash = ''
): ContractMetadata {
    return {
        name: 'xSublimatio',
        description: 'A digital drug experience as NFTs',
        image: `${imageUri}/xSublimatio.${imageExtension}`,
        external_link: 'faction.art/xsublimatio',
        seller_fee_basis_points: feeBasisPoints,
        fee_recipient: feeRecipient,
        artist: 'Pierre Pauze',
        asset_generator_torrent_hash: torrentHash,
    };
}
