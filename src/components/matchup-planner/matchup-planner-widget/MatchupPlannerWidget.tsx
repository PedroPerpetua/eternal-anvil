import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Fab, Icon, Modal, Grid } from '@mui/material';

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
    activeItem: leftActiveItem,
    addSortableItem: addLeftImage,
    removeSortableItem: removeLeftImage,
    handlers: leftHandlers,
    sensors: leftSensors,
  } = useSortableContext<'bench' | 'active', string>(['bench', 'active']);
  const {
    items: rightImages,
    activeItem: rightActiveItem,
    addSortableItem: addRightImage,
    removeSortableItem: removeRightImage,
    handlers: rightHandlers,
    sensors: rightSensors,
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
                  containerId="bench"
                  images={leftImages.get('bench') ?? []}
                  removeImage={removeLeftImage}
                  activeId={leftActiveItem?.id}
                />
              </Grid>
              <Grid xs={3}>
                <WarlordList
                  containerId="active"
                  images={leftImages.get('active') ?? []}
                  removeImage={removeLeftImage}
                  activeId={leftActiveItem?.id}
                />
              </Grid>
              <WarlordCardOverlay image={leftActiveItem?.value ?? null} />
            </DndContext>
            <DndContext
              /* eslint-disable react/jsx-props-no-spreading */
              {...rightHandlers}
              /* eslint-enable react/jsx-props-no-spreading */
              sensors={rightSensors}
            >
              <Grid xs={3}>
                <WarlordList
                  containerId="active"
                  images={rightImages.get('active') ?? []}
                  removeImage={removeRightImage}
                  activeId={rightActiveItem?.id}
                />
              </Grid>
              <Grid xs={3}>
                <WarlordCropper onFinished={(i) => addRightImage('bench', ...i)} />
                <WarlordList
                  containerId="bench"
                  images={rightImages.get('bench') ?? []}
                  removeImage={removeRightImage}
                  activeId={rightActiveItem?.id}
                />
              </Grid>
              <WarlordCardOverlay image={rightActiveItem?.value ?? null} />
            </DndContext>
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
