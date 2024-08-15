import { Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import SchedulerBox from './SchedulerBox';
import SchedulerXLabels from './SchedulerXLabels';
import SchedulerYLabels from './SchedulerYLabels';
import {
  borderCSS, dailyTicks, getLocalizedTimes, getLocalizedWeekDays, isActive, rowHeightCSS,
} from './utils';
import type { SchedulerValue } from './utils';

type SchedulerDisplayProps = {
  schedules: Record<string, SchedulerValue>
};

function SchedulerDisplay({ schedules }: SchedulerDisplayProps) {
  const { i18n } = useTranslation();
  const dowLabels = getLocalizedWeekDays(i18n.language);
  const timeLabels = getLocalizedTimes(i18n.language);
  return (
    <Stack sx={{ height: '100%' }}>
      <SchedulerXLabels />
      <Stack direction="row">
        <SchedulerYLabels />
        <Stack
          direction="row"
          sx={{
            borderLeft: borderCSS,
            borderTop: borderCSS,
            height: `calc(${rowHeightCSS} * ${dailyTicks})`,
          }}
          className="not-draggable"
        >
          {
            [...Array(7).keys()].map((dayIndex) => (
              <Stack key={dayIndex}>
                {
                  [...Array(dailyTicks).keys()].map((tickIndex) => {
                    const active = Object.entries(schedules).reduce<string[]>(
                      (curr, [name, schedule]) => {
                        if (isActive(schedule, [dayIndex, tickIndex])) return [...curr, name];
                        return curr;
                      },
                      [],
                    );
                    return (
                      <Tooltip
                        title={(
                          <Stack alignItems="center">
                            <Typography variant="subtitle2" sx={{ textDecoration: 'underline' }}>
                              { `${dowLabels[dayIndex]} @ ${timeLabels[tickIndex]}` }
                            </Typography>
                            {
                              active.map((name) => (
                                <Typography variant="subtitle2">
                                  { name }
                                </Typography>
                              ))
                            }
                          </Stack>
                        )}
                        arrow
                        disableInteractive
                      >
                        <SchedulerBox
                          key={tickIndex}
                          level={active.length}
                          thin={tickIndex % 2 === 0}
                        />
                      </Tooltip>
                    );
                  })
                }
              </Stack>
            ))
        }
        </Stack>
      </Stack>
    </Stack>
  );
}

export default SchedulerDisplay;
