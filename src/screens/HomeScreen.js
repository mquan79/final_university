import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { get, add } from '../services/apiCustomer';
import { setGroup, setTopic, removeTopic, removeGroup } from '../store/Slice/groupSlice';
import RoomChatScreen from './RoomChatScreen'
import { useDispatch, useSelector } from 'react-redux';
import ChatScreen from './ChatScreen';
import { Container, TextField, Button, Grid, Link, Box, Paper, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ItemGroup } from '../components/blockComponent/Item';
import DialogCustom from '../components/blockComponent/DialogCustom';
import DialogCustomThreads from '../components/blockComponent/DialogCustomThreads'
import * as ENV from '../env';
import SearchChannel from './SearchChannel';
import InfoUser from '../components/blockComponent/InfoUser';
import WaitingConference from './WaitingConference';
import WaitingCall from './WaitingCall'
import { useSnackbar } from 'notistack';
import { useDataFetching } from '../components/logicComponent/fetchData';
import { offConference, offCall } from '../store/Slice/roomSlice';
import socket from '../components/logicComponent/socketId';
import { useNavigate } from 'react-router-dom';
import ListUserGroup from '../components/blockComponent/ListUserGroup'
const SERVER_URL = `http://${ENV.env.ipv4}:5000`
const HomeScreen = () => {
  const [cookies, removeCookie] = useCookies(['user']);
  const groups = useSelector((state) => state.data.group)
  const topics = useSelector((state) => state.data.topic)
  const groupMember = useSelector((state) => state.data.member)
  const [isOpenCreateTopic, setIsOpenCreateTopic] = useState(false);
  const [isOpenJoinGroup, setIsOpenJoinGroup] = useState(false);
  const [isDirect, setIsDirect] = useState(true);
  const dispatch = useDispatch();
  const idGroup = useSelector((state) => state.group.group);
  const idTopic = useSelector((state) => state.group.topic);
  const [topicFilter, setTopicFilter] = useState([]);
  const [stateA, setStateA] = useState('channel')
  const navigate = useNavigate()
  const inCall = useSelector((state) => state.room.inCall);
  console.log(inCall)
  if (groupMember) {
    var groupMemberFilter = groupMember.filter((item) => item.idMember === cookies.user._id);
  }

  const statusConference = useSelector((state) => state.room.conference);
  const statusCall = useSelector((state) => state.room.call)
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const { width } = windowDimensions;
  const { fetchGroup, fetchTopic, fetchMember } = useDataFetching();

  const logout = async (data) => {
    if (data._id === cookies.user._id) {
      await enqueueSnackbar('Tài khoản đang đăng nhập ở nơi khác', { variant: 'error', autoHideDuration: 1000 });
      removeCookie('user', null);
      navigate('/login')
      window.location.reload();
    }

  };

  const Logout = () => {
    socket.emit('Logout', cookies.user)
    removeCookie('user', null);
    navigate('/login')
    window.location.reload();
  }
  const goToSetting = () => {
    navigate('setting')
  }

  useEffect(() => {
    socket.on('Login logout', logout);
    socket.on('Go to setting', goToSetting);
    socket.on('Logout header', Logout);
    return () => {
      socket.off('Login logout', logout);
      socket.off('Go to setting', goToSetting);
      socket.off('Logout header', Logout);
    };
  })

  useEffect(() => {
    if (statusCall === true) {
      setIsDirect(false)
    }
  }, [statusCall])

  useEffect(() => {
    const resizeHandler = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // const fetchData = async () => {
  //   try {
  //     const resultGroup = await get('groups');
  //     const resultTopic = await get('topicgroups');
  //     const resultMemberGroup = await get('groupmembers');
  //     setGroups(resultGroup);
  //     setTopics(resultTopic);
  //     setGroupMember(resultMemberGroup);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  useEffect(() => {
    if (statusConference == true) {
      setIsDirect(false)
      setIsOpenJoinGroup(false)
    }

  }, [statusConference])

  // useEffect(() => {
  //   fetchData();
  // }, [])

  useEffect(() => {
    if (topics) {
      var topicFilter = topics.filter((item) => item.idGroup === idGroup);
    }

    setTopicFilter(topicFilter);
    if (topicFilter && topicFilter.length !== 0) {
      setIdTopic(topicFilter[0]._id);
    }
  }, [idGroup, topics]);


  const setIdGroup = (id) => {
    dispatch(setGroup(id))
    dispatch(removeTopic())
    setIsOpenJoinGroup(false)
    setIsDirect(false)
  }

  const setIdTopic = (id) => {
    dispatch(setTopic(id))
    setIsOpenJoinGroup(false)
  }

  const handleCreateTopic = () => {
    setIsOpenCreateTopic(true)
  }

  const handleCloseTopic = () => {
    setIsOpenCreateTopic(false)
  }

  const handleOpenCreateGroup = () => {
    dispatch(offConference())
    setIsOpenJoinGroup(false)
    handleOpenDialog()
  }

  const handleOpenJoinGroup = () => {
    dispatch(offConference());
    setIsOpenJoinGroup(true)
    setIsDirect(false)
    dispatch(removeGroup())
    dispatch(removeTopic())
  }

  const handleDirectMessage = () => {
    dispatch(offConference());
    setIsDirect(true)
    dispatch(removeGroup())
    dispatch(removeTopic())
    setIsOpenJoinGroup(false)
  }

  const choiseChannel = (id) => {
    dispatch(offConference());
    dispatch(offCall());
    setIdGroup(id)
  }

  const fetchData = () => {
    fetchGroup();
    fetchMember();
    fetchTopic();
  }

  return (
    <div style={{
      backgroundColor: '#154ba9',
      height: '100vh',
      maxWidth: '100%',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1fr 11fr'
    }}>
      <div style={{
        height: '100vh',
        flexGrow: 1,
        overflow: "auto",
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none', // Ẩn thanh cuộn cho WebKit browsers (Chrome, Safari, Edge, etc.)
        },
        '&-ms-overflow-style:': {
          display: 'none', // Ẩn thanh cuộn cho IE
        },
        textAlign: '-webkit-center'
      }}>
        <div>
          <ItemGroup onClick={() => handleDirectMessage()} style={{
            // backgroundImage: `url(${SERVER_URL}/uploads/backgroud2.jpg)`,
            // backgroundSize: 'cover',
            // backgroundRepeat: 'no-repeat',
            // backgroundPosition: 'center',
            borderRadius: (isDirect ? '20px' : '90px'),
            transition: 'border-radius 0.1s ease',
            // transform: (isDirect ? 'rotate(360deg)' : 'rotate(0deg)'),
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            color: '#2A3439',
            backgroundColor: '#fbb700',
            cursor: 'pointer',
            height: `${width * 0.05}px`,
            width: `${width * 0.05}px`,
            fontSize: `${width * 0.01}px`,
            zIndex: 1
          }}
            elevation={24}>

            ME
          </ItemGroup>
          <div style={{ borderBottom: 'solid 1px grey', marginTop: '20px', marginBottom: '20px', width: '14vh' }}></div>
          <ItemGroup onClick={handleOpenCreateGroup}
            style={{
              borderRadius: '90px',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              cursor: 'pointer',
              height: `${width * 0.05}px`,
              width: `${width * 0.05}px`,
              fontSize: `${width * 0.01}px`,
              transition: 'border-radius 0.3s ease', // Thêm transition để tạo hiệu ứng mượt mà
              backgroundColor: '#0950CD' // Màu nền ban đầu của ItemGroup
            }}
            onMouseEnter={(e) => {
              e.target.style.borderRadius = '20px' // Thay đổi màu chữ khi hover
            }}
            onMouseLeave={(e) => {
              e.target.style.borderRadius = '90px'// Trở lại màu chữ ban đầu
            }}
            elevation={24}>

            +
          </ItemGroup>
          <ItemGroup
            onClick={handleOpenJoinGroup}
            style={{
              borderRadius: (isOpenJoinGroup ? '20px' : '90px'),
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              cursor: 'pointer',
              height: `${width * 0.05}px`,
              width: `${width * 0.05}px`,
              fontSize: `${width * 0.01}px`,
              transition: 'border-radius 0.3s ease', // Thêm transition để tạo hiệu ứng mượt mà
              backgroundColor: '#0950CD' // Màu nền ban đầu của ItemGroup
            }}
            onMouseEnter={(e) => {
              e.target.style.borderRadius = '20px' // Thay đổi màu chữ khi hover
            }}
            onMouseLeave={(e) => {
              e.target.style.borderRadius = (isOpenJoinGroup ? '20px' : '90px')// Trở lại màu chữ ban đầu
            }}
            // Loại bỏ hover effect
            elevation={24}
          >
            <SearchIcon />
          </ItemGroup>

          {groupMemberFilter && groupMemberFilter.map((group) => {
            const nameGroup = groups && groups.find((item) => item._id === group.idGroup)
            return (
              <ItemGroup
                key={group._id}
                onClick={() => choiseChannel(group.idGroup)}
                style={{
                  backgroundColor: '#0950CD',
                  borderRadius: (idGroup === group.idGroup) ? '20px' : '90px',
                  padding: '3px',
                  border: (idGroup === group.idGroup) ? 'solid 3px #f5f5f5' : 'solid 0px white',
                  transition: 'border-radius 0.1s ease',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  height: `${width * 0.05}px`,
                  width: `${width * 0.05}px`,
                  fontSize: `${width * 0.01}px`,
                  overflow: 'hidden'
                }}
                elevation={24}
              >
                {nameGroup && nameGroup.nameGroup}
              </ItemGroup>

            )
          })}

          <DialogCustom
            open={open}
            handleClose={handleCloseDialog}
            fetchData={fetchData}
            groups={groups}
          />
          <DialogCustomThreads
            open={isOpenCreateTopic}
            handleClose={handleCloseTopic}
            fetchData={fetchTopic}
          />
        </div>
      </div>
      <div style={{
        height: '100vh',
      }}>
        {isDirect ? (
          <div style={{
            height: '100vh',
          }}>
            <RoomChatScreen />
          </div>
        ) : isOpenJoinGroup ? (
          <div
            style={{
              height: '100vh',
            }}>
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: '#f5f5f5',
                color: 'white',
                paddingTop: '10px',
                paddingLeft: '15px',
                paddingRight: '15px',
                marginRight: '10px'
              }}
            >
              <SearchChannel groups={groups} fetchData={fetchMember} groupMembers={groupMember} />
            </Box>
          </div>
        ) : statusCall ? (
          <div
            style={{
              height: '100vh',
              paddingRight: '10px'
            }}>
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: '#f5f5f5',
                color: 'white',
                paddingTop: '10px',
                paddingLeft: '15px',
                paddingRight: '15px',
              }}
            >
              <WaitingCall />
            </Box>
          </div>
        ) : statusConference ? (
          <div
            style={{
              height: '100vh',
              paddingRight: '10px'
            }}>
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: '#f5f5f5',
                color: 'white',
                paddingTop: '10px',
                paddingLeft: '15px',
                paddingRight: '15px',
              }}
            >
              <WaitingConference />
            </Box>
          </div>
        ) : idGroup ? (
          <div style={{
            height: '100vh',
            display: 'grid',
            gridTemplateColumns: '2fr 12fr'
          }}>
            <div style={{
              height: '100vh',
              width: `${width * 0.15}px`,
              backgroundColor: '#0950CD',
            }}>
              {idGroup && (
                (stateA === 'channel') ? (
                  <>
                    <div
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'end',
                        fontSize: '30px',
                        marginTop: '40px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'grey';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'white';
                      }}
                      onClick={handleCreateTopic}
                    >
                      +
                    </div>
                    <div style={{
                      height: '80vh',
                      flexGrow: 1,
                      overflow: "auto",
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      '&-ms-overflow-style:': {
                        display: 'none',
                      },
                    }}>
                      {topicFilter.map((topic) => (
                        <Paper
                          key={topic._id}
                          elevation={6}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: `${width * 0.03}px`,
                            width: `${width * 0.15}px`,
                            fontSize: `${width * 0.01}px`,
                            cursor: 'pointer',
                            color: idTopic === topic._id ? 'black' : 'white',
                            backgroundColor: idTopic === topic._id ? '#fbb700' : '#0950CD',
                            fontWeight: 'bolder',
                            borderRadius: '0px',
                            paddingLeft: '20px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#fbb700';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = idTopic === topic._id ? '#fbb700' : '#0950CD';
                          }}
                          onClick={() => setIdTopic(topic._id)}
                        >
                          #  {topic.nameTopicGroup}
                        </Paper>
                      ))}
                    </div>
                  </>
                ) : (
                  <ListUserGroup />
                )
              )
              }
              <div style={{
                display: 'flex',
                justifyContent: 'space-evenly'
              }}>
                {/* <InfoUser /> */}
                <Button variant="contained" onClick={() => setStateA('threads')} style={{ color: 'black', fontSize: '10px', width: '50%', borderRadius: '0px', backgroundColor: (stateA === 'threads') ? '#fbb700' : '#f5f5f5' }}>Users</Button>
                <Button variant="contained" onClick={() => setStateA('channel')} style={{ color: 'black', fontSize: '10px', width: '50%', borderRadius: '0px', backgroundColor: (stateA === 'channel') ? '#fbb700' : '#f5f5f5' }}>Channel</Button>
              </div>
            </div>
            <div style={{
              height: '100vh',
              paddingRight: '10px',
              overflowY: 'auto',
              boxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px'
            }}>
              {idTopic && <ChatScreen />}
            </div>
          </div>

        ) : (
          <div style={{
            height: '100vh',
          }}>
            <RoomChatScreen />
          </div>
        )}
      </div>
    </div>
  )
};

export default HomeScreen;