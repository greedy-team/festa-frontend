import { festivalsHandlers } from './festivals';
import { artistsHandlers } from './artists';
import { hostsHandlers } from './hosts';
import { searchHandlers } from './search';

// lost-items는 P1로 보류 — 준비되면 handlers/lostItems.ts를 만들어 여기 추가할 것.
export const handlers = [
  ...festivalsHandlers,
  ...artistsHandlers,
  ...hostsHandlers,
  ...searchHandlers,
];
