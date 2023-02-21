import { useState } from 'react';
import {
  AppBar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Logo from './Logo';
import Iconify from '../../../components/iconify';

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
              <Logo />
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
      <Dialog open={alertVisible} onClose={() => setAlertVisible(false)} fullWidth maxWidth="sm">
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">You Want to leave?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertVisible(false)}>Cancel</Button>
          <Button onClick={() => navigate('/dashboard/app', { replace: true })} autoFocus>
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

Header.propTypes = {
  button: PropTypes.string,
  timer: PropTypes.string,
};

export default Header;
