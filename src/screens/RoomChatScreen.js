import React, { useState, useEffect } from 'react';
import { get, add, updated } from '../services/apiCustomer';
import { useCookies } from 'react-cookie';
import { setRoom } from '../store/Slice/roomSlice';
import { useDispatch, useSelector } from 'react-redux';
import DirectChat from './DirectChat';
import { Container, TextField, Button, Grid, Link, Box, Paper, Typography, DialogContent, DialogActions, Dialog } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as ENV from '../env';
import { useDataFetching } from '../components/logicComponent/fetchData'
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;
const RoomChatScreen = () => {
    const [cookies, setCookie] = useCookies(['user']);
    const allFriend = useSelector((state) => state.data.friend);
    if(allFriend) {
        var friends = allFriend.filter((item) => (item.idUser1 === cookies.user._id || item.idUser2 === cookies.user._id) && item.status === 'friend')
    }
    const users = useSelector((state) => state.data.user)
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const idChatRoom = useSelector((state) => state.room.room);
    const { enqueueSnackbar } = useSnackbar();
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });


    const { fetchFriend } = useDataFetching(); 
    const { width } = windowDimensions;
    console.log(width)
    useEffect(() => {
        const resizeHandler = () => {
          setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight
          });
        };
    
        window.addEventListener('resize', resizeHandler);
    
        return () => {
          window.removeEventListener('resize', resizeHandler);
        };
      }, []);
    const handleSearch = () => {
        const userSearch = users.find
            ((item) => item._id === search && item._id !== cookies.user._id);
        if (userSearch) {
            setUser(userSearch);
            setOpen(true);
        } else {
            enqueueSnackbar('Không tìm thấy người dùng', { variant: 'error', autoHideDuration: 1000 });
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const ComfirmJoin = () => {
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
                <DialogContent style={{ textAlign: 'center' }}>
                    THÔNG TIN NGƯỜI DÙNG
                    <br />
                    <img src={`${SERVER_URL}/uploads/${user && user.avatar}`} alt="Image" width="100" style={{ borderRadius: '90px', marginRight: '5px' }} />
                    <br />
                    {user && user.name}
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleAddFriend}>Add++</Button>
                </DialogActions>
            </Dialog>
        )
    }

    const handleAddFriend = async () => {
        try {
            const friendFilter = allFriend.find((item) => (
                item.idUser1 === user._id &&
                item.idUser2 === cookies.user._id &&
                item.status === 'wait'
            ));

            if (friendFilter) {
                await updated(friendFilter._id, { status: 'friend' }, 'friends');
                enqueueSnackbar('Bạn và người dùng này đã trở thành bạn bè', { variant: 'success', autoHideDuration: 1000 });
            } else {
                await add({
                    idUser1: cookies.user._id,
                    idUser2: user._id,
                    status: 'wait',
                }, 'friends');
                enqueueSnackbar('Gửi lời mời kết bạn thành công', { variant: 'success', autoHideDuration: 1000 });
            }

            fetchFriend();
            setUser(null);
            setSearch('');
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleChatRoom = (id) => {
        dispatch(setRoom(id))
    }


    const Friend = ({ id }) => {
        const user = users && users.find((user) => user._id === id);
        return (
            <div style={{
                margin: '10px',
                border: 'solid 1px black',
                borderRadius: '5px',
                padding: '5px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <img src={`${SERVER_URL}/uploads/${user.avatar ? user.avatar : 'user.png'}`} alt="Image" width={width * 0.03} style={{ borderRadius: '90px', marginRight: '5px' }} />
                {width > 765 && (user ? user.name : 'unknown')}
            </div>
        )
    }

    const UserInfo = () => {
        return (
            <div style={{
                textAlign: 'center'
            }}>
                <ComfirmJoin />
                <img src={`${SERVER_URL}/uploads/${cookies.user.avatar ? cookies.user.avatar : 'user.png'}`} alt="Image" width={width * 0.07} style={{ borderRadius: '90px' }} />
                <br />
                <div>{cookies.user.name}</div>
                <div style={{ fontSize: '13px' }}>ID: {cookies.user._id}</div>
            </div>
        )
    }


    return (
        <div style={{
            height: '100vh',
            marginTop: '2vh',
            display: 'grid',
            gridTemplateColumns: '2fr 12fr',
        }}>
            <div style={{
                height: '100vh',
                width: `${width * 0.15}px`,
                padding: '15px',
                backgroundColor: '#2A3439',
                borderTopLeftRadius: '15px',
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: '100vh'
                    }}
                >
                    <Box sx={{
                        flexGrow: 1,
                        overflow: "auto",
                        p: 2,
                        scrollbarWidth: 'none', // Ẩn thanh cuộn cho Firefox
                        '&::-webkit-scrollbar': {
                            display: 'none', // Ẩn thanh cuộn cho WebKit browsers (Chrome, Safari, Edge, etc.)
                        },
                        '&-ms-overflow-style:': {
                            display: 'none', // Ẩn thanh cuộn cho IE
                        },
                    }}>
                        <UserInfo />
                        {width > 765 && 
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <TextField type='text' onChange={(e) => setSearch(e.target.value)} label='ID USER' value={search} style={{ marginTop: '20px' }} />
                            <SearchIcon style={{ cursor: 'pointer', width: '20%' }} onClick={handleSearch} />
                        </div>
                        }

                        {friends && friends.map((friend) => {
                            return (
                                <div key={friend._id} style={{
                                    cursor: "pointer", 
                                }} onClick={() => handleChatRoom(friend.idUser1 === cookies.user._id ? friend.idUser2 : friend.idUser1)}>{friend.idUser1 === cookies.user._id ? <Friend id={friend.idUser2} /> : <Friend id={friend.idUser1} />}</div>
                            )
                        })}
                    </Box>
                </Box>
            </div>
            <div style={{
                height: '100vh',
                marginRight: '10px',
                borderTopRightRadius: '15px',
                overflowY: 'auto',
                backgroundColor: '#36454F',
            }}>
                {idChatRoom && <DirectChat />}
            </div>
        </div>
    )
}

export default RoomChatScreen