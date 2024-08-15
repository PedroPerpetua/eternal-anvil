import { useState } from 'react';
import { Stack } from '@mui/material';

import SchedulerBox from './SchedulerBox';
import SchedulerXLabels from './SchedulerXLabels';
import SchedulerYLabels from './SchedulerYLabels';
import {
  applyDelta, borderCSS, dailyTicks, isActive, rowHeightCSS,
} from './utils';
import type { SchedulerValue } from './utils';

type SchedulerProps = {
  value: SchedulerValue,
  onChange: (value: SchedulerValue) => void,
  backgroundPlaceholder?: SchedulerValue,
  invertBackground?: boolean,
};

function Scheduler({ value, onChange, backgroundPlaceholder, invertBackground }: SchedulerProps) {
  const [hovering, setHovering] = useState<[number, number] | null>(null);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);

  const cellLevel = (col: number, row: number) => {
    const schedule = (startPoint && hovering) ? applyDelta(value, startPoint, hovering) : value;
    const active = isActive(schedule, [col, row]);
    if (active) return invertBackground ? 8 : 15;
    if (!backgroundPlaceholder) return 0;
    if (isActive(backgroundPlaceholder, [col, row])) return invertBackground ? 15 : 8;
    return 0;
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <SchedulerXLabels />
      <Stack direction="row">
        <SchedulerYLabels />
        <Stack
          direction="row"
          onMouseLeave={() => setHovering(null)}
          onMouseDown={() => {
            if (startPoint !== null || hovering === null) return;
            setStartPoint(hovering);
          }}
          onMouseUp={() => {
            if (startPoint === null) return;
            if (hovering) onChange(applyDelta(value, startPoint, hovering));
            setStartPoint(null);
          }}
          sx={{
            borderLeft: borderCSS,
            borderTop: borderCSS,
            height: `calc(${rowHeightCSS} * ${dailyTicks})`,
          }}
          className="clickable"
        >
          {
            [...Array(7).keys()].map((dayIndex) => (
              <Stack key={dayIndex}>
                {
                  [...Array(dailyTicks).keys()].map((tickIndex) => (
                    <SchedulerBox
                      key={tickIndex}
                      level={cellLevel(dayIndex, tickIndex)}
                      onMouseEnter={() => setHovering([dayIndex, tickIndex])}
                      thin={tickIndex % 2 === 0}
                    />
                  ))
                }
              </Stack>
            ))
        }
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Scheduler;
