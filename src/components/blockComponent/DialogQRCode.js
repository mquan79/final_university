import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCookies } from 'react-cookie'
import QRCodeGenerator from './QRCodeGenerator'
const DialogQRCode = ({ open, handleClose }) => {
  const [cookies, setCookie] = useCookies(['user'])

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
      <DialogTitle>QR CODE</DialogTitle>
      <DialogContent       style={{
        padding: '100px'
      }}>
        <QRCodeGenerator value={cookies.user._id}/>
      </DialogContent>
    </Dialog>
  );
}

export default DialogQRCode;
