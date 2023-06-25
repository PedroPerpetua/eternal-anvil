import { Container } from '@mui/material';

import BattlePlanner from './components/battle-planner/BattlePlanner';
import Footer from './components/website/footer/Footer';
import Header from './components/website/header/Header';

function App() {
  return (
    <div id="wrapper" className="no-select">
      <Header />
      <Container id="content" maxWidth="xl">
        <BattlePlanner />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
