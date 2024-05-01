import React, { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import * as ENV from '../env';
import Input from '../components/blockComponent/Input';
import socketId from '../components/logicComponent/socketId'; 
import { IconButton, Box } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { useDataFetching } from '../components/logicComponent/fetchData'
import Message from './Message';
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


    return (
        <Box
            sx={{
                height: "100vh",
                width: '100%',
                maxWidth: '100%',
                display: "flex",
                flexDirection: "column",
                backgroundColor: '#f5f5f5',
                color: 'black',
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
                {messageTopic && messageTopic.map((message) => {
                    return (
                        <>
                            <Message key={message._id} message={message} />
                        </>
                    )
                })}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ p: 2 }} style={{ display: 'inline-flex', padding: '0px' }}>
                <Input fetchData={fetchMessage} clearReplyMess={() => setReplyMess(null)} />
            </Box>
        </Box>
    );
};
export default ChatScreen;
