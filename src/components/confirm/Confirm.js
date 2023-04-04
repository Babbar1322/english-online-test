import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types';

function Confirm({ onClose, onConfirm, title, text, visible, mainButton }) {
  return (
    <Dialog open={visible} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} autoFocus>
          {mainButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Confirm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  mainButton: PropTypes.string.isRequired,
};

export default Confirm;
