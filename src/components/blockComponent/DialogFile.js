import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCookies } from 'react-cookie';
import * as ENV from '../../env';
import GetAppIcon from '@mui/icons-material/GetApp'; 

const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const DialogQRCode = ({ open, handleClose, file }) => {
    const [cookies, setCookie] = useCookies(['user']);

    const handleDownload = () => {
        const downloadUrl = `${SERVER_URL}/uploads/${file}`;

        fetch(downloadUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${Date.now()}.${file.split('.').pop().toLowerCase()}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                handleClose();
            })
            .catch(error => console.error('Download failed:', error));
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
        >
            <CloseIcon
                style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    zIndex: 1
                }}
                onClick={handleClose}
            />
            <DialogContent style={{ padding: '10px' }}>
                {(['jpg', 'png'].includes(file?.split('.').pop().toLowerCase())) ? (
                    <img src={`${SERVER_URL}/uploads/${file}`} alt="Image" style={{ width: '500px', objectFit: 'contain' }} />
                ) : (['mp4'].includes(file?.split('.').pop().toLowerCase())) ? (
                    <video controls style={{ width: '500px' }}>
                        <source src={`${SERVER_URL}/uploads/${file}`} type="video/mp4" />
                    </video>
                ) : (
                    <div></div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDownload} style={{ fontSize: '50px'}}><GetAppIcon sx={{color: '#0950cd'}}/></Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogQRCode;
