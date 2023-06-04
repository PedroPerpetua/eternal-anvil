import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import App from './App';
import Theme from './components/website/Theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.scss';
import 'react-image-crop/src/ReactCrop.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
);
