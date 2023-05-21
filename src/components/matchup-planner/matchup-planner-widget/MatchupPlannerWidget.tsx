import { useEffect, useState } from 'react';
import { Fab, Icon, Modal } from '@mui/material';

import WarlordCropper from './WarlordCropper';
import SwordsIcon from '../../../assets/swords-icon.svg';
import { readFileAsURL } from '../../../utils/utilities';
import PasteArea from '../../common/paste-area/PasteArea';

import './MatchupPlannerWidget.scss';

function MatchupPlannerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string>('');

  const handlePaste = (file: File) => {
    readFileAsURL(file).then((url) => setImage(url));
  };

  const handleCrop = (croppedImage: string[]) => {
    console.log('CROPPED', croppedImage);
  };

  useEffect(() => {
    if (!isOpen) setImage('');
  }, [isOpen]);

  return (
    <>
      <Modal
        id="matchup-planner-widget-modal"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <PasteArea variant="single" onPaste={handlePaste}>
          <div className="container">
            {
          image === ''
            ? 'Upload image'
            : (
              <WarlordCropper image={image} onFinished={handleCrop} />

            )

        }
          </div>
        </PasteArea>
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
