import { festivalsHandlers } from '@/mocks/handlers/festivals';
import { artistsHandlers } from '@/mocks/handlers/artists';
import { hostsHandlers } from '@/mocks/handlers/hosts';
import { searchHandlers } from '@/mocks/handlers/search';
import { adminAuthHandlers } from '@/mocks/handlers/adminAuth';
import { adminFestivalsHandlers } from '@/mocks/handlers/adminFestivals';

// lost-items는 P1로 보류 — 준비되면 handlers/lostItems.ts를 만들어 여기 추가할 것.
export const handlers = [
  ...festivalsHandlers,
  ...artistsHandlers,
  ...hostsHandlers,
  ...searchHandlers,
  ...adminAuthHandlers,
  ...adminFestivalsHandlers,
];
