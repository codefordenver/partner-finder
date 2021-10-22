import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const AlertDialog = (props) => {
  const handleClose = () => {
    props.setPopUpState(false);
  };
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleClose()}
          variant="contained"
          color="secondary"
          autoFocus
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleClose();
            props.handleAction();
          }}
          variant="outlined"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AlertDialog;
