import React, { useState } from 'react';
import { IconButton } from '@mui/material'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { offConference } from '../../store/Slice/roomSlice'
import RecordComponent from './RecordComponent'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { outConference } from '../../store/Slice/roomSlice';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import socket from '../logicComponent/socketId'
import { useCookies } from 'react-cookie'
import { useSnackbar } from 'notistack';
const ButtonConferenceRoom = ({ setAudio, setVideo, video, audio, size, off, setIsRecord, isSharing, setIsSharing, setUserSharing, userSharing }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const topic = useSelector((state) => state.group.topic);
    const idTopic = useSelector((state) => state.group.topic);
    const [cookies, setCookie] = useCookies(['user'])
    const { enqueueSnackbar } = useSnackbar();
    const handleOff = () => {
        dispatch(offConference());
        dispatch(outConference());
        if (size === 0) {
            socket.emit('OFF Conference', topic)
        }
        navigate('/')
        window.location.reload();
        off()
    }
    const handleAudio = () => {
        setAudio(!audio)
    }

    const handleVideo = () => {
        setVideo(!video)
    }
    const handleSharingScreen = () => {
        if(isSharing && userSharing !== cookies.user._id) {
            enqueueSnackbar('Hiện đang có người đang chia sẽ màn hình!!', { variant: 'error', autoHideDuration: 1000 });
            return;
        }
        if(!isSharing === true ) {
        setUserSharing(cookies.user._id)
        socket.emit('On Sharing', {user: cookies.user._id, idTopic: idTopic})
        } else {
        setUserSharing(null)
        socket.emit('Off Sharing', {user: cookies.user._id, idTopic: idTopic})
        }
        setIsSharing(!isSharing)

    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={handleAudio}>
                    {audio ? <VolumeUpIcon style={{ ...styles.button, backgroundColor: '#0950CD' }} /> : <VolumeOffIcon style={{ ...styles.button, backgroundColor: '#36454F' }} />}
                </IconButton>
                <IconButton onClick={handleVideo}>
                    {video ? (<VideocamIcon style={{ ...styles.button, backgroundColor: '#0950CD' }} />) : (<VideocamOffIcon style={{ ...styles.button, backgroundColor: '#36454F' }} />)}
                </IconButton>
                <IconButton onClick={handleSharingScreen}>
                    {isSharing && userSharing === cookies.user._id ? <CancelPresentationIcon style={{ ...styles.button, backgroundColor: '#0950CD' }} /> : isSharing && userSharing !== cookies.user._id ? <CancelPresentationIcon style={{ ...styles.button, backgroundColor: 'red' }} />  : <CoPresentIcon style={{ ...styles.button, backgroundColor: '#36454F'}} />}
                </IconButton>
                <RecordComponent setIsRecord={setIsRecord}/>
                <IconButton onClick={handleOff}>
                    <CallEndIcon style={{ ...styles.button, backgroundColor: 'red' }} />
                </IconButton>
            </div>
        </>

    );
};

const styles = {
    button: {
        borderRadius: '50%',
        padding: '20px',
        margin: '10px'
    }
}
export default ButtonConferenceRoom;
