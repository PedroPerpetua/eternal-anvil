import 'i18next';

import { resources, defaultNS, defaultLng } from '../translations/i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources[typeof defaultLng];
  }
}
