import React, { useEffect, useState } from 'react';
import socketId from './socketId';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import * as ENV from '../../env';
import { IconButton, Button } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CallIcon from '@mui/icons-material/Call';
import { setTopic } from '../../store/Slice/groupSlice';
import { onConference, onCall, setRoomCall, setRoom } from '../../store/Slice/roomSlice';
import CallEndIcon from '@mui/icons-material/CallEnd';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const CallNotication = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [cookies, setCookie] = useCookies(['user']);
    const [isInPage, setIsInPage] = useState(true);
    const user = useSelector((state) => state.data.user);
    const member = useSelector((state) => state.data.member);
    const group = useSelector((state) => state.data.group);
    const topic = useSelector((state) => state.data.topic);
    const statusConference = useSelector((state) => state.room.conference);
    const inConference = useSelector((state) => state.room.inConference);
    const statusCall = useSelector((state) => state.room.call);
    const inCall = useSelector((state) => state.room.inCall);
    const socket = socketId;
    const dispatch = useDispatch();
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

    if (isInPage) {
        document.title = 'CONFERENCE APP';
    }

    const handleButtonClick = (data, key) => {
        dispatch(setTopic(data._id))
        dispatch(onConference())
        closeSnackbar(key)
    };

    const handleOnCall = (data, key) => {
        const dataCut = data.idRoom.split('-')
        dispatch(setRoom(dataCut[0]))
        dispatch(setRoomCall(data.idRoom))
        dispatch(onCall())
        closeSnackbar(key)
    };

    const handleNoCalling = (data, key) => {
        socket.emit('No Calling', data)
        closeSnackbar(key);
    }

    const handleConference = (data) => {
        if (!inConference) {
            if (member && group && user && !statusConference) {
                const find = member.find((item) => item.idMember === cookies.user._id && item.idGroup === data.idGroup);
                if (!isInPage && find) {
                    document.title = 'Bạn có cuộc gọi';
                } else {
                    document.title = 'CONFERENCE APP';
                }
                if (find) {
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
                                <strong>Bạn có cuộc gọi từ</strong>
                                {"\n"}
                                <span>{getGroupById(data.idGroup).nameGroup && getGroupById(data.idGroup).nameGroup}</span>
                                {"\n"}
                                <span>#{data.nameTopicGroup}</span>
                                {"\n"}
                            </div>
                        </div>,
                        {
                            variant: 'common',
                            autoHideDuration: null,
                            action: (key) => (
                                <React.Fragment>
                                    <Button color="inherit" size="small" onClick={() => handleButtonClick(data, key)}>
                                        <CallIcon style={{ borderRadius: '50%', background: '#0950CD', padding: '15px', fontSize: '15px' }} />
                                    </Button>
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        onClick={() => {
                                            closeSnackbar(key);
                                        }}
                                    >
                                        <CallEndIcon style={{ borderRadius: '50%', background: 'red', padding: '15px', fontSize: '15px' }} />
                                    </IconButton>
                                </React.Fragment>
                            ),
                        }
                    );
                }
            }
        }

    };

    const handleCall = (data) => {
        if (cookies.user) {
            if (!inCall && data.user === cookies.user._id) {
                socket.emit('No Call', data, inCall, statusCall)
                if (user) {
                    if (!isInPage) {
                        document.title = 'Bạn có cuộc gọi';
                    } else {
                        document.title = 'CONFERENCE APP';
                    }
                    if (data.user === cookies.user._id) {
                        enqueueSnackbar(
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={`${SERVER_URL}/uploads/${getUserById(data.userCall).avatar ? getUserById(data.userCall).avatar : 'user.png'}`}
                                    alt="User Avatar"
                                    width="40"
                                    height="40"
                                    style={{ borderRadius: "45px", marginRight: "8px" }}
                                />
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    <strong>Bạn có cuộc gọi từ {getUserById(data.userCall).name}</strong>
                                </div>
                            </div>,
                            {
                                variant: 'common',
                                autoHideDuration: null,
                                action: (key) => (
                                    <React.Fragment>
                                        <Button color="inherit" size="small" onClick={() => handleOnCall(data, key)}>
                                            <CallIcon style={{ borderRadius: '50%', background: '#0950CD', padding: '15px', fontSize: '15px' }} />
                                        </Button>
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            onClick={() => handleNoCalling(data, key)}
                                        >
                                            <CallEndIcon style={{ borderRadius: '50%', background: 'red', padding: '15px', fontSize: '15px' }} />
                                        </IconButton>
                                    </React.Fragment>
                                ),
                            }
                        );
                    }
                }
            } else if (data.user === cookies.user._id && inCall ) {
                socket.emit('Online Call', data)
            } else {
                return;
            }
        }
    };


    useEffect(() => {
        socket.on('Conference', handleConference);
        socket.on('Call Video', handleCall);
        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            socket.off('Conference', handleConference);
            socket.off('Call Video', handleCall);
        };
    }, [isInPage]);

    return null
}

export default CallNotication;
