import { useRef, useState } from 'react';
import {
  Menu, MenuItem, Stack, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { gameColors } from '../../theme';
import FlagIcon from '../../translations/FlagIcon';
import { supportedLngs } from '../../translations/i18n';
import { languageNameFromCode } from '../../translations/utils';
import PrimaryGameButton from '../common/styled/PrimaryGameButton';

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
        startIcon={isMobile ? null : flagEl}
        onClick={() => setOpen(true)}
        sx={{ minWidth: isMobile ? undefined : '150px' }}
      >
        { isMobile ? flagEl : languageNameFromCode(i18n.language) }
      </PrimaryGameButton>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
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
