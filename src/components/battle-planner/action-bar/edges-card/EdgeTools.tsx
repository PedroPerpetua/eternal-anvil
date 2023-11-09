import { ReactNode } from 'react';

import AddEdgeIcon from '../../../../assets/add-edge-icon.png';
import ViewIcon from '../../../../assets/view-icon.png';
import { EdgeToolMode } from '../../../../store/battle-planner/action-bar/edgesTabSlice';
import CustomIcon from '../../../common/CustomIcon';
import DeleteIcon from '../../../common/styled-components/DeleteIcon';

function ViewIconComponent() {
  return <CustomIcon src={ViewIcon} tintColor="#d8bc68" size="large" />;
}

function SelectIconComponent() {
  return <CustomIcon src={AddEdgeIcon} tintColor="#d8bc68" />;
}

function DeleteIconComponent() {
  return <DeleteIcon color="error" />;
}

const EDGE_TOOLS: Record<EdgeToolMode, { label: string, icon: ReactNode }> = {
  view: {
    label: 'View mode',
    icon: <ViewIconComponent />,
  },
  select: {
    label: 'Select mode',
    icon: <SelectIconComponent />,
  },
  delete: {
    label: 'Delete mode',
    icon: <DeleteIconComponent />,
  },
};

export default EDGE_TOOLS;
