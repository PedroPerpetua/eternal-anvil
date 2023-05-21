import DeleteIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';

type WarlordCardProps = {
  image: string,
  onDelete: () => void
};

function WarlordCard({ image, onDelete }: WarlordCardProps) {
  return (
    <div className="warlord-card" style={{ backgroundImage: `url(${image})` }}>
      <IconButton className="delete-button" onClick={onDelete}>
        <DeleteIcon htmlColor="darkred" />
      </IconButton>
    </div>
  );
}

export default WarlordCard;
