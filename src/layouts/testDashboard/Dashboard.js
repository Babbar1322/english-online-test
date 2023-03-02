import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

import Header from './header';
import Container from '../dashboard/container/Container';

const StyledRoot = styled('div')({
  // display: 'flex',
  // minHeight: '100%',
  // overflow: 'hidden',
});

export default function Dashboard() {
  return (
    <StyledRoot>
      {/* <Header button={button} /> */}

      <Container>
        <Outlet />
      </Container>
    </StyledRoot>
  );
}
