export const maxStatsPoints = 5;
export const initStatsPoints = maxStatsPoints / 2;

export const partyNames: { [key: string]: string } = {
  KON: 'Koncervatyvios Krekždutės',
  SOC: 'Socialinės Rožės',
  LIB: 'Liberaliosios Dėžutės',
  POP: 'Violetiniai Gandragalviai',
};
export const numberOfParties = Object.keys(partyNames).length;

export const additionalAffectedChance = 0.3;
export const additionalPurposeChance = 0.2;

export const passLawMultiplier = 1.0;
export const vetoLawMultiplier = 1.0;

export const deltaStringA = 'x';
export const deltaStringB = 'o';

export const doubleDeltaStringLimit = 0.99;

interface RecentSizesConfig {
  BEGIN: number;
  ACTION: number;
  AFFECTED: number;
  MERGE: number;
  PURPOSE: number;
}

export const recentSizes: RecentSizesConfig = {
  BEGIN: 5,
  ACTION: 4,
  AFFECTED: 8,
  MERGE: 5,
  PURPOSE: 5,
};

export const defenseLabel = 'Tankai';
export const socialLabel = 'Žmonės';
export const financeLabel = 'Pinigai';

export const parlamentSize = 141;

export const electionWinnerBoost = 1.8;
export const electionLooserBoost = 0.4;

export const numberOfLawsPerTerm = 10;

export const delayElectionDialogTime = 500;
export const delayGameEndTime = 1200;
export const delayPrompterTime = 320;
