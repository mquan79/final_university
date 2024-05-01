import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { add } from '../../services/apiCustomer';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import socket from '../logicComponent/socketId'
const DialogCustom = ({ open, handleClose, fetchData }) => {
  const [cookies, removeCookie] = useCookies(['user']);
  const { enqueueSnackbar } = useSnackbar();
  const [nameTopic, setNameTopic] = useState('');
  const idGroup = useSelector((state) => state.group.group);
  const [error, setErrors] = useState(null);
  const createTopic = async () => {
    if(nameTopic.trim() === '') {
      setErrors('Vui lòng nhập tên Threads')
      enqueueSnackbar('Tạo Threads thất bại!!', { variant: 'error', autoHideDuration: 1000 });
      return;
    }
    try {
      enqueueSnackbar('Tạo Threads thành công!!', { variant: 'success', autoHideDuration: 1000 });
      await add({
        idGroup: idGroup,
        nameTopicGroup: nameTopic,
        hostTopic: cookies.user._id,
      }, 'topicgroups');
      setNameTopic('')
    } catch (e) {
      console.error(e)
    }
    socket.emit('Create threads')
    handleClose();
    fetchData();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <CloseIcon
        style={{
          cursor: 'pointer',
          alignSelf: 'end',
          margin: '10px',
          transition: 'transform 0.8s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'rotate(360deg)'; // Thay đổi transform để xoay icon
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'none'; // Trở lại trạng thái ban đầu khi chuột rời khỏi icon
        }}
        onClick={handleClose}
      />
      <DialogTitle>Create Threads</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Tên Threads"
          type="text"
          onChange={(e) => setNameTopic(e.target.value)}
          value={nameTopic}
          fullWidth
          variant="standard"
          error={Boolean(error)}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" onClick={createTopic}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogCustom;
