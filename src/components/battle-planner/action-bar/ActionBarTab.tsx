import { PropsWithChildren } from 'react';
import {
  Tab, TabProps, Avatar, Card, CardContent, CardHeader,
} from '@mui/material';
import { useRecoilValue } from 'recoil';

import { actionBar_activeTab, actionBar_hovering } from './atoms';
import { shadeColor } from '../../../utils/images';
import { HexColor } from '../../../utils/types';
import CustomIcon from '../../common/custom-icon/CustomIcon';

type ActionBarTabProps = TabProps & {
  iconSrc: string,
};

/* eslint-disable-next-line react/destructuring-assignment */
export function ActionBarTab(props: ActionBarTabProps) {
  const { iconSrc, color, ...tabProps } = props;
  return (
    <Tab
      className="tab settings-tab"
      icon={<CustomIcon src={iconSrc} size="large" />}
      style={{ backgroundColor: color }}
      TouchRippleProps={{ style: { color: shadeColor(color as HexColor, 100) } }}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...tabProps}
    />
  );
}

type ActionBarTabContentProps = PropsWithChildren< {
  tabNumber: number,
  avatarSrc: string,
  title: string,
  backgroundColor: HexColor,
}>;

export function ActionBarTabContent({
  tabNumber,
  avatarSrc,
  title,
  children,
  backgroundColor,
}: ActionBarTabContentProps) {
  const hover = useRecoilValue(actionBar_hovering);
  const activeTab = useRecoilValue(actionBar_activeTab);
  if (!(hover && tabNumber === activeTab)) return null;
  return (
    <div role="tabpanel" className="tab-content">
      <Card className="tab-card" style={{ backgroundColor }}>
        <CardHeader
          className="card-header"
          avatar={(
            <Avatar className="center-content" imgProps={{ className: 'center-content' }}>
              <CustomIcon src={avatarSrc} size="large" />
            </Avatar>
          )}
          title={title}
          titleTypographyProps={{ variant: 'h5' }}
        />
        <CardContent className="card-content">
          { children }
        </CardContent>
      </Card>
    </div>
  );
}
