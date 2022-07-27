import * as cfg from '../../cfg';
import { Law, LawPart } from './data';
import { FormulaEvent, lawToFormula } from './formulawalker';

export function updateLawHtml(lawElem: HTMLElement, parts: Law, showFormula: boolean) {
  lawElem.innerHTML = generateLawHtml(parts, []);

  if (parts.length <= 1) {
    return;
  }

  // Calculating newlines (Firefox rendering issue)
  let newlines = [];

  let elems = lawElem.querySelectorAll('span.Phrase');
  let firstX = elems[0].getBoundingClientRect().left;
  let prevY = elems[0].getBoundingClientRect().top;
  for (let i = 1; i < elems.length; ++i) {
    let elem = elems[i];
    let x = elem.getBoundingClientRect().left;
    let y = elem.getBoundingClientRect().top;

    if (x == firstX && prevY != y) {
      newlines.push(i - 1);
    }
    prevY = y;
  }

  let html = [generateLawHtml(parts, newlines)];
  if (showFormula) {
    html.push(`<div class="Formula">${lawToFormulaHtml(parts)}</div>`);
  }
  lawElem.innerHTML = html.join('');
}

function generateLawHtml(parts: Law, newlineIndexes: number[]): string {
  let result: string[] = [];

  for (let i = 0, n = parts.length; i < n; ++i) {
    let part = parts[i];
    let prevIndex = i - 1;

    if (result.length > 0 && part.phrase[0] != ',') {
      result.push(' ');
    }

    let phrase: string;
    if (prevIndex >= 0 && endsWithComma(parts[prevIndex].phrase) && startsWithComma(part.phrase)) {
      phrase = part.phrase.substr(1);
    } else {
      phrase = part.phrase;
    }

    let partyKey: string = '';
    let partyName: string = '';
    if (part.party) {
      partyKey = part.party;
      partyName = cfg.partyNames[partyKey];
    }

    result.push(`<span class="Phrase ${partyKey}">`);
    if (partyName) {
      result.push(`<span class="Party ${partyKey}">${partyName}</span>`);
    }
    result.push(phrase);
    if (newlineIndexes.indexOf(i) != -1) {
      result.push('<br/>');
    }
    result.push('</span>');
  }

  result.push('.');
  return result.join('');
}

function endsWithComma(word: string): boolean {
  let len = word.length;
  return word[len - 1] == ',';
}

function startsWithComma(word: string): boolean {
  return word[0] == ',';
}

function lawToFormulaHtml(parts: Law): string {
  function toDeltaStr(value: number): string {
    if (multiplier == 1) {
      return value.toFixed(2);
    } else if (multiplier != 0) {
      return `${(value / multiplier).toFixed(2)} * ${multiplier.toFixed(2)}`;
    }

    return (0).toFixed(2);
  }

  function toStatHtml(value: number, label: string): string {
    return `<span class="number-label">${label} <span class="number">${toDeltaStr(value)}</span></span>`;
  }

  function onFormulaEvent(formulaEvent: FormulaEvent, value: number) {
    switch (formulaEvent) {
      case FormulaEvent.Multiplier:
        multiplier = value;
        result.push(`<span class="number-label">Multiplier <span class="number">${value.toFixed(2)}</span></span>`);
        break;
      case FormulaEvent.Defense:
        totalDefense += value;
        result.push(toStatHtml(value, 'Defense'));
        break;
      case FormulaEvent.Social:
        totalSocial += value;
        result.push(toStatHtml(value, 'Social'));
        break;
      case FormulaEvent.Finance:
        totalFinance += value;
        result.push(toStatHtml(value, 'Finance'));
        break;
      default:
        break;
    }
  }

  function onNewLawPart(lawPart: LawPart) {
    let out: string;
    if (lawPart.party) {
      out = `[${lawPart.party}]: ${lawPart.phrase}`;
    } else {
      out = `${lawPart.phrase}`;
    }
    result.push(`<div class="text">${out}</div>`);
  }

  let totalDefense: number = 0;
  let totalSocial: number = 0;
  let totalFinance: number = 0;

  let multiplier: number = 0;
  let result: string[] = ['<div class="text">PRADŽIA</div>'];
  lawToFormula(parts, onFormulaEvent, onNewLawPart);
  result.push('<div class="text">PABAIGA</div>');

  multiplier = 1;
  result.push(toStatHtml(totalDefense, 'Defense'));
  result.push(toStatHtml(totalSocial, 'Social'));
  result.push(toStatHtml(totalFinance, 'Finance'));
  return result.join('');
}
