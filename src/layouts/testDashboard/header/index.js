import { AppBar, Container, IconButton, Toolbar, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Logo from './Logo';
import Iconify from '../../../components/iconify';

function Header({ button, timer }) {
  const navigate = useNavigate();
  return (
    <AppBar position="sticky" color="transparent" sx={{ backgroundColor: 'grey' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton
            sx={{ marginRight: 4 }}
            onClick={() => {
              if (button === 'home') {
                navigate('/dashboard/app', { replace: true });
              } else {
                navigate(-1);
              }
            }}
          >
            <Iconify icon={button === 'home' ? 'mdi:home' : 'mdi:arrow-back'} width={30} />
          </IconButton>
          <Logo />
          {timer && <Typography sx={{ textAlign: 'center' }}>{timer}</Typography>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

Header.propTypes = {
  button: PropTypes.string,
  timer: PropTypes.string,
};

export default Header;
