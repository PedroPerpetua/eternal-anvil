import CalculatorsOverlay from './components/calculators/CalculatorsOverlay';
import ShowCalculatorsButton from './components/calculators/ShowCalculatorsButton';
import WebsiteLayout from './components/website/WebsiteLayout';

function App() {
  return (
    <WebsiteLayout>
      <ShowCalculatorsButton />
      <CalculatorsOverlay />
    </WebsiteLayout>
  );
}

export default App;
