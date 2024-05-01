import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';
import { add } from '../../services/apiCustomer';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import socket from '../logicComponent/socketId'
const DialogCustom = ({ open, handleClose, fetchData, groups }) => {
  const [cookies, removeCookie] = useCookies(['user']);
  const { enqueueSnackbar } = useSnackbar();
  const [nameGroup, setNameGroup] = useState('');
  const [error, setErrors] = useState(null);
  const createGroup = async () => {
    setNameGroup('')
    if(nameGroup.trim() === '') {
      setErrors('Vui lòng nhập tên Channel')
      enqueueSnackbar('Tạo Channel thất bại!!', { variant: 'error', autoHideDuration: 1000 });
      return;
    }

    try {
      enqueueSnackbar('Tạo Channel thành công!!', { variant: 'success', autoHideDuration: 1000 });
      const res = await add({
        nameGroup: nameGroup,
        hostGroup: cookies.user._id
      }, 'groups')

      await add({
        idGroup: res._id,
        nameTopicGroup: 'Chat chung',
        hostTopic: cookies.user._id,
      }, 'topicgroups');

      await add({
        idGroup: res._id,
        idMember: cookies.user._id
      }, 'groupmembers')
    } catch (e) {
      console.error(e)
    }
    socket.emit('Create threads')
    fetchData();
    handleClose();
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
      <DialogTitle>Create Channel</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Tên channel"
          type="text"
          onChange={(e) => setNameGroup(e.target.value)}
          value={nameGroup}
          fullWidth
          variant="standard"
          error={Boolean(error)}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" onClick={createGroup}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogCustom;
