import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { colWidthCSS, rowHeightCSS, borderCSS, thinBorderCSS } from './utils';

type SchedulerBoxExtraProps = {
  level: number,
  thin?: boolean
};

const SchedulerBox = styled(
  Box,
  { shouldForwardProp: (p) => !['level', 'thin'].includes(p) },
)<SchedulerBoxExtraProps>(({ level, thin = false }) => ({
  width: colWidthCSS,
  height: rowHeightCSS,
  border: borderCSS,
  borderTop: 'none',
  borderLeft: 'none',
  ...level && {
    backgroundColor: `#ACC8E5${(255 - 12 * (15 - level)).toString(16)}`,
  },
  ...thin && {
    borderBottom: thinBorderCSS,
  },
}));

export default SchedulerBox;
