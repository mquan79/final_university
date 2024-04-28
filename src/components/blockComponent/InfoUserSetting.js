import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip, Button, TextField, Typography, Avatar, Grid } from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import CopyToClipboard from 'react-copy-to-clipboard';
import * as ENV from '../../env';
import { updated, add } from '../../services/apiCustomer';
import { useDataFetching } from '../logicComponent/fetchData';
import bcrypt from 'bcryptjs'; // Import bcrypt library
import { useSnackbar } from 'notistack';

const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const InfoUserSetting = ({ id }) => {
    const users = useSelector((state) => state.data.user);
    const [user, setUser] = useState({});
    const [copied, setCopied] = useState(false);
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [isChange, setIsChange] = useState(false);
    const [isChangePass, setIsChangePass] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [passwordOld, setPasswordOld] = useState('');
    const [password, setPassword] = useState(''); // State for new password
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirming new password
    const { fetchUser } = useDataFetching();
    const { enqueueSnackbar } = useSnackbar();

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5s
    };

    useEffect(() => {
        if (users) {
            const userData = users.find(e => e._id === id);
            setUser(userData);
            setBirthday(userData.birthday);
            setName(userData.name);
        }
    }, [id, users]);

    const handleChange = async () => {
        if (avatarFile) {
            const filename = await handleUpload();
            await updated(id, { name: name, birthday: birthday, avatar: filename }, 'users');
        } else {
            await updated(id, { name: name, birthday: birthday }, 'users');
        }
        fetchUser();
        setIsChange(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const handleUpload = async () => {
        if (!avatarFile) {
            console.error('No file selected');
            return;
        }

        const fileName = `${Date.now()}.jpg`;

        const formData = new FormData();
        formData.append('file', avatarFile, fileName);

        try {
            await add(formData, 'upload');
            return fileName;
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };


    const handlePasswordChange = async () => {
        const passwordMatch = await bcrypt.compare(passwordOld, user.password);
        if (passwordMatch) {
            if (password !== confirmPassword) {
                enqueueSnackbar('Mật khẩu không trùng khớp', { variant: 'error', autoHideDuration: 1000 });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await updated(id, { password: hashedPassword }, 'users');
            enqueueSnackbar('Thay đổi mật khẩu thành công', { variant: 'success', autoHideDuration: 1000 });
            setPassword('');
            setConfirmPassword('');
            setPasswordOld('');
            setIsChangePass(false)
        } else {
            enqueueSnackbar('Sai mật khẩu', { variant: 'error', autoHideDuration: 1000 });
        }

    };

    const handleClick = () => {
        document.getElementById('avatar-input').click()
        setIsChange(true)
    }
    return (
        <Grid container justifyContent="center" spacing={2} style={{ textAlign: 'center', marginTop: '100px', height: '100%', overflow: 'auto' }}>
            <Grid item xs={12} md={6} lg={4}>
                <Avatar
                    alt="User Avatar"
                    src={avatarFile ? URL.createObjectURL(avatarFile) : `${SERVER_URL}/uploads/${user.avatar ? user.avatar : 'user.png'}`}
                    sx={{ width: 200, height: 200, margin: 'auto', cursor: 'pointer', marginBottom: '20px' }}
                    onClick={handleClick}
                />
                <input type="file" id="avatar-input" style={{ display: "none" }} onChange={handleAvatarChange}  accept="image/*"/>
                <div style={{ textAlign: 'center' }}>
                    <Typography variant="body1" gutterBottom>
                        ID: {user._id}
                        <CopyToClipboard text={user._id} onCopy={handleCopy}>
                            <Tooltip title={copied ? "Copied!" : "Copy ID"}>
                                <Button size="small" style={{ marginLeft: "4px", minWidth: 0 }}>
                                    <FileCopy sx={{ color: 'black', fontSize: '20px' }} />
                                </Button>
                            </Tooltip>
                        </CopyToClipboard>
                    </Typography>
                </div>
                <div style={{ marginLeft: "8px" }}>
                    <div>
                        <strong style={{ width: '200px' }}>Tên:</strong>
                        {isChange ? (
                            <TextField
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ marginLeft: '10px' }}
                            />
                        ) : (
                            user.name
                        )}
                    </div>
                    <div>
                        <strong>Ngày sinh:</strong>
                        {isChange ? (
                            <TextField
                                type='date'
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                style={{ marginLeft: '10px' }}
                            />
                        ) : (
                            user.birthday
                        )}
                    </div>
                    {!isChange && !isChangePass && (
                        <>
                            <Button variant="contained" onClick={() => setIsChange(true)} style={{ margin: '10px' }}>Đổi thông tin</Button>
                            <Button variant="contained" onClick={() => setIsChangePass(true)} style={{ margin: '10px' }}>Đổi mật khẩu</Button>
                        </>
                    )}

                    {isChange && (
                        <>
                            <Button variant="contained" onClick={handleChange} style={{ margin: '10px' }}>Lưu thay đổi</Button>
                            <Button variant="contained" onClick={() => window.location.reload()} style={{ margin: '10px', backgroundColor: 'red' }}>Hủy thay đổi</Button>
                        </>
                    )}
                </div>
                {isChangePass && (
                    <>
                        <TextField
                            type="password"
                            label="Mật khẩu cũ"
                            value={passwordOld}
                            onChange={(e) => setPasswordOld(e.target.value)}
                            style={{ marginTop: '10px', width: '100%' }}
                        />
                        <TextField
                            type="password"
                            label="Mật khẩu mới"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ marginTop: '10px', width: '100%' }}
                        />
                        <TextField
                            type="password"
                            label="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ marginTop: '10px', width: '100%' }}
                        />
                        <Button variant="contained" onClick={handlePasswordChange} style={{ margin: '10px', width: '40%' }}>Đổi mật khẩu</Button>
                        <Button variant="contained" onClick={() => window.location.reload()} style={{ margin: '10px', width: '40%', backgroundColor: 'red' }}>Hủy</Button>
                    </>
                )}
            </Grid>
        </Grid>
    );
};

export default InfoUserSetting;
