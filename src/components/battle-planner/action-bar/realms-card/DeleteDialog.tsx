import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { realmsTabActions, realmsTabSelectors } from '../../../../store/battle-planner/action-bar/realmsTabSlice';
import { useBattleMapSelector } from '../../../../store/battle-planner/battle-map';
import { deleteRealm, realmSelectors } from '../../../../store/battle-planner/battle-map/realmsSlice';

function DeleteDialog() {
  const dispatch = useAppDispatch();
  const showDelete = useAppSelector(realmsTabSelectors.showDelete);
  const current = useAppSelector(realmsTabSelectors.openRealm);
  const realmName = useBattleMapSelector((state) => {
    if (current === null) return null;
    const realm = realmSelectors.selectById(state.realms, current);
    return realm?.name ?? null;
  });
  if (realmName === null) return null;
  const handleClose = () => dispatch(realmsTabActions.setShowDelete(false));
  const handleDelete = () => {
    if (current) dispatch(deleteRealm(current));
    handleClose();
  };
  return (
    <Dialog open={showDelete} onClose={handleClose}>
      <DialogTitle>
        Are you sure you want to delete realm &quot;
        { realmName }
        &quot;?
      </DialogTitle>
      <DialogContent>
        This will also delete all associated structures and edges.
      </DialogContent>
      <DialogActions>
        <Button variant="text" autoFocus onClick={handleClose}>Cancel</Button>
        <Button color="error" onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
