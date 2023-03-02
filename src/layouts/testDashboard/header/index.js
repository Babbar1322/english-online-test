import { useState } from 'react';
import { AppBar, Container, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Logo from './Logo';
import Iconify from '../../../components/iconify';
import Confirm from '../../../components/confirm';

function Header({ button, timer }) {
  const navigate = useNavigate();
  const [alertVisible, setAlertVisible] = useState(false);
  return (
    <>
      <AppBar position="sticky" color="default">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Stack direction="row">
              <IconButton
                sx={{ marginRight: 4, alignSelf: 'center' }}
                onClick={() => {
                  if (button === 'home') {
                    setAlertVisible(true);
                    // const confirm = window.confirm('Are you sure? \nYou Want to leave?');
                    // if (confirm) {
                    //   navigate('/dashboard/app', { replace: true });
                    // }
                  } else {
                    navigate(-1);
                  }
                }}
              >
                <Iconify icon={button === 'home' ? 'mdi:home' : 'mdi:arrow-back'} width={30} />
              </IconButton>
              {/* <Logo /> */}
            </Stack>
            {timer && (
              <Stack direction="row">
                <Iconify icon="material-symbols:alarm-outline-rounded" />
                <Typography sx={{ alignSelf: 'center', marginLeft: 1 }}>{timer}</Typography>
              </Stack>
            )}
            <div />
          </Toolbar>
        </Container>
      </AppBar>
      <Confirm
        mainButton="Leave"
        onClose={() => setAlertVisible(false)}
        onConfirm={() => navigate('/dashboard/app', { replace: true })}
        text="You Want to leave?"
        title="Are you sure?"
        visible={alertVisible}
      />
    </>
  );
}

Header.propTypes = {
  button: PropTypes.string,
  timer: PropTypes.string,
};

export default Header;
