import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import { AddStructureTab, AddStructureTabContent } from './add-structure-tab/AddStructureTab';
import { actionBar_activeTab, actionBar_hovering } from './atoms';
import { RealmsTab, RealmsTabContent } from './realms-tab/RealmsTab';
import { SettingsTab, SettingsTabContent } from './settings-tab/SettingsTab';
import { battleMap_draggingMap } from '../battle-map/map-drag-controller/MapDragController';

import './ActionBar.scss';

function ActionBar() {
  const draggingMap = useRecoilValue(battleMap_draggingMap);
  const setHovering = useSetRecoilState(actionBar_hovering);
  const [activeTab, setActiveTab] = useRecoilState(actionBar_activeTab);
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
        value={activeTab}
        className="tabs-container"
        orientation="vertical"
        onChange={(e, v) => setActiveTab(v)}
        TabIndicatorProps={{ hidden: true }}
      >
        <Tab disabled /* invisible tab */ />
        <AddStructureTab />
        <RealmsTab />
        <SettingsTab />
        <Tab disabled /* invisible tab */ />
      </Tabs>
      <AddStructureTabContent />
      <RealmsTabContent />
      <SettingsTabContent />
    </div>
  );
}

export default ActionBar;
