import React, { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { get } from '../services/apiCustomer';
import { useSelector } from 'react-redux';
import InputDirectMessage from '../components/blockComponent/InputDirectMessage';
import socketId from '../components/logicComponent/socketId';
import { Container, TextField, Button, Grid, Link, Box, Input } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import DialogUser from '../components/blockComponent/DialogUser'
import * as ENV from '../env';
import Message from './Message';

const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const DirectChat = () => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [cookies] = useCookies(['user']);
    const [open, setOpen] = useState(false)
    const [replyMess, setReplyMess] = useState(null);
    const idChatRoom = useSelector((state) => state.room.room);
    const messageFilter = messages.filter(
        (mess) =>
            (mess.receiverUser === idChatRoom && mess.senderUser === cookies.user._id) ||
            (mess.receiverUser === cookies.user._id && mess.senderUser === idChatRoom)
    );
    const messagesEndRef = useRef(null);
    const socket = socketId;
    useEffect(() => {
        if (users) {
            const user = users.find(e => e._id === idChatRoom)
            setUser(user)
        }
    }, [users])

    console.log(user)

    useEffect(() => {
        const scrollToEnd = () => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        };

        scrollToEnd();
    }, [messages, idChatRoom]);

    const fetchData = async () => {
        try {
            const result = await get('messages');
            const resultU = await get('users');
            setMessages(result);
            setUsers(resultU);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        socket.on('Message direct', () => {
            fetchData();
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [idChatRoom]);

    const handleCall = () => {
        socket.emit('Call Video', {userCall: cookies.user._id, user: idChatRoom, idRoom: `${cookies.user._id}-${idChatRoom}`})
    }

    return (
        <div style={{
            display: 'flex'
        }}>
            <DialogUser open={open} handleClose={() => setOpen(false)} id={idChatRoom}/>
            <Box
                sx={{
                    height: '100vh',
                    width: '65%',
                    maxWidth: '65%',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'black',
                    borderRight: 'solid 1px black',
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        p: 2,
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        '&-ms-overflow-style:': {
                            display: 'none',
                        },
                    }}
                >
                    {messageFilter && messageFilter.map((message) => <Message key={message._id} message={message} />)}
                    <div ref={messagesEndRef}></div>
                </Box>
                <Box sx={{ p: 2 }} style={{ display: 'inline-flex', padding: '0px' }}>
                    {!replyMess && <InputDirectMessage fetchData={() => fetchData()} clearReplyMess={() => setReplyMess(null)} />}
                </Box>
            </Box>
            <Box
                sx={{
                    height: '100%',
                    width: '35%',
                    maxWidth: '35%',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'black',
                    padding: '20px',
                    overflow: 'auto',
                    alignItems: 'center',
                    paddingTop: '60px',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    '&-ms-overflow-style:': {
                        display: 'none',
                    },
                }}
            >
                <img
                    src={`${SERVER_URL}/uploads/${user && user.avatar ? user.avatar : 'user.png'}`}
                    alt="User Avatar"
                    width="160"
                    height="160"
                    style={{ borderRadius: '50%', marginBottom: '10px' }}
                />
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{user && user.name}</span>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row', // Hiển thị các button theo chiều ngang
                        justifyContent: 'center', // Căn giữa các button
                        marginTop: '20px', // Khoảng cách từ phần thông tin người dùng xuống nhóm button
                    }}
                >
                    <IconButton color="primary" aria-label="call" onClick={handleCall} style={{
                        border: 'solid 1px #0950CD',
                        padding: '15px',
                        margin: '10px'
                    }}>
                        <CallIcon sx={{
                            color: '#0950CD'
                        }}/>
                    </IconButton>
                    <IconButton color="primary" aria-label="info" onClick={() => setOpen(true)} style={{
                        border: 'solid 1px #0950CD',
                        padding: '15px',
                        margin: '10px'
                    }}>
                        <InfoIcon sx={{
                            color: '#0950CD'
                        }}/>
                    </IconButton>
                </Box>
            </Box>

        </div>
    );
};

export default DirectChat;
