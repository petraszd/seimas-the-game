import { Law, LawPart } from './data';

export enum FormulaEvent {
  Multiplier,
  Defense,
  Finance,
  Social
}

export type FormulatEventCallback = (formulaEvent: FormulaEvent, value: number) => void;
export type NewLawPartCallback = (lawPart: LawPart) => void;

export function lawToFormula(parts: Law, onFormulaEvent: FormulatEventCallback, onNewLawPart?: NewLawPartCallback) {
  let currentMultiplier = 1;
  onFormulaEvent(FormulaEvent.Multiplier, currentMultiplier);

  for (let i = 0, part; part = parts[i]; ++i) {
    if (onNewLawPart) {
      onNewLawPart(part);
    }

    if (part.multiplier) {
      currentMultiplier *= part.multiplier;
      onFormulaEvent(FormulaEvent.Multiplier, currentMultiplier);
    }
    if (part.defense != undefined && part.defense != 0) {
      onFormulaEvent(FormulaEvent.Defense, part.defense * currentMultiplier);
    }
    if (part.finance != undefined && part.finance != 0) {
      onFormulaEvent(FormulaEvent.Finance, part.finance * currentMultiplier);
    }
    if (part.social != undefined && part.social != 0) {
      onFormulaEvent(FormulaEvent.Social, part.social * currentMultiplier);
    }
  }
}

export interface FormulaDelta {
  defense: number;
  social: number;
  finance: number;
}

export function lawToFormulaDelta(parts: Law): FormulaDelta {
  let result = {
    defense: 0,
    social: 0,
    finance: 0,
  };

  lawToFormula(parts, function(formulaEvent: FormulaEvent, value: number) {
    switch (formulaEvent) {
      case FormulaEvent.Defense:
        result.defense += value;
        break;
      case FormulaEvent.Social:
        result.social += value;
        break;
      case FormulaEvent.Finance:
        result.finance += value;
        break;
      default:
        break;
    }
  });

  return result;
}
