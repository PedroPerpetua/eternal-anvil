import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';

import { Id } from '../../../utils/types';

type WarlordCardProps = {
  id: Id,
  image: string,
  onDelete: () => void
};

function WarlordCard({ id, image, onDelete }: WarlordCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className="warlord-card"
      style={{
        backgroundImage: `url(${image})`,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      /* eslint-disable react/jsx-props-no-spreading */
      {...listeners}
      {...attributes}
      /* eslint-enable react/jsx-props-no-spreading */
    >
      <IconButton className="delete-button" onClick={onDelete}>
        <DeleteIcon htmlColor="darkred" />
      </IconButton>
    </div>
  );
}

export default WarlordCard;
