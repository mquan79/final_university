import React, { useEffect, useState } from 'react';
import { get } from '../services/apiCustomer';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import bcrypt from 'bcryptjs';
import { Container, TextField, Button, Grid, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import * as ENV from '../env';
import socket from '../components/logicComponent/socketId'
const SERVER_URL = `http://${ENV.env.ipv4}:5000`
const LoginScreen = () => {
    const [users, setUsers] = useState([]);
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });
    const [cookies, setCookie] = useCookies(['user']);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await get('users');
                setUsers(result);
            } catch (e) {
                console.error(e);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        socket.on('Login Success', handleLoginSuccess);
        socket.on('Login Fail', handleLoginFail);
        return () => {
            socket.off('Login Success', handleLoginSuccess);
            socket.off('Login Fail', handleLoginFail);
        };
    })

    const handleLoginSuccess = (data) => {
        setCookie('user', data);
        enqueueSnackbar('Đăng nhập thành công', { variant: 'success', autoHideDuration: 1000 });
    }

    const handleLoginFail = () => {
        enqueueSnackbar('Đăng nhập thất bại', { variant: 'error', autoHideDuration: 1000 });
        window.location.reload();
    }

    const handleLogin = async () => {
        let newErrors = {};
        if (loginForm.username === '') {
            newErrors = { ...newErrors, errorUsername: 'Vui lòng điền tên tài khoản' }
        } else {
            newErrors = { ...newErrors, errorUsername: null }
        }

        if (loginForm.password === '') {
            newErrors = { ...newErrors, errorPassword: 'Vui lòng điền mật khẩu' }
        } else {
            newErrors = { ...newErrors, errorPassword: null }
        }

        if (Object.values(newErrors).some(error => error !== null)) {
            setErrors({ ...errors, ...newErrors });
            enqueueSnackbar('Đăng nhập thất bại', { variant: 'error', autoHideDuration: 1000 });
        } else {
            try {
                const user = users.find(user => user.username === loginForm.username.trim());

                if (user) {
                    const passwordMatch = await bcrypt.compare(loginForm.password, user.password);

                    if (passwordMatch) {
                        setErrors({ ...newErrors, errorPassword: null });
                        socket.emit('Login', user);
                    } else {
                        setErrors({ ...newErrors, errorPassword: 'Sai tên tài khoản hoặc mật khẩu' });
                        enqueueSnackbar('Đăng nhập thất bại', { variant: 'error', autoHideDuration: 1000 });
                    }
                } else {
                    setErrors({ ...newErrors, errorPassword: 'Sai tên tài khoản hoặc mật khẩu' });
                    enqueueSnackbar('Đăng nhập thất bại', { variant: 'error', autoHideDuration: 1000 });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <Container maxWidth="sm" style={styles.container}>
            <div style={styles.formContainer}>
                <AccountCircleIcon style={styles.icon} />
                <h1 style={styles.header}>LOGIN</h1>
                <br />
                <TextField
                    style={styles.input}
                    label="Tên đăng nhập"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    error={Boolean(errors.errorUsername)}
                    helperText={errors.errorUsername}
                />
                <br />
                <TextField
                    style={styles.input}
                    type="password"
                    label="Mật khẩu"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    error={Boolean(errors.errorPassword)}
                    helperText={errors.errorPassword}
                />
                <br />
                <Button
                    style={styles.button}
                    className="custom-button"
                    type="submit"
                    variant="contained"
                    onClick={handleLogin}
                >
                    LOGIN
                </Button>
                <Grid>
                    <Grid item style={styles.registerLink}>
                        Bạn chưa có tài khoản? &nbsp;
                        <Link onClick={handleRegister} underline="none" style={styles.registerButton}>
                            Đăng ký ngay
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );

};

const styles = {
    container: {
        // backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
        // backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%'
    },
    input: {
        margin: '5px',
        width: '320px'
    },
    icon: {
        fontSize: '100px',
        backgroundColor: 'white',
        position: 'absolute',
        top: '-50px',
        right: '175px',
        color: '#084387',
        borderRadius: '60px'
    },
    formContainer: {
        position: 'relative',
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '20px',
        width: '350px',
        boxShadow: '0 0 10px 5px #f5f5f5',
        textAlign: 'center'
    },
    button: {
        // backgroundImage: `url(${SERVER_URL}/uploads/button.png)`,
        // backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        backgroundColor: '#084387',
        fontWeight: 'bold'
    },
    registerLink: {
        fontSize: '13px',
        marginTop: '10px'
    },

    registerButton: {
        cursor: 'pointer',
        fontSize: '13px'
    },

    header: {
        color: '#084387',
        fontWeight: 'bolder'
    }
    
};

export default LoginScreen;
