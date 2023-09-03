import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';

import { useRealmsCardListContext } from './RealmsCardListContext';
import { useAppDispatch } from '../../../../store';
import { useBattleMapSelector } from '../../../../store/battleMap';
import { deleteRealm, realmSelectors } from '../../../../store/battleMap/realmsSlice';

type DeleteDialogProps = {
  open: boolean,
  onClose: () => void
};

function DeleteDialog({ open, onClose }: DeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { current } = useRealmsCardListContext();
  const realmName = useBattleMapSelector((state) => {
    if (current === null) return null;
    const realm = realmSelectors.selectById(state.realms, current);
    return realm?.name ?? null;
  });
  if (realmName === null) return null;
  const handleDelete = () => {
    if (current) dispatch(deleteRealm(current));
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Are you sure you want to delete realm &quot;
        { realmName }
        &quot;?
      </DialogTitle>
      <DialogContent>
        This will also delete all associated structures and edges.
      </DialogContent>
      <DialogActions>
        <Button variant="text" autoFocus onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
