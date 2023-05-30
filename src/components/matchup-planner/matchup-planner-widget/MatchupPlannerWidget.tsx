import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import {
  Fab, Icon, Modal, Grid,
} from '@mui/material';

import { WarlordCardOverlay } from './WarlordCard';
import WarlordCropper from './WarlordCropper';
import WarlordList from './WarlordList';
import SwordsIcon from '../../../assets/swords-icon.svg';
import useSortableContext from '../../../hooks/useSortableContext';

import './MatchupPlannerWidget.scss';

function MatchupPlannerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items: leftImages,
    activeItem,
    addSortableItem: addLeftImage,
    removeSortableItem: removeLeftImage,
    handlers: leftHandlers,
    sensors: leftSensors,
  } = useSortableContext<'bench' | 'active', string>(['bench', 'active']);

  return (
    <>
      <Modal
        id="matchup-planner-widget-modal"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="modal-container">
          <Grid container>
            <DndContext
              /* eslint-disable react/jsx-props-no-spreading */
              {...leftHandlers}
              /* eslint-enable react/jsx-props-no-spreading */
              sensors={leftSensors}
            >
              <Grid xs={3}>
                <WarlordCropper onFinished={(i) => addLeftImage('bench', ...i)} />
                <WarlordList
                  images={leftImages.get('bench') ?? []}
                  removeImage={removeLeftImage}
                  activeId={activeItem?.id}
                />
              </Grid>
              <Grid xs={3}>
                <WarlordList
                  images={leftImages.get('active') ?? []}
                  removeImage={removeLeftImage}
                  activeId={activeItem?.id}
                />
              </Grid>
              <WarlordCardOverlay image={activeItem?.value ?? null} />
            </DndContext>
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
