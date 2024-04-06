import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie'
import Peer from 'peerjs';
import io from 'socket.io-client';
import * as ENV from '../../env';
import { useSelector, useDispatch } from 'react-redux';
const SERVER_URL = `http://${ENV.env.ipv4}:8000`;
const SharingScreen = ({ userSharing }) => {
    const videoRef = useRef(null);
    const [cookies, setCookie] = useCookies(['user']);
    const socket = useRef(null);
    const peer = new Peer();
    const [peerId, setPeerId] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([]);
    const idTopic = useSelector((state) => state.group.topic);
    const [localStream, setLocalStream] = useState(null);


    useEffect(() => {
        socket.current = io(SERVER_URL);

        const initializePeer = () => {
            console.log('CONNECT')
            peer.on('open', (id) => {
                socket.current.emit('Join sharing', { id: cookies.user._id, name: cookies.user.name, peerId: id, idTopic: `${idTopic}-sharing` });
                setPeerId(id);
            });

            peer.on('call', (call) => {
                openStream().then((stream) => {
                    call.answer(stream);
                });
            });
        };

        initializePeer();

        socket.current.on('List online sharing', (arrUser) => {
            console.log(arrUser)
            if (Array.isArray(arrUser)) {
                const arrFilter = arrUser.filter((user) => user.idTopic === `${idTopic}-sharing` && user.peerId !== peerId);
                setOnlineUsers(arrFilter);
            } else {
                console.error('List online is not an array:', arrUser);
            }
        });

        socket.current.on('New user sharing', async (user) => {
            console.log('ADDD')
            if (user.idTopic === `${idTopic}-sharing`) {
                setOnlineUsers((prevArray) => [...prevArray, user])
            }
        });

        socket.current.on('OFF Conference', (data) => {
            setOnlineUsers((prevUsers) => prevUsers.filter((user) => user.peerId !== data.peerId));
        });

        const initCallUser = () => {
            openStream().then((stream) => {
                if (!localStream) {
                    setLocalStream(stream);
                    if (userSharing === cookies.user._id) {
                        playStream('video', stream)
                    }
                }
            });
        };

        initCallUser();


        return () => {
            socket.current.disconnect();
            if (peer) {
                peer.disconnect();
            }
        };
    }, []);

    const openStream = async () => {
        try {
            if (userSharing === cookies.user._id) {
                var stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            } else {
                console.log('Cô')
                var stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            }
            return stream;
        } catch (error) {
            console.error(error);
        }
    };

    const playStream = (idVideoTag, stream) => {
        const video = document.getElementById(idVideoTag);
        if (video) {
            video.srcObject = stream;

            video.addEventListener('canplay', () => {
                try {
                    video.play();
                } catch (e) {
                    console.error(e);
                }
            });
        }
    };

    return (
        <>
            {userSharing && userSharing === cookies.user._id ? (
                <video id="video" ref={videoRef} muted width="60%" height="95%" autoPlay={true} style={{ borderRadius: '10px', objectFit: 'cover', border: 'solid 1px grey' }} />
            ) : (
                <>
                    {onlineUsers && (
                        (() => {
                            const user = onlineUsers.find((e) => e.id === userSharing)
                            const call = peer.call(user.peerId, localStream);
                            call.on('stream', (remoteStream) => {
                                const videoElement = document.getElementById('videoRemote');
                                if (videoElement) {
                                    playStream('videoRemote', remoteStream);
                                }
                            });
                            return (
                                <video id="videoRemote" muted width="60%" height="95%" autoPlay={true} style={{ borderRadius: '10px', objectFit: 'cover', border: 'solid 1px grey' }} />
                            )
                        })
                    )}
                </>
            )}
        </>
    )

}


export default SharingScreen