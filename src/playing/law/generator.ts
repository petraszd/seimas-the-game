import * as cfg from '../../cfg';
import { Law, LawPart, butckets } from './data';
import { Parties } from '../parties';

export function generateLaw(parties: Parties): Law {
  let parts: Law = [];

  function add(butcket: Law, recent?: RecentIndexes): void {
    parts.push(randomFromButcket(butcket, parties, recent));
  }

  add(butckets.BEGIN, recentBeginIndexes);
  add(butckets.ACTION, recentActionIndexes);
  add(butckets.AFFECTED, recentAffectedIndexes);
  if (Math.random() < cfg.additionalAffectedChance) {
    add(butckets.BOOLEAN);
    add(butckets.AFFECTED, recentAffectedIndexes);
  }

  add(butckets.MERGE, recentMergeIndexes);
  add(butckets.PURPOSE, recentPurposeIndexes);
  if (Math.random() < cfg.additionalPurposeChance) {
    add(butckets.BOOLEAN);
    add(butckets.PURPOSE, recentPurposeIndexes);
  }

  return parts;
}

export function clearIndexedCache() {
  recentBeginIndexes.indexes = [];
  recentActionIndexes.indexes = [];
  recentAffectedIndexes.indexes = [];
  recentMergeIndexes.indexes = [];
  recentPurposeIndexes.indexes = [];
}

function randomFromButcket(butcket: Law, parties: Parties, recent?: RecentIndexes): LawPart {
  let n: number = butcket.length;
  let index: number = 0;
  let lawPart: LawPart;
  let party = selectRandomParty(parties);

  for (let i = 0; i < 100; ++i) {  // Prevents infinitive loop
    index = Math.floor(Math.random() * n);
    lawPart = butcket[index];

    if (lawPart.party && lawPart.party != party) {
      continue;
    }

    if (!recent) {
      break;
    }

    if (recent.indexes.indexOf(index) == -1) {
      if (recent.indexes.length == recent.size) {
        recent.indexes.shift();
      }
      recent.indexes.push(index);
      break;
    }
  }

  return butcket[index];
}

function selectRandomParty(parties: Parties): string {
  let n: number = parties.length;
  let upto = Math.random();

  let w = 0;
  for (let x of parties) {
    w += (x.count / cfg.parlamentSize);
    if (w > upto) {
      return x.code;
    }
  }

  let index: number = Math.floor(Math.random() * n);
  return parties[index].code;
}

interface RecentIndexes {
  indexes: number[];
  size: number;
}

function initRecentIndexes(size: number): RecentIndexes {
  return {
    indexes: [],
    size: size
  };
}

let recentBeginIndexes = initRecentIndexes(cfg.recentSizes.BEGIN);
let recentActionIndexes = initRecentIndexes(cfg.recentSizes.ACTION);
let recentAffectedIndexes = initRecentIndexes(cfg.recentSizes.AFFECTED);
let recentMergeIndexes = initRecentIndexes(cfg.recentSizes.MERGE);
let recentPurposeIndexes = initRecentIndexes(cfg.recentSizes.PURPOSE);
