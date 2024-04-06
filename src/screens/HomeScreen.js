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
  const navigate = useNavigate()

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

  const logout = (data) => {
    console.log('Đăng xuất ', data)
    enqueueSnackbar('Tài khoản đang đăng nhập ở nơi khác', { variant: 'error', autoHideDuration: 1000 });
    removeCookie('user', null);
    navigate('/login')
    window.location.reload();
  };

  useEffect(() => {
    socket.on('Login logout', logout);
    return () => {
      socket.off('Login logout', logout);
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
      // backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
      // backgroundSize: 'cover',
      // backgroundRepeat: 'no-repeat',
      // backgroundPosition: 'center',
      backgroundColor: 'rgb(28 30 31)',
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
            backgroundImage: `url(${SERVER_URL}/uploads/backgroud2.jpg)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: (isDirect ? '20px' : '90px'),
            transition: 'border-radius 0.1s ease',
            // transform: (isDirect ? 'rotate(360deg)' : 'rotate(0deg)'),
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            cursor: 'pointer',
            height: `${width * 0.05}px`,
            width: `${width * 0.05}px`,
            fontSize: `${width * 0.01}px`,
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
              backgroundColor: '#2A3439' // Màu nền ban đầu của ItemGroup
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0F52BA'; // Hover effect - thay đổi màu nền
              e.target.style.borderRadius = '20px' // Thay đổi màu chữ khi hover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#2A3439'; // Loại bỏ hover effect - trở lại màu nền ban đầu
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
              backgroundColor: (isOpenJoinGroup ? '#0F52BA' : '#2A3439') // Màu nền ban đầu của ItemGroup
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0F52BA'; // Hover effect - thay đổi màu nền
              e.target.style.borderRadius = '20px' // Thay đổi màu chữ khi hover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = (isOpenJoinGroup ? '#0F52BA' : '#2A3439'); // Loại bỏ hover effect - trở lại màu nền ban đầu
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
                  backgroundColor: (idGroup === group.idGroup) ? '#0F52BA' : '#2A3439',
                  borderRadius: (idGroup === group.idGroup) ? '20px' : '90px',
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
                backgroundColor: '#2A3439',
                marginTop: '2vh',
                color: 'white',
                paddingTop: '10px',
                paddingLeft: '15px',
                paddingRight: '15px',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
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
                backgroundColor: '#2A3439',
                marginTop: '2vh',
                color: 'white',
                paddingTop: '10px',
                paddingLeft: '15px',
                paddingRight: '15px',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
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
                backgroundColor: '#2A3439',
                marginTop: '2vh',
                color: 'white',
                paddingTop: '10px',
                paddingLeft: '15px',
                paddingRight: '15px',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              <WaitingConference />
            </Box>
          </div>
        ) : idGroup ? (
          <div style={{
            height: '100vh',
            marginTop: '2vh',
            display: 'grid',
            gridTemplateColumns: '2fr 12fr'
          }}>
            <div style={{
              height: '100vh',
              width: `${width * 0.15}px`,
              padding: '15px',
              backgroundColor: '#2A3439',
              borderTopLeftRadius: '15px',
            }}>
              {idGroup && (
                <>
                  <div
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'end',
                      fontSize: '30px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#0F52BA';
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
                          justifyContent: 'center',
                          height: `${width * 0.03}px`,
                          width: `${width * 0.15}px`,
                          fontSize: `${width * 0.01}px`,
                          marginTop: '20px',
                          cursor: 'pointer',
                          color: 'white',
                          backgroundColor: idTopic === topic._id ? '#0F52BA' : '#36454F',
                          fontWeight: 'bolder',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#0F52BA';
                          e.target.style.color = '#36454F';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = idTopic === topic._id ? '#0F52BA' : '#36454F';
                          e.target.style.color = 'white';
                        }}
                        onClick={() => setIdTopic(topic._id)}
                      >
                        {topic.nameTopicGroup}
                      </Paper>
                    ))}
                  </div>
                  <div style={{
                    display: 'fixed'
                  }}>
                    <InfoUser />
                  </div>
                </>
              )
              }
            </div>
            <div style={{
              height: '100vh',
              paddingRight: '10px',
              borderTopRightRadius: '15px',
              overflowY: 'auto'
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

const styles = {
  container: {
    backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh',
    maxWidth: '100%',
    overflow: 'hidden'
  },
  input: {
    margin: '5px',
    width: '320px'
  },
  icon: {
    fontSize: '100px',
    backgroundColor: 'white',
    position: 'absolute',
    top: '-50px',
    right: '175px',
    color: '#084387',
    borderRadius: '60px'
  },
  formContainer: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '50px',
    borderRadius: '20px',
    width: '350px',
    boxShadow: '0 0 10px 10px #0B6AB0',
    textAlign: 'center'
  },
  button: {
    backgroundImage: `url(${SERVER_URL}/uploads/button.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    fontWeight: 'bold'
  },
  registerLink: {
    fontSize: '13px',
    marginTop: '10px'
  },

  registerButton: {
    cursor: 'pointer',
    fontSize: '13px'
  },

  header: {
    backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'none',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    fontWeight: 'bolder'
  }

};
export default HomeScreen;