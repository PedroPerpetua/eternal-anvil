import { useState } from 'react';
import { Box, Modal, Stack, Typography } from '@mui/material';

import SecondaryGameButton from '../common/styled/SecondaryGameButton';

function Donations() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SecondaryGameButton onClick={() => setOpen(true)}>
        Help keep the site running
      </SecondaryGameButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '5px',
            width: 'min(500px, 90vw)',
            maxHeight: '90dvh',
            overflowY: 'auto',
          }}
        >
          <Stack>
            <Typography variant="h6">
              Thank you for using the Eternal Anvil!
            </Typography>
            <Typography>
              If you wish to help with the website upkeep costs, or show appreciation for my work,
              you can leave a donation here!
            </Typography>
            <Typography variant="subtitle2">
              Donations are in no way required. Take care of yourself first.
            </Typography>
            <iframe
              id="kofiframe"
              src="https://ko-fi.com/pedroperpetua/?hidefeed=true&widget=true&embed=true&preview=true"
              style={{ border: 'none', overflow: 'hidden', marginTop: '10px' }}
              height="570px"
              scrolling="no" // Even though deprecated, this works over overflow "hidden"
              title="pedroperpetua"
            />
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default Donations;
