import { useState } from 'react';
import CalculatorIcon from '@mui/icons-material/Calculate';
import {
  Box, Fab, Modal, Typography,
} from '@mui/material';

import { INFINITE_CHAR, EMPTY_POINT } from '../../../utils/constants';
import { calcDistance, calcTravelTime } from '../../../utils/math';
import { Point } from '../../../utils/types';
import { formatSeconds } from '../../../utils/utilities';
import CoordinateInput from '../../common/coordinate-input/CoordinateInput';
import MissionPenaltyInput from '../../common/mission-penalty-input/MissionPenaltyInput';
import SpeedInput from '../../common/speed-input/SpeedInput';

import './TravelSimulatorWidget.scss';

function TravelWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [startingPoint, setStartingPoint] = useState<Point>(EMPTY_POINT);
  const [endingPoint, setEndingPoint] = useState<Point>(EMPTY_POINT);
  const [penalty, setPenalty] = useState(0);
  const [speed, setSpeed] = useState<number>(Infinity); // units per hour

  const distance = calcDistance(startingPoint, endingPoint, penalty);
  const travelTime = calcTravelTime(distance, speed);

  const handleOpen = () => {
    // Make sure everything is cleared up when we open
    setStartingPoint(EMPTY_POINT);
    setEndingPoint(EMPTY_POINT);
    setPenalty(0);
    setSpeed(Infinity);
    // Open the modal
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
            { Number.isFinite(distance) ? distance : INFINITE_CHAR }
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
