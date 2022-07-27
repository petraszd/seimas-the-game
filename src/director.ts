import { renderPlaying } from './playing/ui';
import { renderStart } from './start';
import { renderEnd } from './end';
import { startPlaying } from './playing/logic';
import * as cfg from './cfg';

export enum GameState {
  Start,
  Playing,
  End
}

let currentGameState: GameState = GameState.Start;

let playingSection: HTMLElement;
let startSection: HTMLElement;
let endSection: HTMLElement;
let gameSections: HTMLElement[];

export function initDirectorUI() {
  playingSection = document.getElementById('GameState-Playing') as HTMLElement;
  startSection = document.getElementById('GameState-Start') as HTMLElement;
  endSection = document.getElementById('GameState-End') as HTMLElement;
  gameSections = [
    startSection,
    playingSection,
    endSection
  ];
}

export function onGameStart() {
  toNewGameState(GameState.Playing);
}

export function onGameOver() {
  setTimeout(function() {
    toNewGameState(GameState.End);
  }, cfg.delayGameEndTime);
}

export function run() {
  render();
}

function render() {
  switch (currentGameState) {
    case GameState.Start:
      renderStart();
      break;
    case GameState.Playing:
      renderPlaying();
      break;
    case GameState.End:
      renderEnd();
      break;
  }
  renderPlaying();
}

function toNewGameState(newState: GameState) {
  currentGameState = newState;

  let currentSection: HTMLElement | null = null;
  switch (newState) {
    case GameState.Start:
      currentSection = startSection;
      break;
    case GameState.Playing:
      currentSection = playingSection;
      startPlaying();
      break;
    case GameState.End:
      currentSection = endSection;
      break;
  }

  for (let i = 0, section; section = gameSections[i]; ++i) {
    if (section == currentSection) {
      section.style.display = '';
    } else {
      section.style.display = 'none';
    }
  }

  render();
}
