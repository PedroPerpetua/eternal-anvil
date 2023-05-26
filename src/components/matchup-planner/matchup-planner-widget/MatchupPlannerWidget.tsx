import { useState } from 'react';
import {
  Fab, Icon, Modal, Grid,
} from '@mui/material';

import WarlordCropper from './WarlordCropper';
import WarlordList from './WarlordList';
import SwordsIcon from '../../../assets/swords-icon.svg';
import useSortableState from '../../../hooks/useSortableState';

import './MatchupPlannerWidget.scss';

function MatchupPlannerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items: leftImages,
    addItem: addLeftImage,
    removeItem: removeLeftImage,
    moveItemDragEndEventHandler: moveLeftImageHandler,
  } = useSortableState<string>([]);

  return (
    <>
      <Modal
        id="matchup-planner-widget-modal"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="modal-container">
          <Grid container>
            <Grid xs={3}>
              <WarlordCropper onFinished={(i) => addLeftImage(...i)} />
              <WarlordList
                images={leftImages}
                removeImage={removeLeftImage}
                moveImageHandler={moveLeftImageHandler}
              />
            </Grid>
            <Grid xs={3} />
            <Grid xs={3} />
            <Grid xs={3}>
              <WarlordCropper onFinished={(i) => {}} />
            </Grid>
          </Grid>
        </div>
      </Modal>
      <Fab id="matchup-planner-widget-fab" onClick={() => setIsOpen(true)}>
        <Icon>
          <img src={SwordsIcon} alt="" />
        </Icon>
      </Fab>
    </>
  );
}

export default MatchupPlannerWidget;
