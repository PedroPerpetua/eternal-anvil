import {
  Box, Fab, Modal, Typography,
} from '@mui/material';
import CalculatorIcon from '@mui/icons-material/Calculate';
import { useState } from 'react';
import CoordinateInput from '../coordinate-input/CoordinateInput';
import { Point } from '../../types';
import {
  calculateDistance, calculateTravelTime, formatSeconds,
} from '../../utilities';
import SpeedInput from '../speed-input/SpeedInput';
import MissionPenaltyInput from '../mission-penalty-input/MissionPenaltyInput';
import { INFINITE_CHAR } from '../../constants';
import './TravelSimulatorWidget.scss';


function TravelWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const initialPoint: Point = [Infinity, Infinity];
  const [startingPoint, setStartingPoint] = useState<Point>(initialPoint);
  const [endingPoint, setEndingPoint] = useState<Point>(initialPoint);
  const [penalty, setPenalty] = useState(0);
  const [speed, setSpeed] = useState<number>(Infinity); // units per hour

  const distance = calculateDistance(startingPoint, endingPoint, penalty);
  const travelTime = calculateTravelTime(distance, speed);

  const handleOpen = () => {
    // Make sure everything is cleared up when we open
    setStartingPoint(initialPoint);
    setEndingPoint(initialPoint);
    setPenalty(0);
    setSpeed(Infinity);
    setIsOpen(true);
  };

  return (
    <>
      <Modal
        id="distance-widget-modal"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box className="container">
          <Typography variant="h2">Travel Simulator</Typography>

          <CoordinateInput
            label="Starting point"
            value={startingPoint}
            setValue={(newValue) => setStartingPoint(newValue)}
          />
          <CoordinateInput
            label="Ending point"
            value={endingPoint}
            setValue={(newValue) => setEndingPoint(newValue)}
          />

          <SpeedInput
            label="Speed"
            value={speed}
            setValue={(v) => setSpeed(v)}
          />

          <MissionPenaltyInput
            value={penalty}
            setValue={(v) => setPenalty(v)}
          />

          <Typography>
            Distance:
            { ' ' }
            { Number.isInteger(distance) ? distance : INFINITE_CHAR }
          </Typography>
          <Typography color={speed === 0 ? 'gray' : 'black'}>
            Travel Time:
            { ' ' }
            { formatSeconds(travelTime) }
          </Typography>
        </Box>
      </Modal>

      <Fab
        id="distance-widget-fab"
        color="primary"
        onClick={handleOpen}
      >
        <CalculatorIcon />
      </Fab>
    </>
  );
}

export default TravelWidget;
