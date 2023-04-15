import {
  Select, MenuItem, Typography,
} from '@mui/material';
import { DISTANCE_PENALTIES } from '../../constants';
import './MissionPenaltyInput.scss';


type MissionPenaltyInputProps = {
  value: number;
  setValue: (penalty: number) => void;
};

function MissionPenaltyInput({ value, setValue }: MissionPenaltyInputProps) {
  return (
    <Select
      label="Mission Type"
      value={value}
      onChange={(e) => setValue(e.target.value as number)}
      className="mission-penalty-input"
    >
      {
        Object.entries(DISTANCE_PENALTIES).map(
          ([key, penalty]) => (
            <MenuItem key={key} value={penalty.penalty}>
              <Typography display="inline">
                { ' ' }
                { penalty.shortName }
                { ' ' }
              </Typography>
              <Typography display="inline" color="gray">
                (+
                { ' ' }
                { penalty.penalty }
                )
              </Typography>
              <Typography>{ penalty.description }</Typography>
            </MenuItem>
          ),
        )
      }
    </Select>
  );
}

export default MissionPenaltyInput;
