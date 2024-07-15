import { useRef, useState } from 'react';
import {
  Menu, MenuItem, Stack, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { gameColors } from '../../../theme';
import FlagIcon from '../../../translations/FlagIcon';
import { supportedLngs } from '../../../translations/i18n';
import { languageNameFromCode } from '../../../translations/utils';
import PrimaryGameButton from '../../common/styled/PrimaryGameButton';

function LanguageSelector() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const flagEl = (<FlagIcon lngCode={i18n.language} />);

  return (
    <>
      <PrimaryGameButton
        ref={anchorRef}
        startIcon={flagEl}
        onClick={() => setOpen(true)}
      >
        { languageNameFromCode(i18n.language) }
      </PrimaryGameButton>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
        anchorOrigin={
          isMobile
            ? { vertical: 'top', horizontal: 'center' }
            : { vertical: 'bottom', horizontal: 'right' }
        }
        transformOrigin={
          isMobile
            ? { vertical: 'bottom', horizontal: 'center' }
            : { vertical: 'bottom', horizontal: 'left' }
        }
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'primary.main',
              color: gameColors.teal.contrastText,
              border: '1px solid',
              borderColor: gameColors.gold.light,
              outline: '1px solid',
              outlineColor: gameColors.gold.dark,
            },
          },
        }}
        MenuListProps={{
          sx: isMobile ? { width: anchorRef.current && anchorRef.current.offsetWidth } : undefined,
        }}
        marginThreshold={0}
      >
        {
          supportedLngs.map((lngCode) => (
            <MenuItem
              key={lngCode}
              onClick={() => {
                i18n.changeLanguage(lngCode);
                setOpen(false);
              }}
            >
              <Stack direction="row" spacing={1}>
                <FlagIcon lngCode={lngCode} />
                <Typography>
                  { languageNameFromCode(lngCode) }
                </Typography>
              </Stack>
            </MenuItem>
          ))
        }
      </Menu>
    </>
  );
}

export default LanguageSelector;
