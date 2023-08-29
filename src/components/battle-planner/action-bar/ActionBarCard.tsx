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
    <GildedPaper elevation={0} sx={{ padding: '25px', width: '100%' }}>
      { children }
    </GildedPaper>
  );
}

export default ActionBarCard;
