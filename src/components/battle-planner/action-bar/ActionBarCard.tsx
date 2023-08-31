import { PropsWithChildren } from 'react';

import { TabId, useActionBarContext } from './ActionBarContext';
import GildedPaper from '../../common/styled-components/GildedPaper';

type ActionBarCardProps = PropsWithChildren<{
  value: TabId
}>;

function ActionBarCard({ value, children }: ActionBarCardProps) {
  const { current } = useActionBarContext();
  if (current !== value) return null;
  return (
    // Apply minWidth=0 so it doesn't expand past the rest of the flexbox
    <GildedPaper elevation={0} sx={{ padding: '25px', flex: 1, minWidth: 0 }}>
      { children }
    </GildedPaper>
  );
}

export default ActionBarCard;
