import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import Peer from 'peerjs';
import io from 'socket.io-client';
import * as ENV from '../../env';
import { useSelector } from 'react-redux';
const SERVER_URL = `http://${ENV.env.ipv4}:8000`;

const SharingScreen = () => {
    const videoRef = useRef(null);
    const [cookies] = useCookies(['user']);
    const [stream, setStream] = useState(null);
    const socket = useRef(null);
    const peer = useRef(null);
    const idTopic = useSelector((state) => state.group.topic);
    const sharing = useSelector((state) => state.room.sharing);
    const viewSharing = useSelector((state) => state.room.viewSharing);

    useEffect(() => {
        socket.current = io(SERVER_URL);

        peer.current = new Peer();

        const initializePeer = async () => {
            try {
                await peer.current.on('open', (id) => {
                    if (sharing) {
                        socket.current.emit('Create sharing', { id: cookies.user._id, name: cookies.user.name, peerId: id, idTopic: idTopic });
                        console.log('Create');
                        openStream().then((stream) => {
                            setStream(stream)
                            if (videoRef.current) {
                                videoRef.current.srcObject = stream;
                            }
                        });
                    } else {
                        socket.current.emit('Join sharing', { id: cookies.user._id, name: cookies.user.name, peerId: id, idTopic: idTopic, idHost: viewSharing });
                        console.log('Join');
                    }
                });
            } catch (error) {
                console.error('Error initializing Peer:', error);
            }
        };

        initializePeer();

        return () => {
            socket.current.disconnect();
            if (peer.current) {
                peer.current.disconnect();
            }
        };
    }, [idTopic, sharing, viewSharing, cookies.user._id, cookies.user.name]);

    useEffect(() => {
        peer.current.on('call', (call) => {
            console.log('Incoming call:', call);
            if (stream) {
                call.answer(stream);
            } else {
                console.error('Stream is null. Cannot answer the call.');
            }
        });
    }, [stream]);
    

    useEffect(() => {
        socket.current.on('Host sharing', (user) => {
            openVideo().then((stream) => {
                const call = peer.current.call(user.peerId, stream);
                call.on('stream', (remoteStream) => {
                    console.log(remoteStream);
                    videoRef.current.srcObject = remoteStream;
                });
            }).catch(error => console.error('Error opening video:', error));
        });
    }, []);

    const openVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            return stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const openStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' } });
            return stream;
        } catch (error) {
            console.error('Error accessing screen:', error);
        }
    };

    return (
        <video id="video" ref={videoRef} muted width="60%" height="95%" autoPlay style={{ borderRadius: '10px', objectFit: 'cover', border: 'solid 1px grey' }} />
    );
};

export default SharingScreen;
