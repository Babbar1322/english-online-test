import { AppBar, Container, Toolbar } from '@mui/material';

import Logo from './Logo';

export default function Header() {
  return (
    <AppBar position="sticky" color="transparent" sx={{ backgroundColor: 'grey' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Logo />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
