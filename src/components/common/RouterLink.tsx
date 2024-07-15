import { forwardRef } from 'react';
import { LinkProps as MUILinkProps } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * This component is to be used as the component for Links in MUI; to make use of react-router-dom.
 */
const RouterLink = forwardRef<HTMLAnchorElement, MUILinkProps>((props, ref) => (
  // @ts-ignore
  <Link ref={ref} to={props.href ?? '/'} {...props} />
));

export default RouterLink;
