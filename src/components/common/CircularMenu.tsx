// Circular display based on https://stackoverflow.com/questions/12813573/position-icons-into-circle

import { PropsWithChildren, CSSProperties, ReactElement, Children } from 'react';
import { Box, Popover, SxProps } from '@mui/material';

type CircularMenuProps = PropsWithChildren<{
  open: boolean
  onClose?: () => void,
  anchorEl: HTMLElement,
  menuButton?: ReactElement,
  surfaceSx?: SxProps,
  radius?: CSSProperties['width'],
  startAngle?: number,
}>;

function CircularMenu({
  open,
  onClose,
  anchorEl,
  menuButton,
  surfaceSx = {},
  radius = '50px',
  startAngle = -Math.PI / 2,
  children,
}: CircularMenuProps) {
  const anglePartitionSize = (2 * Math.PI) / Children.count(children);
  const getAngle = (i: number) => i * anglePartitionSize + startAngle;

  return (
    <>
      { menuButton }
      { open && anchorEl && (
      <Popover
        open={open}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            sx: {
              overflow: 'visible',
              backgroundColor: 'transparent',
              pointerEvents: 'none',
              width: `calc(2*${radius})`,
              height: `calc(2*${radius})`,
              borderRadius: '100%',
              ...surfaceSx,
            },
            elevation: 0,
          },
        }}
        disablePortal
      >
        {
          Children.map(children, (child, i) => (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `
                    translate(-50%, -50%)
                    rotate(${getAngle(i)}rad)
                    translate(${radius})
                    rotate(${-getAngle(i)}rad)
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
              }}
            >
              { child }
            </Box>
          ))
        }
      </Popover>
      ) }
    </>
  );
}

export default CircularMenu;
