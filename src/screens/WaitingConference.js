import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ButtonWaitingConference from '../components/blockComponent/ButtonWaitingConference';
import * as ENV from '../env';
import { useCookies } from 'react-cookie';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`

const WaitingConference = () => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const idTopic = useSelector((state) => state.group.topic);
  const topics = useSelector((state) => state.data.topic);
  const idGroup = useSelector((state) => state.group.group);
  const groups = useSelector((state) => state.data.group);
  if (idTopic && topics) {
    var topic = topics.find((topic) => topic._id === idTopic);
  }
  if (idGroup && groups) {
    var group = groups.find((group) => group._id === idGroup);
  }
  const [cookies, setCookie] = useCookies(['user'])
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: video });
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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: audio });
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

  return (
    <div style={{
      height: '100vh',
      display: 'grid',
    }}>
      <div>{group && group.nameGroup} / #{topic && topic.nameTopicGroup}</div>
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
        <ButtonWaitingConference setAudio={setAudio} setVideo={setVideo} video={video} audio={audio} />
      </div>

    </div>
  )
}

export default WaitingConference