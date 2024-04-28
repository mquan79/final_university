import React, { useEffect, useState } from 'react';
import socketId from './socketId';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import * as ENV from '../../env';
import { IconButton, Button } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const Notification = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [cookies, setCookie] = useCookies(['user']);
    const [isInPage, setIsInPage] = useState(true);
    const idChatRoom = useSelector((state) => state.room.room);
    const idTopic = useSelector((state) => state.group.topic);
    const user = useSelector((state) => state.data.user);
    const member = useSelector((state) => state.data.member);
    const group = useSelector((state) => state.data.group);
    const topic = useSelector((state) => state.data.topic);
    const socket = socketId;
    const getUserById = (id) => {
        if (user) {
            var userFilter = user.find((i) => i._id === id)
        }

        return userFilter
    }

    const getGroupById = (id) => {
        if (group) {
            var groupFilter = group.find((i) => i._id === id)
        }
        return groupFilter
    }

    const getTopicById = (id) => {
        if (topic) {
            var topicFilter = topic.find((i) => i._id === id)
        }
        return topicFilter
    }


    const handleBlur = () => {
        setIsInPage(false);
    };

    const handleFocus = () => {
        setIsInPage(true);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    const handleMessageDirect = (data) => {
        if (data.receiverUser === cookies.user._id && data.senderUser !== idChatRoom) {
            enqueueSnackbar(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user && (
                        <img
                            src={`${SERVER_URL}/uploads/${getUserById(data.senderUser).avatar ? getUserById(data.senderUser).avatar : 'user.png'}`}
                            alt="User Avatar"
                            width="40"
                            height="40"
                            style={{ borderRadius: "45px", marginRight: "8px" }}
                        />
                    )}
                    <span>{getUserById(data.senderUser).name}: {data.content}</span>
                </div>,
                { variant: 'common', autoHideDuration: 2000 }
            );

            if (!isInPage) {
                document.title = 'Bạn có tin nhắn mới';
            } else {
                document.title = 'CONFERENCE APP';
            }
        }
    };

    const handleMessage = (data) => {
        if (member && group && user) {
            const find = member.find((item) => item.idMember === cookies.user._id && item.idGroup === data.receiverChannel)
            if (find && data.receiverGroup !== idTopic) {
                enqueueSnackbar(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={`${SERVER_URL}/uploads/logo.png`}
                            alt="User Avatar"
                            width="40"
                            height="40"
                            style={{ borderRadius: "45px", marginRight: "8px" }}
                        />
                        <div style={{ whiteSpace: 'pre-line' }}>
                            <strong>{getGroupById(data.receiverChannel).nameGroup}</strong>
                            {"\n"}
                            <span>#{getTopicById(data.receiverGroup).nameTopicGroup}</span>
                            {"\n"}
                            <span>{getUserById(data.senderUser).name}: {data.content}</span>
                        </div>
                    </div>,
                    { variant: 'common', autoHideDuration: 2000 }
                );

                if (!isInPage) {
                    document.title = 'Bạn có tin nhắn mới';
                } else {
                    document.title = 'CONFERENCE APP';
                }
            }
        }
    }

    if (isInPage) {
        document.title = 'CONFERENCE APP';
    }

    const handleButtonClick = (data, key) => {
        console.log("Clicked to view", data);
        closeSnackbar(key)
    };
    

    useEffect(() => {
        socket.on('Message direct', handleMessageDirect);
        socket.on('Message', handleMessage);
        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            socket.off('Message direct', handleMessageDirect);
            socket.off('Message', handleMessage);

        };
    }, [isInPage]);

    return null;
}

export default Notification;
