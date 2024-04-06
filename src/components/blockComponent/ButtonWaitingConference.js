import React from 'react'
import { IconButton } from '@mui/material'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { offConference } from '../../store/Slice/roomSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import socket from '../logicComponent/socketId';
import { removeGroup, removeTopic} from '../../store/Slice/groupSlice';
import { setDevice } from '../../store/Slice/roomSlice';
import { useCookies } from 'react-cookie'
const ButtonWaitingConference = ({ setAudio, setVideo, video, audio }) => {
  const dispatch = useDispatch();
  const idTopic = useSelector((state) => state.group.topic);
  const topics = useSelector((state) => state.data.topic);
  const [cookies, setCookie] = useCookies(['user'])
  if (idTopic && topics) {
    var topic = topics.find((topic) => topic._id === idTopic);
  }
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

  const handleJoinConference = () => {
    const format = {
      audio: audio,
      video: video
    }
    dispatch(setDevice(format));
    socket.emit('Conference', topic);
    socket.emit('Join Conference', {name: cookies.user.name, idTopic: idTopic})
    navigate('/conference');
    dispatch(offConference());
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
      <IconButton
        style={{ ...styles.button, backgroundColor: '#36454F' }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#0950CD';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#36454F';
        }} onClick={handleJoinConference}>
        <OndemandVideoIcon style={{ color: 'white' }} />
      </IconButton>
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
export default ButtonWaitingConference