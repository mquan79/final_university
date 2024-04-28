import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useCookies } from 'react-cookie'
import QRCodeGenerator from './QRCodeGenerator'
const DialogQRCode = ({ open, handleClose }) => {
  const [cookies, setCookie] = useCookies(['user'])

  return (
    <Dialog open={open} onClose={handleClose}>
      <CloseIcon
        style={{
          cursor: 'pointer',
          position: 'absolute',
          top: '10px',
          right: '10px',
          transition: 'transform 0.8s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'rotate(360deg)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'none';
        }}
        onClick={handleClose}
      />
      <DialogTitle style={{ textAlign: 'center' }}>QR CODE ĐĂNG NHẬP</DialogTitle>
      <DialogContent style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <div style={{ marginBottom: '10px', color: '#f00', fontWeight: 'bold' }}>
        <WarningAmberIcon style={{ color: '#f00', marginRight: '5px' }} />Vui lòng không cung cấp mã QR cho ai khác!!!
        </div>
        <div>
          <strong>Tên: {cookies.user.name}</strong>
        </div>
        <div>
          <strong>ID: {cookies.user._id}</strong>
        </div>
        <QRCodeGenerator value={cookies.user._id} />
      </DialogContent>
    </Dialog>

  );
}

export default DialogQRCode;
