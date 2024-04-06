import React, { useState, useEffect } from 'react'

const VideoRemoteStream = ({ peerId, peer, length }) => {
    const [videoHeight, setVideoHeight] = useState('85%')
    useEffect(() => {
        if (length <= 1) {
            setVideoHeight('85%');
        } else if (length === 2) {
            setVideoHeight('65%');
        } else if (length >= 3 && length <= 6) {
            setVideoHeight('40%');
        } else if (length === 7 || length === 8) {
            setVideoHeight('35%');
        } else if (length === 9 || length === 10) {
            setVideoHeight('28%');
        } else {
            setVideoHeight(`100/${length}%`);
        }
    }, [length])

    useEffect(() => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: true, audio: true }, function (stream) {
            var call = peer.call(peerId, stream);
            call.on('stream', function (remoteStream) {
                playStream('remote', remoteStream)
            });
        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    }, [])

    useEffect(() => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peer.on('call', function (call) {
        getUserMedia({ video: true, audio: true }, function (stream) {
                call.answer(stream); 
                call.on('stream', function (remoteStream) {
                    playStream('remote', remoteStream)
                });
            }, function (err) {
                console.log('Failed to get local stream', err);
            });
        });
    }, [])


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
        <video id="remote" height={videoHeight} autoPlay={true} style={{ borderRadius: '10px', objectFit: 'cover' }} />
    )
}

export default VideoRemoteStream

