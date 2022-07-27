import * as cfg from '../cfg';

export interface Party {
  code: string;
  count: number;
}

export type Parties = Party[];

export function generatePartiesStanding(): Party[] {
  let [weights, remaining] = getWeights();
  let balance = cfg.parlamentSize;

  let val = 0;
  let codes = Object.keys(cfg.partyNames);
  let result = [];
  for (let i = 0; i < cfg.numberOfParties; ++i) {
    if (remaining > 0) {
      val = Math.round(weights[i] * balance / remaining);
      balance -= val;
      remaining -= weights[i];
    } else {
      val = 0;
    }

    result.push({code: codes[i], count: val});
  }

  return result;
}

export function partiesToElectionHtml(parties: Parties): string {
  let result: string[] = [];
  for (let x of parties) {
    let name = cfg.partyNames[x.code];
    result.push(
      `<tr><td><div class="${x.code}"></div></td><td class="number">(${x.count})</td><td>${name}</td></tr>`
    );
  }
  return result.join('');
}

function getWeights(): [number[], number] {
  let weights = [];
  for (let i = 0; i < cfg.numberOfParties; ++i) {
    weights.push(Math.random());
  }

  let maxIndex = 0;
  for (let i = 0; i < weights.length; ++i) {
    if (weights[i] > weights[maxIndex]) {
      maxIndex = i;
    }
  }
  weights[maxIndex] *= cfg.electionWinnerBoost;

  let minIndex = 0;
  for (let i = 0; i < weights.length; ++i) {
    if (weights[i] < weights[minIndex]) {
      minIndex = i;
    }
  }
  weights[minIndex] *= cfg.electionWinnerBoost;

  let total = 0;
  for (let w of weights) {
    total += w;
  }

  return [weights, total];
}
