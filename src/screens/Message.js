import React, { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { get } from '../services/apiCustomer';
import { useSelector } from 'react-redux';
import InputDirectMessage from '../components/blockComponent/InputDirectMessage';
import Input from '../components/blockComponent/Input';
import socketId from '../components/logicComponent/socketId'
import { Container, TextField, Button, Grid, Link, Box, Input as TextFieldMUI } from '@mui/material';
import { IconButton } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as ENV from '../env';
import DialogFile from '../components/blockComponent/DialogFile'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GetAppIcon from '@mui/icons-material/GetApp';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`
const Message = ({ message }) => {
    const name = message.fileName
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [cookies] = useCookies(['user']);
    const [replyMess, setReplyMess] = useState(null);
    const idTopic = useSelector((state) => state.group.topic);
    const idChatRoom = useSelector((state) => state.room.room);
    const messageFilter = messages.filter((mess) => ((mess.receiverUser === idChatRoom && mess.senderUser === cookies.user._id) ||
        (mess.receiverUser === cookies.user._id && mess.senderUser === idChatRoom)) &&
        !mess.replyMessageId);
    const socket = socketId
    const [viewIndex, setViewIndex] = useState(0);
    const messageCheck = messages.filter((mess) => mess.replyMessageId === message._id)
    const [isView, setIsView] = useState(false);
    const [open, setOpen] = useState(false)
    const [viewFile, setViewFile] = useState(null)
    useEffect(() => {
        if (messageCheck) {
            if (viewIndex < messageCheck.length) {
                setIsView(true)
            }

            if (viewIndex >= messageCheck.length) {
                setIsView(false)
            }
        }

    }, [viewIndex, messageCheck])
    const fetchData = async () => {
        try {
            const result = await get('messages');
            const resultU = await get('users')
            setMessages(result);
            setUsers(resultU);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        socket.on('Message', () => {
            fetchData();
        })

    }, [])

    useEffect(() => {
        fetchData();
    }, [idChatRoom]);




    const formattedTime = new Intl.DateTimeFormat('vi-VN', {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });
    const MessageReply = ({ messageId }) => {
        const messageRep = messages.find((mess) => mess._id === messageId);
        return (
            <div style={{ borderLeft: 'solid 3px #0950CD', marginLeft: '8px' }}>
                <Message message={messageRep} />
            </div>
        );
    };
    const handleView = () => {
        setViewIndex(prevIndex => prevIndex + 3);
    }

    const viewFileMessage = (file) => {
        setOpen(true)
        setViewFile(file)
    }

    const messageRepling = messages
        .filter((mess) => mess.replyMessageId === message._id)
        .slice(0, viewIndex)
        .map((messRep) => <MessageReply key={messRep._id} messageId={messRep._id} />);

    const user = users.find((u) => u._id === message.senderUser);
    const handleDownload = (file) => {
        const downloadUrl = `${SERVER_URL}/uploads/${file}`;

        fetch(downloadUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${name}.${file.split('.').pop().toLowerCase()}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Download failed:', error));
    }
    return (
        <div style={{ borderBottom: 'solid 1px grey', padding: "10px" }}>
            <DialogFile open={open} handleClose={() => { setOpen(false); setViewFile(null) }} file={viewFile} />
            <div>
                <strong><img src={user ? `${SERVER_URL}/uploads/${user.avatar}` : `${SERVER_URL}/uploads/user.png`} alt="Image" width="40" height="40" style={{ borderRadius: "10px" }} /> {user ? user.name : ''}  </strong>
                <br />
                <div style={{ marginLeft: '40px', marginTop: '10px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {message.content && message.content}
                    <br></br>
                    {message.file && (
                        <>
                            {(['jpg', 'png'].includes(message.file.split('.').pop().toLowerCase())) ? (
                                <img src={`${SERVER_URL}/uploads/${message.file}`} alt="Image" width="200" style={{ cursor: 'pointer' }} onClick={() => viewFileMessage(message.file)} />
                            ) : (['mp4'].includes(message.file.split('.').pop().toLowerCase())) ? (
                                <video width="200" autoPlay={true} muted={true} style={{ cursor: 'pointer' }} onClick={() => viewFileMessage(message.file)}>
                                    <source src={`${SERVER_URL}/uploads/${message.file}`} type="video/mp4" />
                                </video>
                            ) : (
                                (
                                    <div style={{ display: 'flex' }}>
                                        <div style={{
                                            width: '100px',
                                            height: '120px',
                                            border: '1px solid grey',
                                            borderRadius: '5px',
                                            margin: '10px',
                                            display: 'flex',
                                            overflow: 'hidden',
                                            alignItems: 'center',
                                            padding: '5px',
                                            cursor: 'pointer',
                                            backgroundColor: '#f5f5f5'
                                        }}
                                        onClick={() => handleDownload(message.file)}>
                                            <div style={{ marginRight: '5px', alignSelf: 'start' }}><AttachFileIcon style={{ color: 'grey' }} /></div>
                                            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', alignSelf: 'start' }}>{message.fileName && message.fileName}</div>
                                        </div>
                                        <Button onClick={() => handleDownload(message.file)} style={{}}><GetAppIcon sx={{color: 'grey'}}/></Button>
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>
                <br />
                <small>{formattedTime.format(new Date(message.time))}</small>
            </div>
            <div style={{ justifyContent: 'end', display: 'flex' }}>
                {replyMess && replyMess._id === message._id ? (
                    <div style={{ width: '90%' }}>
                        {replyMess && replyMess._id === message._id ? idTopic ? <Input fetchData={() => fetchData()} replyMess={replyMess} clearReplyMess={() => setReplyMess(null)} /> : <InputDirectMessage  fetchData={() => fetchData()} replyMess={replyMess} clearReplyMess={() => setReplyMess(null)} /> : <button onClick={() => setReplyMess(message)}>Reply</button>}
                    </div>
                )
                    : <IconButton onClick={() => setReplyMess(message)}>
                        <ReplyIcon style={{ color: '#0950CD' }} />
                    </IconButton>}
            </div>
            <div>{messageRepling}</div>
            {isView && (
                <div
                    id={`${message._id}`}
                    onClick={handleView}
                    style={{
                        cursor: 'pointer',
                        color: '#0950CD', // Màu của nút
                        fontWeight: 'bold', // Kiểu chữ
                        textAlign: 'center', // Căn giữa
                        paddingTop: '10px', // Khoảng cách trên
                        borderTop: '1px solid #0950CD' // Đường viền trên
                    }}
                >
                    Xem thêm <ExpandMoreIcon /> {/* Icon mở rộng */}
                </div>
            )}
        </div>
    );
};

export default Message;
