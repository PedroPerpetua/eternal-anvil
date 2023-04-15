import { TextField, MenuItem, Typography } from '@mui/material';
import { DISTANCE_PENALTIES } from '../../constants';
import './MissionPenaltyInput.scss';


type MissionPenaltyInputProps = {
  value: number;
  setValue: (penalty: number) => void;
};

function MissionPenaltyInput({ value, setValue }: MissionPenaltyInputProps) {
  return (
    <TextField
      select
      label="Mission Type"
      className="mission-penalty-input"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
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
    </TextField>
  );
}

export default MissionPenaltyInput;
