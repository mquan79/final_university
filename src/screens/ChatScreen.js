import React, { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import * as ENV from '../env';
import Input from '../components/blockComponent/Input';
import socketId from '../components/logicComponent/socketId'; 
import { IconButton, Box } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { useDataFetching } from '../components/logicComponent/fetchData'
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;
const ChatScreen = () => {
    const messages = useSelector((state) => state.data.message)
    const users = useSelector((state) => state.data.user)
    const [replyMess, setReplyMess] = useState(null);
    const idTopic = useSelector((state) => state.group.topic);
    if(messages) {
        var messageTopic = messages.filter((mess) => mess.receiverGroup === idTopic && !mess.replyMessageId);
    }

    const messagesEndRef = useRef(null);
    const socket = socketId; 
    const { fetchMessage } = useDataFetching();
    useEffect(() => {
        const scrollToEnd = () => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        };
    
        scrollToEnd();
        
    }, [messages, idTopic]);


    useEffect(() => {
        socket.on('Message', () => {
            fetchMessage();
        })
    }, [])

    const formattedTime = new Intl.DateTimeFormat('vi-VN', {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });

    const Message = ({ message }) => {
        const messageRepling = messages
            .filter((mess) => mess.replyMessageId === message._id)
            .map((messRep) => <MessageReply key={messRep._id} messageId={messRep._id} />);

        const user = users.find((u) => u._id === message.senderUser);
        return (
            <div key={message._id} style={{ borderBottom: 'solid 1px grey', padding: "10px" }}>
                <div>
                    <strong><img src={user ? `${SERVER_URL}/uploads/${user.avatar ? user.avatar : 'user.png'}` : '#'} alt="Image" width="40" height="40" style={{ borderRadius: "45px" }} /> {user ? user.name : 'unknown'}  </strong>
                    <br />
                    <div style={{ marginLeft: '40px', marginTop: '10px' }}>
                        {message.content && <div style={{ wordWrap: 'break-word' }}>{message.content}</div>}
                        <br></br>
                        {message.file && (
                            <>
                                {(['jpg', 'png'].includes(message.file.split('.').pop().toLowerCase())) ? (
                                    <img src={`${SERVER_URL}/uploads/${message.file}`} alt="Image" width="200" />
                                ) : (
                                    <video width="200" controls>
                                        <source src={`${SERVER_URL}/uploads/${message.file}`} type="video/mp4" controls />
                                    </video>
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
                            <Input fetchData={fetchMessage} replyMess={replyMess} clearReplyMess={() => setReplyMess(null)} />
                        </div>
                    )
                        : <IconButton onClick={() => setReplyMess(message)}>
                            <ReplyIcon style={{ color: 'white' }} />
                        </IconButton>}
                </div>
                <div>{messageRepling}</div>
            </div>
        );
    };


    const MessageReply = ({ messageId }) => {
        const messageRep = messages.find((mess) => mess._id === messageId);
        return (
            <div style={{ borderLeft: 'solid 3px #0950CD', marginLeft: '8px' }}>
                <Message message={messageRep} />
            </div>
        );
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: '100%',
                maxWidth: '100%',
                display: "flex",
                flexDirection: "column",
                backgroundColor: '#36454F',
                color: 'white',
                borderTopRightRadius: '15px'
            }}
        >
            <Box sx={{
                flexGrow: 1,
                overflow: "auto",
                p: 2,
                maxWidth: '100%',
                scrollbarWidth: 'none', // Ẩn thanh cuộn cho Firefox
                '&::-webkit-scrollbar': {
                    display: 'none', // Ẩn thanh cuộn cho WebKit browsers (Chrome, Safari, Edge, etc.)
                },
                '&-ms-overflow-style:': {
                    display: 'none', // Ẩn thanh cuộn cho IE
                },
            }}>
                {messageTopic && messageTopic.map((message, index) => {
                    return (
                        <>
                            <Message key={message._id} message={message} />
                        </>
                    )
                })}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ p: 2 }} style={{ display: 'inline-flex' }}>
                {!replyMess && <Input fetchData={fetchMessage} clearReplyMess={() => setReplyMess(null)} />}
            </Box>
        </Box>
    );
};
export default ChatScreen;
