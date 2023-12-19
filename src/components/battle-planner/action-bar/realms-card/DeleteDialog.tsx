import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { realmsTabActions, realmsTabSelectors } from '../../../../store/battle-planner/action-bar/realmsTabSlice';
import { realmsActions } from '../../../../store/battle-planner/battle-map/realmsSlice';

function DeleteDialog() {
  const dispatch = useAppDispatch();
  const showDelete = useAppSelector(realmsTabSelectors.showDelete);
  const realm = useAppSelector(realmsTabSelectors.openRealm);
  if (!realm) return null;

  const handleClose = () => dispatch(realmsTabActions.setShowDelete(false));
  const handleDelete = () => {
    dispatch(realmsActions.deleteRealm({ realmId: realm.id }));
    handleClose();
  };
  return (
    <Dialog open={showDelete} onClose={handleClose}>
      <DialogTitle>
        Are you sure you want to delete realm &quot;
        { realm.name }
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
