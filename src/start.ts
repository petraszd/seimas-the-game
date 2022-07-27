import { onGameStart } from './director';

let startButton: HTMLInputElement;

export function initStartUI() {
  startButton = document.getElementById('Start-Start') as HTMLInputElement;
  startButton.addEventListener('click', onStartClick);
}

function onStartClick(e: Event) {
  e.preventDefault();
  onGameStart();
}

export function renderStart() {
  // Do nothing for now
}
