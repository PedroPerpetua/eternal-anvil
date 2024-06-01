import { useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  Box, Divider, Link, Modal, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import AboutImage from '../../assets/about-me.png';
import PrimaryGameButton from '../common/styled/PrimaryGameButton';

function About() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PrimaryGameButton onClick={() => setOpen(true)}>
        About
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
            width: 'min(600px, 90vw)',
            maxHeight: '90dvh',
            overflowY: 'auto',
          }}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={8}>
              <Stack spacing={2}>
                <Stack>
                  <Typography variant="h6">The Eternal Anvil project</Typography>
                  <Typography textAlign="justify">
                    This project is open source.
                    <br />
                    For suggestions, contributions, and bug reports, please visit
                    { ' ' }
                    <Link
                      href="https://github.com/PedroPerpetua/eternal-anvil"
                      target="_blank"
                      rel="noopener"
                    >
                      <GitHubIcon fontSize="inherit" />
                      Github
                    </Link>
                    .
                  </Typography>
                </Stack>
                <Divider />
                <Stack>
                  <Typography>
                    This project was developed by Pedro Perpétua.
                  </Typography>
                  <Typography>
                    You can visit my website
                    { ' ' }
                    <Link
                      href="https://www.pedroperpetua.com"
                      target="_blank"
                      rel="noopener"
                    >
                      here
                    </Link>
                    .
                  </Typography>
                  <Typography>
                    Find me on Discord under
                    { ' ' }
                    <i>warriorpp</i>
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={12} sm={4} display="flex" justifyContent="center">
              <img
                src={AboutImage}
                alt="pedro-perpetua"
                style={{ width: '100%', maxWidth: '150px' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}

export default About;
