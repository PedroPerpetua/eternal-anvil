import { TabProps } from '@mui/material';

import RealmsIcon from '../../../../assets/realms-icon.png';
import { ActionBarTab, ActionBarTabContent } from '../ActionBarTab';

const TAB_NUMBER = 2;
const COLOR = '#442f29';

export function RealmsTab(tabProps: TabProps) {
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  return <ActionBarTab value={TAB_NUMBER} color={COLOR} iconSrc={RealmsIcon} {...tabProps} />;
}

export function RealmsTabContent() {
  return (
    <ActionBarTabContent
      tabNumber={TAB_NUMBER}
      backgroundColor={COLOR}
      avatarSrc={RealmsIcon}
      title="Realms"
    />
  );
}
