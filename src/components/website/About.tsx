import { useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  Box, Divider, Link, Modal, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Trans, useTranslation } from 'react-i18next';

import AboutImage from '../../assets/about-me.png';
import PrimaryGameButton from '../common/styled/PrimaryGameButton';

function About() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PrimaryGameButton onClick={() => setOpen(true)}>
        { t('website.about.button') }
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
            width: 'min(700px, 90vw)',
            maxHeight: '90dvh',
            overflowY: 'auto',
          }}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={8}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  { t('website.about.title') }
                </Typography>
                <Typography textAlign="justify">
                  <Trans
                    i18nKey="website.about.openSource"
                    components={[
                      <br />,
                      <Link
                        href="https://github.com/PedroPerpetua/eternal-anvil"
                        target="_blank"
                        rel="noopener"
                      >
                        <GitHubIcon fontSize="inherit" sx={{ marginRight: '1px' }} />
                        Github
                      </Link>,
                    ]}
                  />
                </Typography>
                <Divider />
                <Typography textAlign="justify">
                  <Trans
                    i18nKey="website.about.developer"
                    values={{
                      developer: 'Pedro Perpétua',
                      discord: 'warriorpp',
                    }}
                    components={[
                      <br />,
                      <Link href="https://www.pedroperpetua.com" target="_blank" rel="noopener" />,
                      <Typography component="i" />,
                    ]}
                  />
                </Typography>
                <Divider />
                <Typography textAlign="justify">
                  <Trans
                    i18nKey="website.about.travianDisclaimer"
                    components={[
                      <Link href="https://arkheim.com" target="_blank" rel="noopener" />,
                      <br />,
                      <Link href="https://www.traviangames.com/" target="_blank" rel="noopener" />,
                      <br />,
                    ]}
                  />
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={12} sm={4}>
              <img
                src={AboutImage}
                alt="pedro-perpetua"
                style={{ width: '100%' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}

export default About;
