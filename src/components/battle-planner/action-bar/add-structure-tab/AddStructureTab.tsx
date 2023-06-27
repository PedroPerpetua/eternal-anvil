import { useState } from 'react';
import { TabProps } from '@mui/material';

import AddStructureIcon from '../../../../assets/add-structure-icon.png';
import { EMPTY_POINT } from '../../../../utils/constants';
import { Point } from '../../../../utils/types';
import CoordinateInput from '../../../common/coordinate-input/CoordinateInput';
import useTintedImage from '../../hooks/useTintedImage';
import { ActionBarTab, ActionBarTabContent } from '../ActionBarTab';

const TAB_NUMBER = 1; // 0 is an invisible tab
const COLOR = '#326054';
const ICON_COLOR = '#d7ba67';

export function AddStructureTab(tabProps: TabProps) {
  const icon = useTintedImage(AddStructureIcon, ICON_COLOR);
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  return <ActionBarTab value={TAB_NUMBER} color={COLOR} iconSrc={icon} {...tabProps} />;
}

export function AddStructureTabContent() {
  const icon = useTintedImage(AddStructureIcon, ICON_COLOR);
  const [coordinate, setCoordinate] = useState<Point>(EMPTY_POINT);
  return (
    <ActionBarTabContent
      tabNumber={TAB_NUMBER}
      backgroundColor={COLOR}
      avatarSrc={icon}
      title="Add Structure"
    >
      <CoordinateInput label="" value={coordinate} setValue={(p) => setCoordinate(p)} />
    </ActionBarTabContent>
  );
}
