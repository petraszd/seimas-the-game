declare module '*.json' {

  export interface LawPart {
    phrase: string;

    party?: string;

    multiplier?: number;

    defense?: number;
    social?: number;
    finance?: number;
  }

  export let BEGIN: LawPart[];
  export let ACTION: LawPart[];
  export let AFFECTED: LawPart[];
  export let MERGE: LawPart[];
  export let PURPOSE: LawPart[];
  export let BOOLEAN: LawPart[];

  export interface LawsData {
    BEGIN: LawPart[];
    ACTION: LawPart[];
    AFFECTED: LawPart[];
    MERGE: LawPart[];
    PURPOSE: LawPart[];
    BOOLEAN: LawPart[];
  }

  let value: LawsData;
  export default value;
}
