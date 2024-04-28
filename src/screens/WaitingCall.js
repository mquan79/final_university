import React, { useRef, useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { offConference, offCall, inCall } from '../store/Slice/roomSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import socket from '../components/logicComponent/socketId';
import { removeGroup, removeTopic } from '../store/Slice/groupSlice';
import { setDevice } from '../store/Slice/roomSlice';
import { useCookies } from 'react-cookie';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useSnackbar } from 'notistack';
import * as ENV from '../env';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`
const WaitingCall = () => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const idTopic = useSelector((state) => state.group.topic);
  const topics = useSelector((state) => state.data.topic);
  const idChatRoom = useSelector((state) => state.room.room);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  if (idTopic && topics) {
    var topic = topics.find((topic) => topic._id === idTopic);
  }
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
  }, [video]);

  useEffect(() => {
    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (audioRef.current) {
          audioRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    }

    startAudio();
    return () => {
      if (audioRef.current) {
        const stream = audioRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, [audio]);

  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['user'])
  const idRoom = useSelector((state) => state.room.roomCall);
  const idCreateUser = idRoom.split('-')
  const isCreateUser = cookies.user._id === idCreateUser[0]
  const handleAudio = () => {
    setAudio(!audio)
  }

  const handleVideo = () => {
    setVideo(!video)
  }

  const handleOff = () => {
    socket.emit('No Call Off', { user: cookies.user._id})
    dispatch(offConference());
    dispatch(offCall());
    dispatch(removeTopic());
    dispatch(removeGroup());
  }

  const handleOffCall = async(data) => {
    if (data.idRoom === `${cookies.user._id}-${idChatRoom}`) {
      enqueueSnackbar('Gọi thất bại vì người dùng không bắt máy!!!', { variant: 'error', autoHideDuration: 1000 });
      dispatch(offConference());
      dispatch(offCall());
      dispatch(removeTopic());
      dispatch(removeGroup());
    }
  }

  const handleOffCalling = async(data) => {
    if (data.user === idChatRoom) {
      enqueueSnackbar('Người dùng đã cúp máy!!!', { variant: 'error', autoHideDuration: 1000 });
      dispatch(offConference());
      dispatch(offCall());
      dispatch(removeTopic());
      dispatch(removeGroup());
    }
  }
  useEffect(() => {
    const format = {
      audio: audio,
      video: video
    };

    socket.on('On Call', () => handleJoinCallIsCreate(format));
    return () => {
      socket.off('On Call', () => handleJoinCallIsCreate(format));

    };
  }, [audio, video]);

  useEffect(() => {
    socket.on('No Calling', handleOffCall)
    socket.on('No Call Off', handleOffCalling)
    return () => {
      socket.off('No Calling', handleOffCall)
      socket.off('No Call Off', handleOffCalling)
    }
  }, [])

  const handleJoinCall = () => {
    const format = {
      audio: audio,
      video: video
    }
    console.log(audio, video, format)
    dispatch(setDevice(format));
    socket.emit('On Call', { idRoom: idRoom });
    navigate('/call');
    dispatch(offCall());
    dispatch(inCall())
    console.log('In call')
  }

  const handleJoinCallIsCreate = (format) => {
    console.log(audio, video, format)
    dispatch(setDevice(format));
    navigate('/call');
    dispatch(offCall());
    dispatch(inCall())
    console.log('In call')
  }

  return (
    <div style={{
      height: '100vh',
      display: 'grid',
      backgroundColor: '#f5f5f5'
    }}>
      <div>{topic && topic.nameTopicGroup}</div>
      <div style={{
        justifySelf: 'center'
      }}>
        {video ? (
          <>
            <video ref={videoRef} autoPlay={true} width="600" height="400"
              style={{
                borderRadius: '10px',
                objectFit: 'cover',
                transform: 'scaleX(-1)'
              }}
            />
            {audio &&
              <video ref={audioRef} autoPlay={true} width="0" height="0" />
            }

          </>
        ) : (
          <div style={{
            width: '600px',
            height: '400px',
            borderRadius: '10px',
            backgroundColor: '#36454F',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={`${SERVER_URL}/uploads/${cookies.user.avatar ? cookies.user.avatar : 'user.png'}`}
              alt="Image"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%'
                
              }}
            />
          </div>
        )}

      </div>

      <div style={{
        justifySelf: 'center'
      }}>
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
      </div>

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

export default WaitingCall