import { Parties, partiesToElectionHtml } from './parties';
import { currentParties, currentLaw, stats, passLaw, vetoLaw } from './logic';
import { lawToFormulaDelta } from './law/formulawalker';
import { updateLawHtml } from './law/html';
import * as cfg from '../cfg';

let defenseChartElem: HTMLElement;
let defenseTextElem: HTMLElement;
let socialChartElem: HTMLElement;
let socialTextElem: HTMLElement;
let financeChartElem: HTMLElement;
let financeTextElem: HTMLElement;
let statsElem: HTMLElement;

let lawElem: HTMLElement;
let partiesElem: HTMLElement;

let termLabelElem: HTMLElement;
let termProgressElem: HTMLElement;

let electionContentElem: HTMLElement;
let electionPartiesElem: HTMLElement;

let electionOKButton: HTMLInputElement;

let vetoButton: HTMLInputElement;
let passButton: HTMLInputElement;

let partiesElems: HTMLElement[] = [];

let phrasesElems: HTMLElement[] = [];
let touchedElem: HTMLElement | null = null;

let termClickCount: number = 0;
let termClickTimer: number;
let showFormula: boolean = false;

let positiveString = cfg.deltaStringA;
let negativeString = cfg.deltaStringB;

export function initPlayingUI() {
  lawElem = document.getElementById('Law') as HTMLElement;

  defenseChartElem = document.getElementById('Playing-Defense-Chart') as HTMLElement;
  socialChartElem = document.getElementById('Playing-Social-Chart') as HTMLElement;
  financeChartElem = document.getElementById('Playing-Finance-Chart') as HTMLElement;
  defenseTextElem = document.getElementById('Playing-Defense-Text') as HTMLElement;
  socialTextElem = document.getElementById('Playing-Social-Text') as HTMLElement;
  financeTextElem = document.getElementById('Playing-Finance-Text') as HTMLElement;
  statsElem = document.getElementById('Stats') as HTMLElement;

  partiesElem = document.getElementById('Parties') as HTMLElement;

  electionContentElem = document.getElementById('Election-Content') as HTMLElement;
  electionPartiesElem = document.getElementById('Election-Parties') as HTMLElement;
  electionOKButton = document.getElementById('Election-OK') as HTMLInputElement;

  vetoButton = document.getElementById('Playing-Veto') as HTMLInputElement;
  passButton = document.getElementById('Playing-Pass') as HTMLInputElement;

  termLabelElem = document.getElementById('Term-Label') as HTMLElement;
  termProgressElem = document.getElementById('Term-Progress') as HTMLElement;

  // Initial HTML
  partiesElem.appendChild(partiesToInitialHtml(currentParties));

  // Events
  vetoButton.addEventListener('click', onVetoClick);
  passButton.addEventListener('click', onPassClick);
  electionOKButton.addEventListener('click', onElectionOKClick);
  statsElem.addEventListener('click', onStatsClick);
}

export function renderPlaying() {
  updateLawHtml(lawElem, currentLaw, showFormula);
  updateTouchEventHandlers();

  electionPartiesElem.innerHTML = partiesToElectionHtml(currentParties);
  termLabelElem.innerHTML = `Kadencijos įstatymai: ${stats.numberOfLawsInTerm + 1} / ${cfg.numberOfLawsPerTerm}`;
  renderParties(currentParties);

  let progress = Math.ceil((stats.numberOfLawsInTerm + 1) / cfg.numberOfLawsPerTerm * 100);
  termProgressElem.style.width = `${progress}%`;

  let delta = lawToFormulaDelta(currentLaw);

  renderStat({
    chartElem: defenseChartElem,
    textElem: defenseTextElem,
    label: cfg.defenseLabel,
    statValue: stats.defense,
    nextDelta: delta.defense,
  });
  renderStat({
    chartElem: socialChartElem,
    textElem: socialTextElem,
    label: cfg.socialLabel,
    statValue: stats.social,
    nextDelta: delta.social,
  });
  renderStat({
    chartElem: financeChartElem,
    textElem: financeTextElem,
    label: cfg.financeLabel,
    statValue: stats.finance,
    nextDelta: delta.finance,
  });
}

export function onNewElection(delayDialog: boolean) {
  showElectionResults(delayDialog);
  renderPlaying();
}

export function onNewLaw() {
  if (Math.random() > 0.5) {
    positiveString = cfg.deltaStringA;
    negativeString = cfg.deltaStringB;
  } else {
    positiveString = cfg.deltaStringB;
    negativeString = cfg.deltaStringA;
  }
}

export function disableButtons() {
  vetoButton.disabled = true;
  passButton.disabled = true;
}

export function enableButtons() {
  vetoButton.disabled = false;
  passButton.disabled = false;
}

function partiesToInitialHtml(parties: Parties): HTMLElement {
  let remaining = cfg.parlamentSize;
  let balance = 100;

  let result: HTMLElement = document.createElement('UL');

  for (let x of parties) {
    let li: HTMLElement = document.createElement('LI');
    li.className = x.code;
    li.innerText = `${x.count}`;
    li.style.width = '0%';

    result.appendChild(li);

    partiesElems.push(li);
  }

  return result;
}

function renderParties(parties: Parties) {
  let remaining = cfg.parlamentSize;
  let balance = 100;

  for (let i = 0; i < parties.length; ++i) {
    let x = parties[i];

    let val;
    if (remaining > 0) {
      val = Math.round(x.count * balance / remaining);
      balance -= val;
      remaining -= x.count;
    } else {
      val = 0;
    }

    partiesElems[i].style.width = `${val}%`;
    partiesElems[i].innerText = `${x.count}`;
  }
}

function showElectionResults(delayDialog: boolean) {
  if (delayDialog) {
    setTimeout(function() {
      electionContentElem.className = 'opened';
    }, cfg.delayElectionDialogTime);
  } else {
    electionContentElem.className = 'opened';
  }
  disableButtons();
}

function continuePlayingAfterElection() {
  electionContentElem.className = 'closed';
  enableButtons();
}

interface RenderStatParams {
  chartElem: HTMLElement;
  textElem: HTMLElement;
  label: string;
  statValue: number;
  nextDelta: number;
}

function renderStat(params: RenderStatParams) {
  let newW = Math.ceil(params.statValue / cfg.maxStatsPoints * 100);
  params.chartElem.style.width = `${newW}%`;
  if (params.statValue <= 0) {
    params.textElem.className = 'name game-over';
  } else {
    params.textElem.className = 'name';
  }

  params.textElem.innerText = params.label;
  setTimeout(function() {
    params.textElem.innerHTML = getStatLabel(params);
  }, cfg.delayPrompterTime);
}

function getStatLabel(params: RenderStatParams): string {
  let prompter: string = '';
  if (params.nextDelta > 0) {
    prompter = positiveString;
  } else if (params.nextDelta < 0) {
    prompter = negativeString;
  }

  if (Math.abs(params.nextDelta) > cfg.doubleDeltaStringLimit) {
    prompter = `${prompter}${prompter}`;
  }

  return [
    `<span class="prompter">${prompter}</span>`,
    ` ${params.label} `,
    `<span class="prompter">${prompter}</span>`
  ].join('');
}

function updateTouchEventHandlers() {
  touchedElem = null;
  for (let el of phrasesElems) {
    el.removeEventListener('touchstart', onPhraseElemTouchStart);
  }

  phrasesElems = [];
  let newElems = lawElem.querySelectorAll('.Phrase');
  for (let i = 0; i < newElems.length; ++i) {
    phrasesElems.push(newElems[i] as HTMLElement);
  }

  for (let el of phrasesElems) {
    el.addEventListener('touchstart', onPhraseElemTouchStart);
  }
}

function onPhraseElemTouchStart(e: Event) {
  if (touchedElem != null) {
    let index = touchedElem.className.lastIndexOf(' touched');
    touchedElem.className = touchedElem.className.substring(0, index);
  }

  let el: HTMLElement = e.currentTarget as HTMLElement;
  if (touchedElem != null && touchedElem.innerText == el.innerText) {
    touchedElem = null;
    return;
  }

  el.className = el.className + ' touched';
  touchedElem = el;
}

function onVetoClick(e: Event) {
  e.preventDefault();

  vetoLaw();
  renderPlaying();
}

function onPassClick(e: Event) {
  e.preventDefault();

  passLaw();
  renderPlaying();
}

function onElectionOKClick(e: Event) {
  continuePlayingAfterElection();
  renderPlaying();
}

function onStatsClick(e: Event) {
  if (showFormula) {
    return;
  }

  termClickCount++;
  if (termClickTimer > 0) {
    clearTimeout(termClickTimer);
  }
  if (termClickCount == 5) {
    alert('Jūs radote slaptą formulės rodymo įjungimo būdą!');
    showFormula = true;
    renderPlaying();
    return;
  }

  termClickTimer = setTimeout(function() {
    termClickCount = 0;
  }, 1500);
}
