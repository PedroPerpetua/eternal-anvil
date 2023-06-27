import { atom } from 'recoil';

// Atoms to have more clean state flow
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const actionBar_hovering = atom<boolean>({
  key: 'actionBar_hovering',
  default: false,
});
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const actionBar_activeTab = atom<number>({
  key: 'actionBar_activeTab',
  default: 1, // 0 is an invisible tab
});
