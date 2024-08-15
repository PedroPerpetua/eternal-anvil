import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getLocalizedTimes, rowHeightCSS } from './utils';

function SchedulerYLabels() {
  const { i18n } = useTranslation();
  const labels = getLocalizedTimes(i18n.language);

  return (
    <Stack sx={{ marginRight: '3px' }}>
      {
        labels.map((label, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={i} sx={{ height: rowHeightCSS }}>
            <Typography
              noWrap
              sx={{ fontSize: 10, transform: 'translate(0, -50%)', textAlign: 'right' }}
            >
              { label }
            </Typography>
          </Box>
        ))
      }
    </Stack>
  );
}

export default SchedulerYLabels;
