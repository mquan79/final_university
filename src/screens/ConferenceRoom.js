import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import * as ENV from '../env';
import { Grid } from '@mui/material';
import ButtonConferenceRoom from '../components/blockComponent/ButtonConferenceRoom';
import { inConference, outConference, setViewSharing, onViewSharing, offViewSharing } from '../store/Slice/roomSlice';
import { useNavigate } from 'react-router-dom';
import VideoLocalStreamConference from '../components/blockComponent/VideoLocalStreamConference';
import socketId from '../components/logicComponent/socketId';
import { useSnackbar } from 'notistack';
import SharingScreen from '../components/blockComponent/SharingScreen'
const SERVER_URL_IMAGE = `http://${ENV.env.ipv4}:5000`;
const SERVER_URL = `http://${ENV.env.ipv4}:8000`;

const ConferenceRoom = () => {
  const [cookies, setCookie] = useCookies(['user']);
  const [peerId, setPeerId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isRecord, setIsRecord] = useState(false)
  const idTopic = useSelector((state) => state.group.topic);
  const socket = useRef(null);
  const peer = useRef(null);
  const dispatch = useDispatch();
  const sharing = useSelector((state) => state.room.sharing)
  const viewShare = useSelector((state) => state.room.viewShare)
  const viewSharing = useSelector((state) => state.room.viewSharing)
  const [isSharing, setIsSharing] = useState(false);
  const [listSharing, setListSharing] = useState([])
  const [userSharing, setUserSharing] = useState(null);
  const [videoHeight, setVideoHeight] = useState('90%');
  const [videoWidth, setVideoWidth] = useState('57%');
  const [length, setLength] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const devices = useSelector((state) => state.room.device);
  const users = useSelector((state) => state.data.user)
  const getUserById = (id) => {
    const user = users.find((user) => user._id === id)
    return user
  }
  useEffect(() => {
    console.log(length);
    if (length <= 1) {
      setVideoHeight('90%');
      setVideoWidth('57%');
    } else if (length === 2) {
      setVideoHeight('70%');
      setVideoWidth('37%');
    } else if (length >= 3 && length <= 6) {
      setVideoHeight('40%');
      setVideoWidth('25%');
    } else if (length === 7 || length === 8) {
      setVideoHeight('35%');
      setVideoWidth('19%');
    } else if (length === 9 || length === 10) {
      setVideoHeight('28%');
      setVideoWidth('15%');
    } else {
      setVideoHeight(`100/${length}%`);
      setVideoWidth(`200/${length}%`);
    }
  }, [length]);

  useEffect(() => {
    dispatch(inConference());
  }, []);
  const socketConference = socketId
  useEffect(() => {
    socketConference.on('Join Conference', handleUserJoinConference)
  }, [])

  useEffect(() => {
    socketConference.on('On Sharing', handleSharingScreen)
    socketConference.on('Off Sharing', handleOffSharing)
    return () => {
      socketConference.off('On Sharing', handleSharingScreen)
      socketConference.off('Off Sharing', handleOffSharing)
    }
  }, [])

  const handleSharingScreen = (data) => {
    const video = document.getElementById(data.peerId)
    const block = document.getElementById(`${data.peerId}_block`)
    if (video && block) {
      video.style.display = 'none'
      block.style.display = 'block'
      const image = block.querySelector('img');
      const button = block.querySelector('button');

      if (image) {
        image.style.filter = 'brightness(50%)';
      }
      if (button) {
        button.style.display = 'block';
      }
    }
    // console.log('ON')
    // if (data.idTopic === idTopic) {
    //   await setUserSharing(data.user)
    //   await setIsSharing(true);
    // }
  }

  const handleOffSharing = (data) => {
    const video = document.getElementById(data.peerId)
    const block = document.getElementById(`${data.peerId}_block`)
    if (video && block) {
      video.style.display = 'none'
      block.style.display = 'block'
      const image = block.querySelector('img');
      const button = block.querySelector('button');

      if (image) {
        image.style.filter = 'brightness(100%)';
      }

      if (button) {
        button.style.display = 'none';
      }
    }
    const arrShared = listSharing.filter(e => e.id !== data.id)
    setListSharing(arrShared)
    dispatch(offViewSharing())
  }


  const handleUserJoinConference = (data) => {
    if (data.idTopic === idTopic) {
      enqueueSnackbar(`${data.name} tham gia cuộc họp!!`, { variant: 'info', autoHideDuration: 1000 });
    }

  }

  useEffect(() => {
    peer.current = new Peer();
    socket.current = io(SERVER_URL);

    const initializePeer = () => {
      peer.current.on('open', (id) => {
        socket.current.emit('Join', { id: cookies.user._id, name: cookies.user.name, peerId: id, idTopic: idTopic, audio: devices.audio, video: devices.video });
        setPeerId(id);
      });

      peer.current.on('call', (call) => {
        openStream().then((stream) => {
          call.answer(stream);
          console.log('ans');
        });
      });
    };

    initializePeer();

    socket.current.on('List online', (arrUser, arrSharing) => {
      const arrShare = arrSharing.filter((e) => e.idTopic === idTopic)
      setListSharing(arrShare)
      if (Array.isArray(arrUser)) {
        const arrFilter = arrUser.filter((user) => user.idTopic === idTopic && user.peerId !== peerId);
        setOnlineUsers(arrFilter);
        setLength(arrFilter.length);
      } else {
        console.error('List online is not an array:', arrUser);
      }
    });

    socket.current.on('New user', async (user) => {
      if (user.idTopic === idTopic) {
        setLength((prevLength) => prevLength + 1);
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
        }
      });
    };

    initCallUser();

    return () => {
      socket.current.disconnect();
      if (peer.current) {
        peer.current.disconnect();
      }
    };
  }, []);

  const openStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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

  const handleOff = () => {
    socket.current.emit('OFF Conference', { peerId: peerId })
  };

  useEffect(() => {
    socket.current.on('Change video conference', handleSetVideo)
    socket.current.on('Change audio conference', handleSetAudio)
    return () => {
      socket.current.off('Change video conference', handleSetVideo)
      socket.current.off('Change audio conference', handleSetAudio)
    }
  }, [])

  const handleSetAudio = (data) => {
    const video = document.getElementById(data.peerId);
    if (video) {
      if (data.change === false) {
        video.muted = true
      } else {
        video.muted = false
      }
    }

  }

  const handleSetVideo = (data) => {
    const video = document.getElementById(data.peerId)
    const block = document.getElementById(`${data.peerId}_block`)
    if (video) {
      if (data.change === false) {
        video.style.display = 'none'
        block.style.display = 'block'
      } else {
        video.style.display = 'block'
        block.style.display = 'none'
      }
    }
  }

  const handleViewStream = (id) => {
    dispatch(onViewSharing())
    dispatch(setViewSharing(id))
  }

  console.log(viewSharing)

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      {isRecord && (
        <div style={{
          position: 'fixed',
          border: 'solid 3px rgba(255, 0, 0, 0.5)',
          boxShadow: '1 1 5px rgba(255, 0, 0, 0.5)',
          height: '96vh',
          width: '98vw',
          marginTop: '2vh',
          marginLeft: '1vw',
          borderRadius: '10px',
          animation: 'scaleAnimation 3s infinite alternate',
        }}>
          <style>{`
    @keyframes scaleAnimation {
      0% {
        transform: scale(0.99);
      }
      100% {
        transform: scale(1);
      }
    }
  `}</style>
        </div>
      )}
      <div style={{}}>
        <div
          style={{
            height: '60vh',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            display: (sharing || viewShare) ? 'flex' : 'none'
          }}>
          {(sharing || viewShare) && <SharingScreen />}
        </div>
        <div
          id="remote"
          style={{
            height: '60vh',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            display: (sharing || viewShare) ? 'none' : 'flex'
          }}
        >
          {onlineUsers.map((user) => {
            const userShare = listSharing.find((e) => e.id === user.id)
            console.log(userShare)
            const call = peer.current.call(user.peerId, localStream);
            call.on('stream', (remoteStream) => {
              const videoElement = document.getElementById(user.peerId);
              if (videoElement) {
                playStream(user.peerId, remoteStream);
              }
            });
            return (
              <React.Fragment key={user.peerId} >
                {user.name}
                <video
                  id={user.peerId}
                  height={videoHeight}
                  width={videoWidth}
                  autoPlay={true}
                  muted={!user.audio ? true : false}
                  style={{ borderRadius: '10px', objectFit: 'cover', transform: 'scaleX(-1)', display: user.video && typeof userShare === 'undefined' ? 'block' : 'none' }}
                />
                <div
                  id={`${user.peerId}_block`}
                  style={{
                    width: '100%',
                    height: `${videoHeight}`,
                    width: `${videoWidth}`,
                    borderRadius: '10px',
                    display: (!user.video || typeof userShare !== 'undefined') ? 'block' : 'none',
                    backgroundColor: '#f5f5f5',
                    alignContent: 'center',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <img
                    src={`${SERVER_URL_IMAGE}/uploads/${getUserById(user.id).avatar ? getUserById(user.id).avatar : 'user.png'}`}
                    alt="Image"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      filter: typeof userShare !== 'undefined' ? 'brightness(50%)' : 'brightness(100%)'
                    }}
                  />
                  <button style={{
                    display: typeof userShare !== 'undefined' ? 'block' : 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Màu nền cho nút button
                    border: 'none',
                    borderRadius: '5px', // Bo tròn góc cho nút button
                    padding: '10px 20px', // Kích thước nút button
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', // Đổ bóng cho nút button
                    zIndex: '1', // Đặt nút button lên trên hình ảnh
                    transition: 'background-color 0.3s ease', // Hiệu ứng chuyển đổi màu nền
                  }}
                    onClick={() => handleViewStream(user.id)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'} // Màu nền khi hover
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'} // Màu nền khi không hover
                  >
                    Xem stream
                  </button>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ display: 'contents', height: '40vh' }}>
          <VideoLocalStreamConference socket={socket.current} off={handleOff} size={onlineUsers.length} peerId={peerId} setIsRecord={setIsRecord} isSharing={isSharing} setIsSharing={setIsSharing} setUserSharing={setUserSharing} userSharing={userSharing} />
        </div>
      </div>
    </div >
  );
};

export default ConferenceRoom;
