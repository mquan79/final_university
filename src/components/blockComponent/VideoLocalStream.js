import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as ENV from '../../env';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { IconButton } from '@mui/material'
const SERVER_URL_IMAGE = `http://${ENV.env.ipv4}:5000`;
const VideoLocalStream = ({ socket, off }) => {
    const devices = useSelector((state) => state.room.device)
    const idRoom = useSelector((state) => state.room.roomCall);
    const [audio, setAudio] = useState(devices.audio);
    const [video, setVideo] = useState(devices.video);
    const [cookies, setCookie] = useCookies(['user'])
    const videoRef = useRef(null);
    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error accessing media devices.', err);
            }
        };

        startVideo();
        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, []);



    const handleVideo = () => {
        if(socket === null) {
            return;
        }
        socket.emit('Change video', { idRoom: idRoom, change: !video })
        setVideo(!video)
    }

    const handleAudio = () => {
        if(socket === null) {
            return;
        }
        socket.emit('Change audio', { idRoom: idRoom, change: audio })
        setAudio(!audio)
    }

    const handleOff = () => {
        off();
    }
    return (
        <>
            <video id="video" ref={videoRef} muted width="450" height="300" autoPlay={true} style={{ borderRadius: '10px', objectFit: 'cover', display: video ? 'block' : 'none', transform: 'scaleX(-1)' }} />
            <div id="block " style={{
                width: '450px',
                height: '300px',
                backgroundColor: 'rgb(54, 69, 79)',
                borderRadius: '10px',
                display: !video ? 'block' : 'none',
                alignContent: 'center'
            }}>
                <img
                    src={`${SERVER_URL_IMAGE}/uploads/${cookies.user.avatar ? cookies.user.avatar : 'user.png'}`}
                    alt="Image"
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%'

                    }}
                />
            </div>
            <div style={{
                justifySelf: 'center'
            }}>
                <IconButton style={{ ...styles.button, backgroundColor: audio ? '#0950CD' : '#36454F' }} onClick={handleAudio}>
                    {audio ? <VolumeUpIcon style={{ color: 'white' }} /> : <VolumeOffIcon style={{ color: 'white' }} />}
                </IconButton>
                <IconButton style={{ ...styles.button, backgroundColor: video ? '#0950CD' : '#36454F' }} onClick={handleVideo}>
                    {video ? (<VideocamIcon style={{ color: 'white' }} />) : (<VideocamOffIcon style={{ color: 'white' }} />)}
                </IconButton>
                <IconButton style={{ ...styles.button, background: 'red' }} onClick={handleOff}>
                    <CallEndIcon style={{ color: 'white' }} />
                </IconButton>
            </div>
        </>
    )
}

const styles = {
    button: {
        borderRadius: '50%',
        padding: '20px',
        margin: '10px'
    }
}


export default VideoLocalStream