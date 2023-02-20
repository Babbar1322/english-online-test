import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

import Header from './header';

const StyledRoot = styled('div')({
  // display: 'flex',
  // minHeight: '100%',
  // overflow: 'hidden',
});

export default function Dashboard() {
  return (
    <StyledRoot>
      <Header />

      <Outlet />
    </StyledRoot>
  );
}
