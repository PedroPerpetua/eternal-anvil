import { SvgIcon } from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import {
  DE, GB as EN, ES, FR, PT, RU,
} from 'country-flag-icons/react/3x2';
import type { FlagComponent as FlagComponentType } from 'country-flag-icons/react/3x2';

import { SupportedLanguage } from './i18n';

const flagMap: Record<SupportedLanguage, FlagComponentType> = {
  de: DE,
  en: EN,
  es: ES,
  fr: FR,
  pt: PT,
  ru: RU,
};

type FlagIconProps = {
  lngCode: string,
} & SvgIconProps;

function FlagIcon({ lngCode, sx, ...props }: FlagIconProps) {
  const FlagComponent = flagMap[lngCode as SupportedLanguage];
  return (
    <SvgIcon sx={{ color: 'black', ...sx }} {...props}>
      <FlagComponent />
    </SvgIcon>
  );
}

export default FlagIcon;
