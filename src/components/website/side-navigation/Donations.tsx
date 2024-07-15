import { useState } from 'react';
import { Box, Modal, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import PrimaryGameButton from '../../common/styled/PrimaryGameButton';

function Donations() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PrimaryGameButton onClick={() => setOpen(true)}>
        { t('website.donations.button') }
      </PrimaryGameButton>
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
              { t('website.donations.title') }
            </Typography>
            <Typography>
              { t('website.donations.content') }
            </Typography>
            <Typography variant="subtitle2">
              { t('website.donations.disclaimer') }
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
