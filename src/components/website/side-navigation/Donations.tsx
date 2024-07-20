import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import GameButton from '../../common/styled/GameButton';
import Modal from '../../common/styled/Modal';

function Donations() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <GameButton onClick={() => setOpen(true)}>
        { t('website.donations.button') }
      </GameButton>
      <Modal open={open} onClose={() => setOpen(false)}>
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
      </Modal>
    </>
  );
}

export default Donations;