import { Box, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colWidthCSS, getLocalizedWeekDays } from './utils';

function SchedulerXLabels() {
  const { i18n } = useTranslation();
  const labels = getLocalizedWeekDays(i18n.language);
  return (
    <Stack direction="row" alignSelf="flex-end">
      {
        labels.map((day) => (
          <Box
            key={day}
            sx={{
              width: colWidthCSS,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>{ day }</Typography>
          </Box>
        ))
      }
    </Stack>
  );
}

export default SchedulerXLabels;
