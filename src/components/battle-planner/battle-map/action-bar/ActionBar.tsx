import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useRecoilValue } from 'recoil';

import SettingsTab from './settings-tab/SettingsTab';
import AddStructureIcon from '../../../../assets/add-structure-icon.png';
import SettingsIcon from '../../../../assets/settings-icon.png';
import CustomIcon from '../../../common/custom-icon/CustomIcon';
import { battleMap_draggingMap } from '../map-drag-controller/MapDragController';

import './ActionBar.scss';

function ActionBar() {
  const draggingMap = useRecoilValue(battleMap_draggingMap);
  const [hovering, setHovering] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [containerMaxHeight, setContainerMaxHeight] = useState<string>('inherit');
  const onMount = (containerDiv: HTMLDivElement | null) => {
    // Set the max-height to the height of the tabs
    if (!containerDiv || !containerDiv.firstElementChild) return;
    setContainerMaxHeight(`${containerDiv.firstElementChild.clientHeight}px`);
  };
  return (
    <div
      id="action-bar"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        height: containerMaxHeight,
        opacity: draggingMap ? '25%' : 'inherit',
        pointerEvents: draggingMap ? 'none' : 'inherit',
      }}
      ref={onMount}
    >

      <Tabs
        value={currentTab}
        className="tabs-container"
        orientation="vertical"
        onChange={(e, v) => setCurrentTab(v)}
        TabIndicatorProps={{ sx: { top: 0 }, hidden: !hovering }}
      >
        <Tab
          className="tab settings-tab"
          icon={<CustomIcon src={AddStructureIcon} size="large" />}
        />
        <Tab className="tab settings-tab" icon={<CustomIcon src={SettingsIcon} size="large" />} />
        <Tab className="tab settings-tab" icon={<CustomIcon src={SettingsIcon} size="large" />} />
        <Tab className="tab settings-tab" icon={<CustomIcon src={SettingsIcon} size="large" />} />
        <Tab className="tab settings-tab" icon={<CustomIcon src={SettingsIcon} size="large" />} />
        <Tab className="tab settings-tab" icon={<CustomIcon src={SettingsIcon} size="large" />} />
      </Tabs>
      <SettingsTab tabNumber={1} currentTab={currentTab} hover={hovering} />
    </div>
  );
}

export default ActionBar;
