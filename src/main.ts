import * as cfg from './cfg';
import { renderPlaying, initPlayingUI } from './playing/ui';
import { initStartUI, renderStart } from './start';
import { initEndUI, renderEnd } from './end';
import { initDirectorUI, run } from './director';

initPlayingUI();
initStartUI();
initEndUI();
initDirectorUI();

run();
