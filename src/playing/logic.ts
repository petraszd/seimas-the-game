import * as cfg from '../cfg';
import { Law } from './law/data';
import { onNewElection, onNewLaw, disableButtons, enableButtons } from './ui';
import { generateLaw, clearIndexedCache } from './law/generator';
import { FormulaEvent, lawToFormulaDelta } from './law/formulawalker';
import { onGameOver } from '../director';
import { generatePartiesStanding, Parties } from './parties';

interface Stats {
  defense: number;
  social: number;
  finance: number;
  totalNumberOfLaws: number;
  numberOfLawsInTerm: number;
}

export let currentParties: Parties = generatePartiesStanding();
export let currentLaw: Law = generateLaw(currentParties);

export let stats: Stats = {
  defense: cfg.initStatsPoints,
  social: cfg.initStatsPoints,
  finance: cfg.initStatsPoints,
  totalNumberOfLaws: 0,
  numberOfLawsInTerm: 0,
};

export function passLaw() {
  processCurrentLaw(1 * cfg.passLawMultiplier);
}

export function vetoLaw() {
  processCurrentLaw(-1 * cfg.vetoLawMultiplier);
}

export function startPlaying() {
  enableButtons();
  clearIndexedCache();
  currentParties = generatePartiesStanding();
  generateLawWithNewLawSignal();
  stats.defense = cfg.initStatsPoints;
  stats.social = cfg.initStatsPoints;
  stats.finance = cfg.initStatsPoints;
  stats.totalNumberOfLaws = 0;
  stats.numberOfLawsInTerm = 0;
  onNewElection(false);
}

function generateLawWithNewLawSignal() {
  currentLaw = generateLaw(currentParties);
  onNewLaw();
}

function clampStat(stat: number) {
  return Math.min(Math.max(0, stat), cfg.maxStatsPoints);
}

function processCurrentLaw(decisionMultiplier: number) {
  let delta = lawToFormulaDelta(currentLaw);
  stats.defense = clampStat(stats.defense + delta.defense * decisionMultiplier);
  stats.social = clampStat(stats.social + delta.social * decisionMultiplier);
  stats.finance = clampStat(stats.finance + delta.finance * decisionMultiplier);

  stats.numberOfLawsInTerm++;
  stats.totalNumberOfLaws++;

  if (checkIfGameIsOver()) {
    disableButtons();
    onGameOver();
  } else if (checkIfTermIsOver()) {
    currentParties = generatePartiesStanding();
    stats.numberOfLawsInTerm = 0;
    onNewElection(true);
    generateLawWithNewLawSignal();
  } else {
    generateLawWithNewLawSignal();
  }
}

function checkIfGameIsOver() {
  return (
    (stats.defense <= 0) ||
    (stats.social <= 0) ||
    (stats.finance <= 0)
  );
}

function checkIfTermIsOver(): boolean {
  return stats.numberOfLawsInTerm >= cfg.numberOfLawsPerTerm;
}
