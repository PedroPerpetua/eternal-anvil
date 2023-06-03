import { DragOverlay } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';

import './WarlordCard.scss';

type WarlordCardProps = {
  image: string,
  onDelete: () => void,
  selected?: boolean
};

function WarlordCard({ image, onDelete, selected = false }: WarlordCardProps) {
  return (
    <div className="warlord-card" style={{ opacity: selected ? 0.5 : 1 }}>
      <IconButton className="delete-button" onClick={onDelete}>
        <DeleteIcon htmlColor="darkred" />
      </IconButton>
      <div className="inner" style={{ backgroundImage: `url(${image})` }} />
    </div>
  );
}

type WarlordCardOverlayProps = {
  image: string | null,
};

export function WarlordCardOverlay({ image }: WarlordCardOverlayProps) {
  return (
    <DragOverlay modifiers={[snapCenterToCursor]}>
      { image && (
        <div className="warlord-card">
          <div className="inner" style={{ backgroundImage: `url(${image})` }} />
        </div>
      ) }
    </DragOverlay>

  );
}

export default WarlordCard;
