import { useState } from 'react';
import { Grid, TabProps } from '@mui/material';

import RealmPicker from './RealmPicker';
import AddStructureIcon from '../../../../assets/add-structure-icon.png';
import useBattleMapStore from '../../../../hooks/useBattleMapStore';
import { EMPTY_POINT } from '../../../../utils/constants';
import { Id, Point } from '../../../../utils/types';
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
  const { teams } = useBattleMapStore();
  const icon = useTintedImage(AddStructureIcon, ICON_COLOR);
  const [coordinate, setCoordinate] = useState<Point>(EMPTY_POINT);
  const [realm, setRealm] = useState<Id>(teams[0].id);
  return (
    <ActionBarTabContent
      tabNumber={TAB_NUMBER}
      backgroundColor={COLOR}
      avatarSrc={icon}
      title="Add Structure"
    >
      <Grid container>
        <Grid item xs={12}>
          <RealmPicker value={realm} onChange={(realmId) => setRealm(realmId)} />
        </Grid>
      </Grid>
      <CoordinateInput label="" value={coordinate} setValue={(p) => setCoordinate(p)} />
    </ActionBarTabContent>
  );
}
