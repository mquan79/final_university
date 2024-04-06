import React, { useEffect, useState } from 'react';
import socket from './socketId';
import { useSnackbar } from 'notistack';
import { IconButton, Button } from '@mui/material';

const LoginNotification = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleButtonClick = (data, key) => {
        socket.emit('Login Success', data)
        socket.emit('Login logout')
        closeSnackbar(key)
    };

    const handleNoLogin = () => {
        socket.emit('Login Fail')
    }

    const handleLogin = (data) => {
        enqueueSnackbar(
            'Tài khoản đang đăng nhập',
            {
                variant: 'common',
                autoHideDuration: null,
                action: (key) => (
                    <React.Fragment>
                        <Button color="inherit" size="small" onClick={() => handleButtonClick(data, key)}>
                            <div style={{
                                borderRadius: '2px',
                                backgroundColor: 'white',
                                color: 'black',
                                padding: '10px'
                            }}>Vẫn đăng nhập</div>
                        </Button>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            onClick={() => {
                                handleNoLogin();
                                closeSnackbar(key);
                            }}
                        >
                            <div style={{
                                borderRadius: '50%',
                                backgroundColor: 'red',
                                padding: '15px',
                                width: '10px',
                                height: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>x</div>
                        </IconButton>
                    </React.Fragment>
                ),
            }
        );
    };




    useEffect(() => {
        socket.on('Fail', handleLogin);
        return () => {
            socket.off('Fail', handleLogin);
        };
    }, []);
    return null
}

export default LoginNotification