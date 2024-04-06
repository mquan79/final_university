import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import ButtonConferenceRoom from './ButtonConferenceRoom';
import * as ENV from '../../env';
const SERVER_URL_IMAGE = `http://${ENV.env.ipv4}:5000`;
const VideoLocalStreamConference = ({ socket, off, size, peerId, setIsRecord, isSharing, setIsSharing, setUserSharing, userSharing }) => {
    const devices = useSelector((state) => state.room.device)
    const idRoom = useSelector((state) => state.room.roomCall);
    const [audio, setAudio] = useState(devices.audio);
    const [video, setVideo] = useState(devices.video);
    const [cookies, setCookie] = useCookies(['user'])
    const videoRef = useRef(null);
    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
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
        socket.emit('Change video conference', { peerId: peerId, change: !video })
        setVideo(!video)
    }

    const handleAudio = () => {
        socket.emit('Change audio conference', { peerId: peerId, change: !audio })
        setAudio(!audio)
    }

    const handleOff = () => {
        off();
    }
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <video id="video" ref={videoRef} muted width="300" height="200" autoPlay={true} style={{ borderRadius: '10px', objectFit: 'cover', display: video ? 'block' : 'none', transform: 'scaleX(-1)' }} />
                <div id="block " style={{
                    width: '300px',
                    height: '200px',
                    backgroundColor: 'rgb(54, 69, 79)',
                    borderRadius: '10px',
                    display: !video ? 'block' : 'none',
                    alignContent: 'center',
                    textAlign: 'center'
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
            </div>
            <div style={{
                justifySelf: 'center'
            }}>
                <ButtonConferenceRoom setAudio={handleAudio} setVideo={handleVideo} video={video} audio={audio} size={size} off={handleOff} setIsRecord={setIsRecord} isSharing={isSharing} setIsSharing={setIsSharing} setUserSharing={setUserSharing} userSharing={userSharing}/>
            </div>
        </>
    )
}

export default VideoLocalStreamConference