import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client';
import * as ENV from '../env';
import Peer from 'peerjs';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import VideoLocalStream from '../components/blockComponent/VideoLocalStream';
import { outCall, inCall } from '../store/Slice/roomSlice'
import { useNavigate } from 'react-router-dom'

const SERVER_URL = `http://${ENV.env.ipv4}:8000`;
const SERVER_URL_IMAGE = `http://${ENV.env.ipv4}:5000`
const CallVideo = () => {
  const devices = useSelector((state) => state.room.device)
  const [cookies, setCookie] = useCookies(['user'])
  const [User, setUser] = useState(null);
  const socket = useRef(null);
  const peer = useRef(null);
  const idRoom = useSelector((state) => state.room.roomCall);
  const users = useSelector((state) => state.data.user)
  const [audio, setAudio] = useState(true)
  const [video, setVideo] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const getUserById = (id) => {
    const user = users.find((user) => user._id === id)
    return user
  }

  useEffect(() => {
    dispatch(inCall())
  },[])

  useEffect(() => {
    peer.current = new Peer();
    socket.current = io(SERVER_URL);
    const initializePeer = async () => {
      peer.current.on('open', (id) => {
        socket.current.emit('CALL', { id: cookies.user._id, name: cookies.user.name, peerId: id, roomId: idRoom, audio: devices.audio, video: devices.video });
      });
    };

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    peer.current.on('call', function (call) {
      getUserMedia({ video: true, audio: true }, function (stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function (remoteStream) {
          playStream('remoteStream', remoteStream)
        });
      }, function (err) {
        console.log('Failed to get local stream', err);
      });
    });

    initializePeer();

    socket.current.on('JOIN', async (user) => {
      if (user.roomId === idRoom) {
        await setAudio(user.audio)
        await setVideo(user.video)
        console.log('Join user', user)
        setUser(user)
      }
    })

    socket.current.on('Off call', (data) => {
      if(data.idRoom === idRoom) {
        navigate('/');
        dispatch(outCall())
        window.location.reload();
      }
    });

    socket.current.on('Change video', (data) => {
      const video = document.getElementById('remoteStream');
      const user = document.getElementById('remoteUser');
      if (data.idRoom === idRoom) {
        if (data.change === false) {
          video.style.display = 'none'
          user.style.display = 'block'
        } else {
          video.style.display = 'block'
          user.style.display = 'none'
        }
      }

    })

    socket.current.on('Change audio', (data) => {
      const video = document.getElementById('remoteStream');
      if (data.idRoom === idRoom) {
        if (data.change === false) {
          video.muted = false;
        } else {
          video.muted = true;
        }
      }
    });

    return () => {
      socket.current.disconnect();
      if (peer.current) {
        peer.current.disconnect();
      }
    };
  }, []);

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

  const handleOff = () => {
    socket.current.emit('Off call', {idRoom: idRoom})
    dispatch(outCall())
    navigate('/')
    window.location.reload();
  }

  useEffect(() => {
    const videoRemote = document.getElementById('remoteStream');
    const userRemote = document.getElementById('remoteUser');
    if (videoRemote && userRemote) {
      if (audio === false) {
        videoRemote.muted = true
      } else {
        videoRemote.muted = false
      }

      if (video === false) {
        videoRemote.style.display = 'none'
        userRemote.style.display = 'block'
      } else {
        videoRemote.style.display = 'block'
        userRemote.style.display = 'none'
      }
    }
  }, [audio, video]);

  useEffect(() => {
    if (User) {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia({ video: true, audio: true }, function (stream) {
        const call = peer.current.call(User.peerId, stream);
        call.on('stream', function (remoteStream) {
          playStream('remoteStream', remoteStream);
        });
      }, function (err) {
        console.log('Failed to get local stream', err);
      });
    }
  }, [User]);

  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: '-webkit-center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          {User && (
            <>
              <video key={User.peerId} id='remoteStream' width="450" height="300" muted={User.audio ? false : true} autoPlay={true} style={{ borderRadius: '10px', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              <div id="remoteUser" style={{ borderRadius: '10px', backgroundColor: 'rgb(54, 69, 79)', display: 'none', width: '450px', height: '300px', alignContent: 'center' }}>
              <img
              src={`${SERVER_URL_IMAGE}/uploads/${getUserById(User.id).avatar ? getUserById(User.id).avatar : 'user.png'}`}
              alt="Image"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%'
                
              }}
            />
              </div>
            </>
          )}



        </div>
        <div style={{
          display: 'contents'
        }}>
          <VideoLocalStream socket={socket.current} off={handleOff} />
        </div>
      </div>
    </div>
  )
}

export default CallVideo