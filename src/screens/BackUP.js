import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux'
import * as ENV from '../env';
import { Grid } from '@mui/material'
import ButtonConferenceRoom from '../components/blockComponent/ButtonConferenceRoom';
import { inConference, outConference } from '../store/Slice/roomSlice';
import { useNavigate } from 'react-router-dom';
const SERVER_URL = `http://${ENV.env.ipv4}:8000`
const ConferenceRoom = () => {
  const [cookies, setCookie] = useCookies(['user'])
  const [peerId, setPeerId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const idTopic = useSelector((state) => state.group.topic);
  const socket = useRef(null);
  const peer = useRef(null);
  const device = useSelector((state) => state.room.device)
  const [audio, setAudio] = useState(device ? device.audio : false);
  const [video, setVideo] = useState(device ? device.video : false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(inConference());
  }, [])

  useEffect(() => {
    peer.current = new Peer();
    socket.current = io(SERVER_URL);
    const initializePeer = async () => {
      peer.current.on('open', (id) => {
        // console.log('Join');
        socket.current.emit('Join', { name: cookies.user.name, peerId: id, idTopic: idTopic });
        setPeerId(id)
      });

      peer.current.on('call', (call) => {
        openStream().then((stream) => {
          call.answer(stream);
          
        });

      });
    };

    initializePeer();

    socket.current.on('List online', (arrUser) => {
      if (Array.isArray(arrUser)) {
        setOnlineUsers(arrUser);
      } else {
        console.error("List online is not an array:", arrUser);
      }
    });

    socket.current.on('New user', (user) => {
      if (user.idTopic === idTopic) {
        setOnlineUsers((prevArray) => [...prevArray, user])
      }
    })

    socket.current.on('User diconnect', (disconnectedPeerId) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((user) => user.peerId !== disconnectedPeerId));
    });

    const initCallUser = () => {
      openStream().then((stream) => {
        if(!localStream) {
          setLocalStream(stream)
        }

        const videoElement = document.getElementById("localStream");
        if (videoElement) {
          playStream("localStream", stream);
        }
      });
    }

    initCallUser();

    return () => {
      socket.current.disconnect();
      if (peer.current) {
        peer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    openStream().then((stream) => {
      setLocalStream(stream)
      const videoElement = document.getElementById("localStream");
      if (videoElement) {
        playStream("localStream", stream);
      }
    });
  }, [audio, video]);

  const openStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audio, video: video });
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
    <div>
      <div id="div-chat">
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <div>USER ONLINE</div>
            {onlineUsers && onlineUsers.map((user) => {
              if (user.peerId === peerId) {
                setOnlineUsers(onlineUsers.filter((item) => item.peerId !== peerId))
              }
              return (
                <div key={user.peerId}>{user.name}</div>
              )

            })}

          </Grid>
          <Grid item xs={9}>
            {onlineUsers && (
              <>
                <div style={{
                  height: '100vh',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateRows: '10fr 5fr'
                }}>
                  <div id="remoteStream" style={{}}>
                    {
                      onlineUsers.map((user) => {
                        if (user.idTopic === idTopic) {
                          const call = peer.current.call(user.peerId, localStream);
                          call.on('stream', (remoteStream) => {
                            const videoElement = document.getElementById(user.peerId);
                            if (videoElement) {
                              playStream(user.peerId, remoteStream)
                            }
                          });
                          return (
                            <div key={user.peerId}>
                              {user.name}
                              <br></br>
                              <video id={user.peerId} width="170" height="170" autoPlay={true} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                            </div>

                          )
                        }

                      })
                    }
                  </div>
                  <div style={{
                    textAlign: 'center'
                  }}>
                    <video id="localStream" width="170" height="170" autoPlay={true} muted style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    <br />
                    <ButtonConferenceRoom setAudio={setAudio} setVideo={setVideo} video={video} audio={audio} size={onlineUsers && onlineUsers.length}/>
                  </div>
                </div>
              </>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ConferenceRoom;
