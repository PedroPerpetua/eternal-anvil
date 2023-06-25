import { HTMLAttributes, PropsWithChildren } from 'react';

export type ActionBarTabProps = PropsWithChildren<{
  tabNumber: number,
  currentTab: number,
  hover: boolean,
  containerProps?: HTMLAttributes<HTMLDivElement>
}>;

function ActionBarTab(
  { tabNumber, currentTab, hover, children, containerProps }: ActionBarTabProps,
) {
  if (!(hover && tabNumber === currentTab)) return null;
  const propClassnames = containerProps?.className ?? '';
  return (
    <div
      role="tabpanel"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...containerProps}
      className={`${propClassnames} tab-content`}
    >
      { children }
    </div>
  );
}

export default ActionBarTab;
