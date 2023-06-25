import { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

function About() {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: Place content here

  return (
    <>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box className="modal-container noSelect">
          <Typography variant="h2">Eternal Anvil</Typography>
        </Box>
      </Modal>
      <Button onClick={() => setIsOpen(true)}>About</Button>
    </>
  );
}

export default About;
