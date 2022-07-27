import { stats } from './playing/logic';
import { onGameStart } from './director';

let messageElem: HTMLElement;
let reasonElem: HTMLElement;
let numberOfLawsElem: HTMLElement;
let restartButtonElem: HTMLElement;

let DefenseReasonText = 'Pabaiga: valstybė nebegali apsiginti';
let SocialReasonText = 'Pabaiga: piliečiai nebetiki valstybės idėja';
let FinanceReasonText = 'Pabaiga: valstybė bankrutavusi';

let DefenseStoryText = [
  'mūsų mielieji kaimynai iš rytų jau kaip ir nebe kaimynai, o šeimininkai. ',
  'Rusija kaip ir užpuolė, bet anot jų neužpuolė. O mes patys kalti, kad ',
  'prisiprašėme. Anot jų. Nes nu kam gi mums gynybai skirti lėšas. Reikia ',
  'su kaimynu gerai sutarti. Nu kas gi mus tokius puls. Kam mes tokie ',
  'reikalingi. O va pasirodo reikalingi. Kas bus toliau? Nu kas, kas. Kaip ',
  'ir aną kartą. Jau mums nereikia nieko rūpintis. Pasirūpins anie. Tik ',
  'dirbkite ir nieko neklausinėkite. Maisto talonų bus. Maisto nebūtinai, ',
  'bet talonų tai tikrai. Kelialapių į šiaurę irgi gal sulauksime. Nu bet gi ',
  'mes dėkingi, nes mus antrą kartą jau nuo kapitalizmo ir amerikiečių ',
  'gelbėja. Jau protokolą patys žinom. Puikūs įstatymai buvo priimti, kad ',
  'prie to privedė. Ačiū jums, prezidente, labai, bet dabar jau jus ',
  'sušaudysime, nes toks naujų šeimininkų protokolas.',
].join('');
let SocialStoryText = [
  'kažkaip nelabai paskutiniu metu rūpinotės žmonėmis. Ir, o nepatikėsite, ',
  'dabar tie žmonės yra viskuo nusivylę. Nes valstybė tai ne seimas, ne ',
  'vyriausybė ir net ne jūs, mielasis prezidente. Valstybė tai žmonės. O tie ',
  'nedėkingi bjaurybės nustojo balsuoti. Išskyrus totalius idealistus (labai ',
  'mažas numeris) ir totalius durnius (daug didesnis skaičius). Ir kokių tik ',
  'blėnių jie prirenka dabar į seimą. Kas dabar bus? Kas žino, kas dabar ',
  'bus. Pabandyk tu dabar nuspėti durnių elgseną. Gal sugalvos išstoti iš ',
  'ES. Gal iš NATO. Gal išdalini visą biudžetą paprastiems žmonėms. Gal ',
  'pasukti link nacionalsocializmo. Gal komunizmo. Tai gerų įstatymų čia ',
  'prileidote. Laukite dabar malonių iš durnių.'
].join('');
let FinanceStoryText = [
  'baigėsi pinigai. Tai, aišku, kad baigėsi, nes gi labai jau jums norėjosi ',
  'paskirstyti svetimus pinigus. Nes nu gi valdžia žino, kaip geriau ',
  'išleisti gyventojų uždirbamus pinigus. Geriau nei jie patys. Tai mes ',
  'jums mokesčius, jūs mums pinigus ir mes jums pašalpas. Tai va, nebeliko, ',
  'ką skirstyti, nes arba niekas nieko neuždirba ir neturi iš ko mokėti ',
  'mokesčių, arba juodais, juodais ir nėra jokių pinigų. Kas tikriausiai ',
  'atsitiks toliau? Išmokų, pašalpų ir minimalių algų tai gi nesumažinsi. ',
  'Didės valstybės skola, kol niekas nebeskolins. O tada vis tiek nebus iš ',
  'ko mokėti pašalpų. Bėda, nes žmonės jau sėdę ant išmokų adatos. ',
  'Tai reiškiasi, kad į valdžią galiausiai ateis radikalai, kurie žadės dar ',
  'daugiau komunizmo ir valstybės išmokų. Tie radikalai bus durniai ir šalį ',
  'iš tikro valdys keli korumpuoti oligarchai. O visi kiti gyvens labai ',
  'prastai. Gerų įstatymų čia prileidote. Bet gal tie oligarchai ir jums ',
  'kokį kaulą numes. Jeigu geras būsite. Ir durnius.',
].join('');

export function initEndUI() {
  messageElem = document.getElementById('End-Message') as HTMLElement;
  reasonElem = document.getElementById('End-Reason') as HTMLElement;
  numberOfLawsElem = document.getElementById('End-N-Laws') as HTMLElement;
  restartButtonElem = document.getElementById('End-Restart') as HTMLElement;

  restartButtonElem.addEventListener('click', onRestartClicked);
}

export function renderEnd() {
  [reasonElem.innerText, messageElem.innerText] = getTexts();
  numberOfLawsElem.innerText = getNumberOfLawsText();
}

function getTexts(): [string, string] {
  if (stats.defense <= 0) {
    return [DefenseReasonText, DefenseStoryText];
  }
  if (stats.social <= 0) {
    return [SocialReasonText, SocialStoryText];
  }
  if (stats.finance <= 0) {
    return [FinanceReasonText, FinanceStoryText];
  }

  let unknownText = 'KLAIDA: neturėtumėte matyti šito teksto';
  return [unknownText, unknownText];
}

function getNumberOfLawsText(): string {
  if (stats.totalNumberOfLaws == 0) {
    return 'Jūs nesugebėjote priimti nė vieno įstatymo. Hmmmm... Šiaip tai neturėtų taip būti. Bet';
  } else if (stats.totalNumberOfLaws == 1) {
    return 'Jūs sugebėjote priimti tik vieną įstatymą ir tą tokį, kad';
  }

  return `Jūs sugebėjote priimti ${stats.totalNumberOfLaws} įstatymus, kurie privedė iki to, kad`;
}

function onRestartClicked() {
  onGameStart();
}
