import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { add, get } from '../services/apiCustomer';
import { useSnackbar } from 'notistack';
import bcrypt from 'bcryptjs';
import { Container, TextField, Button, Grid, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import * as ENV from '../env';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;
const RegisterScreen = () => {
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({
        name: '',
        username: '',
        password: '',
        avatar: null,
        birthday: new Date().toISOString().split('T')[0],
        lastTimeConnect: 'now'
    });
    const [rePassword, setRePassword] = useState('');
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [isUploadAvatar, setIsUploadAvatar] = useState(false);
    const [file, setFile] = useState(null)
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
    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = async () => {
        let newErrors = {};

        if (registerForm.name === '') {
            newErrors = { ...newErrors, errorName: 'Vui lòng điền tên của bạn' };
        } else {
            newErrors = { ...newErrors, errorName: null };
        }

        if (registerForm.username === '') {
            newErrors = { ...newErrors, errorUsername: 'Vui lòng điền tên đăng nhập của bạn' };
        } else {
            newErrors = { ...newErrors, errorUsername: null };
        }

        if (registerForm.password === '') {
            newErrors = { ...newErrors, errorPassword: 'Vui lòng điền mật khẩu của bạn' };
        } else {
            newErrors = { ...newErrors, errorPassword: null };
        }

        if (rePassword === '') {
            newErrors = { ...newErrors, errorRePassword: 'Vui lòng nhập lại mật khẩu' };
        } else {
            newErrors = { ...newErrors, errorRePassword: null };
        }

        if (registerForm.birthday === new Date().toISOString().split('T')[0]) {
            newErrors = { ...newErrors, errorDateOfBirth: 'Vui lòng nhập ngày sinh của bạn' };
        } else {
            newErrors = { ...newErrors, errorDateOfBirth: null };
        }

        if (!newErrors.errorUsername) {
            const isExistingUser = users.some(user => user.username === registerForm.username);
            if (isExistingUser) {
                newErrors = { ...newErrors, errorUsername: 'Username đã tồn tại' };
            } else {
                newErrors = { ...newErrors, errorUsername: null };
            }
        }

        if (!newErrors.errorRePassword && rePassword !== registerForm.password) {
            newErrors = { ...newErrors, errorRePassword: 'Mật khẩu không trùng khớp' };
        } else if (!newErrors.errorRePassword || newErrors.errorRePassword === null) {
            newErrors = { ...newErrors, errorRePassword: null };
        }

        if (Object.values(newErrors).some(error => error !== null)) {
            setErrors({ ...errors, ...newErrors });
            enqueueSnackbar('Đăng ký thất bại', { variant: 'error', autoHideDuration: 1000 });
        } else {
            const hashedPassword = await bcrypt.hash(registerForm.password, 10);
            const newUser = { ...registerForm, password: hashedPassword };
            setIsUploadAvatar(true)
            setRegisterForm(newUser)
        }
    };

    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected');
            return;
        }

        const fileName = `${Date.now()}.jpg`;

        const formData = new FormData();
        formData.append('file', file, fileName);

        try {
            await add(formData, 'upload');
        } catch (error) {
            console.error('Error uploading file', error);
        }
        return fileName;
    };

    const handleRegisterImage = async () => {
        const fileName = await handleUpload();
        const newUser = { ...registerForm, avatar: fileName }
        try {
            await add(newUser, 'users');
            enqueueSnackbar('Đăng ký thành công', { variant: 'success', autoHideDuration: 1000 });
            navigate('/login');

        } catch (e) {
            console.error(e);
        }
    }



    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            return;
        }
        setFile(selectedFile);
    };

    const handleCamera = () => {
        console.log('Camera')
    }
    return (
        <Container maxWidth="sm" style={styles.container}>
            <div style={styles.formContainer}>
                <AccountCircleIcon style={styles.icon} />
                <h1 style={styles.header}>Register</h1>
                <>
                    {isUploadAvatar ? (
                        <>
                            <img src={file ? URL.createObjectURL(file) : `${SERVER_URL}/uploads/user.png`} alt="Image" width="200" height="200" style={{ borderRadius: "180px" }} />
                            <br />
                            <label htmlFor="imageUpload" className="custom-file-upload">
                                <span role="img" aria-label="camera">
                                    <Button component="span" style={styles.uploadButton}>
                                        <PhotoCameraBackIcon style={styles.iconImage} />
                                    </Button>
                                </span>
                            </label>
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />


                            <Button style={styles.uploadButton}>
                                <CameraAltIcon style={styles.iconImage} />
                            </Button>
                            <Button
                                style={styles.button}
                                className="custom-button"
                                type="submit"
                                variant="contained"
                                onClick={handleRegisterImage}
                            >
                                REGISTER
                            </Button>
                            <Grid>
                                <Grid item style={styles.registerLink}>
                                    Bạn đã có tài khoản? &nbsp;
                                    <Link onClick={handleLogin} underline="none" style={styles.registerButton}>
                                        Đăng nhập ngay
                                    </Link>
                                </Grid>
                            </Grid>
                            <Grid>
                                <Grid item style={styles.registerLink}>
                                    <Link onClick={handleLogin} underline="none" style={styles.registerButton}>
                                        Quay lại
                                    </Link>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <br />
                            <TextField
                                style={styles.input}
                                label="Tên đăng nhập"
                                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value.trim().normalize("NFD") })}
                                value={registerForm.username}
                                helperText={errors.errorUsername}
                                error={Boolean(errors.errorUsername)}
                            />
                            <Grid container style={{ width: '330px', marginLeft: '10px' }}>
                                <Grid item xs={6}>
                                    <TextField
                                        type='password'
                                        style={styles.inputPass}
                                        label="Mật khẩu"
                                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value.trim().normalize("NFD") })}
                                        value={registerForm.password}
                                        helperText={errors.errorPassword}
                                        error={Boolean(errors.errorPassword)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        type='password'
                                        style={styles.inputPass}
                                        label="Nhập lại mật khẩu"
                                        onChange={(e) => setRePassword(e.target.value)} value={rePassword}
                                        helperText={errors.errorRePassword}
                                        error={Boolean(errors.errorRePassword)}
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                style={styles.input}
                                label="Tên"
                                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                value={registerForm.name}
                                helperText={errors.errorName}
                                error={Boolean(errors.errorName)}
                            />
                            <TextField
                                type='date'
                                style={styles.input}
                                label="Ngày sinh"
                                onChange={(e) => setRegisterForm({ ...registerForm, birthday: e.target.value })}
                                value={registerForm.birthday}
                                helperText={errors.errorDateOfBirth}
                                error={Boolean(errors.errorDateOfBirth)}
                            />
                            <Button
                                style={styles.button}
                                className="custom-button"
                                type="submit"
                                variant="contained"
                                onClick={handleRegister}
                            >
                                REGISTER
                            </Button>
                            <Grid>
                                <Grid item style={styles.registerLink}>
                                    Bạn đã có tài khoản? &nbsp;
                                    <Link onClick={handleLogin} underline="none" style={styles.registerButton}>
                                        Đăng nhập ngay
                                    </Link>
                                </Grid>
                            </Grid>
                        </>
                    )}

                </>

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
        maxWidth: '100%',
    },
    input: {
        margin: '5px',
        width: '320px'
    },
    inputPass: {
        margin: '5px',
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
        boxShadow: '0 0 10px 10px #f5f5f5',
        textAlign: 'center',
        marginTop: '20px'
    },
    button: {
        // backgroundImage: `url(${SERVER_URL}/uploads/button.png)`,
        // backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        backgroundColor: '#084387',
        fontWeight: 'bold'
    },
    uploadButton: {
        // backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
        // backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        backgroundColor: '#0950cd',
        fontWeight: 'bold',
        color: 'white',
        margin: '10px'
    },

    iconImage: {

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
        // backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
        // backgroundSize: 'cover',
        // backgroundRepeat: 'none',
        // WebkitBackgroundClip: 'text',
        // backgroundClip: 'text',
        // color: 'transparent',
        color: '#084387',
        fontWeight: 'bolder'
    }
};

export default RegisterScreen;
