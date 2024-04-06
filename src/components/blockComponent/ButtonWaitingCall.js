import React, { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { offConference, offCall } from '../../store/Slice/roomSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import socket from '../logicComponent/socketId';
import { removeGroup, removeTopic } from '../../store/Slice/groupSlice';
import { setDevice } from '../../store/Slice/roomSlice';
import { useCookies } from 'react-cookie';
const ButtonWaitingCall = ({ setAudio, setVideo, video, audio }) => {
    const dispatch = useDispatch();
    const [cookies, setCookie] = useCookies(['user'])
    const idRoom = useSelector((state) => state.room.roomCall);
    const idCreateUser = idRoom.split('-')
    const isCreateUser = cookies.user._id === idCreateUser[0]
    // console.log(isCreateUser, idCreateUser, cookies.user._id)
    const handleAudio = () => {
        setAudio(!audio)
    }

    const handleVideo = () => {
        setVideo(!video)
    }
    const handleOff = () => {
        dispatch(offConference());
        dispatch(removeTopic());
        dispatch(removeGroup());
        window.location.reload();
    }

    useEffect(() => {
        socket.on('On Call', handleJoinCallIsCreate)
    }, [])

    const handleJoinCall = () => {
        const format = {
            audio: audio,
            video: video
        }
        console.log(format)
        dispatch(setDevice(format));
        socket.emit('On Call', { idRoom: idRoom });
        navigate('/call');
        dispatch(offCall());
    }

    const handleJoinCallIsCreate = () => {
        const format = {
            audio: audio,
            video: video
        }
        console.log(format)
        dispatch(setDevice(format));
        navigate('/call');
        dispatch(offCall());
    }

    const navigate = useNavigate();

    return (
        <div>
            <IconButton style={{ ...styles.button, backgroundColor: audio ? '#0950CD' : '#36454F' }} onClick={handleAudio}>
                {audio ? <VolumeUpIcon style={{ color: 'white' }} /> : <VolumeOffIcon style={{ color: 'white' }} />}
            </IconButton>
            <IconButton style={{ ...styles.button, backgroundColor: video ? '#0950CD' : '#36454F' }} onClick={handleVideo}>
                {video ? (<VideocamIcon style={{ color: 'white' }} />) : (<VideocamOffIcon style={{ color: 'white' }} />)}
            </IconButton>
            {!isCreateUser &&
                <IconButton
                    style={{ ...styles.button, backgroundColor: '#36454F' }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0950CD';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#36454F';
                    }} onClick={handleJoinCall}>
                    <OndemandVideoIcon style={{ color: 'white' }} />
                </IconButton>
            }

            <IconButton style={{ ...styles.button, backgroundColor: 'red' }} onClick={handleOff}>
                <CallEndIcon style={{ color: 'white' }} />
            </IconButton>
        </div>
    )
}

const styles = {
    button: {
        borderRadius: '50%',
        padding: '20px',
        margin: '10px'
    }
}
export default ButtonWaitingCall