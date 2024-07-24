import { Box, Paper } from '@mui/material';

import LoginForm from '../components/website/LoginForm';

function LoginPage() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper sx={{ color: 'primary.contrastText', width: 'min(500px, 90vw)', padding: '25px' }}>
        <LoginForm />
      </Paper>
    </Box>
  );
}

export default LoginPage;
