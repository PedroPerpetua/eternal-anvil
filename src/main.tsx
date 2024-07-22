import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import queryClient from './api/queryClient';
import App from './App';
import store from './store';
import theme from './theme';
import './translations/i18n';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <SnackbarProvider dense anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ReduxProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
