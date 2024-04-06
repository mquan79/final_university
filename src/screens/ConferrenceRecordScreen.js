import React, { useState, useEffect, useRef } from 'react';
import { get } from '../services/apiCustomer';
import * as ENV from '../env';
import { Box } from '@mui/material'
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const ConferenceRecordScreen = () => {
    const [files, setFiles] = useState([]);
    const [record, setRecord] = useState([]);
    const [users, setUsers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [viewVideo, setViewVideo] = useState(null);
    const messagesStartRef = useRef(null);
    const fileFilter = files.filter(video => video.startsWith("record_")).reverse();
    const fetchData = async () => {
        try {
            const result = await get('getFiles');
            const resultRecord = await get('groupmembermessages');
            const resultUser = await get('users');
            const resultTopics = await get('topicgroups');
            setUsers(resultUser);
            setFiles(result.files);
            setRecord(resultRecord);
            setTopics(resultTopics);
        } catch (e) {
            console.error(e);
        }
    };

    const formattedTime = new Intl.DateTimeFormat('vi-VN', {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const handleDownload = (file) => {
        const downloadUrl = `${SERVER_URL}/uploads/${file}`;

        fetch(downloadUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `recorded_video_${Date.now()}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                setViewVideo(null)
            })
            .catch(error => console.error('Download failed:', error));
    }

    const handleViewVideo = async(file) => {
        await setViewVideo(null)
        setViewVideo(file);    
        if (messagesStartRef.current) {
            messagesStartRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <Box style={styles.container} sx={{
            flexGrow: 1,
            overflow: "auto",
            justifyContent: 'center',
            textAlignLast: 'center'
          }}>
            <h2 style={{
                color: 'white',
                fontWeight: 'bold'
            }}>List of Uploaded Files</h2>
            <div ref={messagesStartRef}></div>
            {viewVideo && (
                <>
                    <video width="50%" controls>
                        <source src={`${SERVER_URL}/uploads/${viewVideo}`} type="video/mp4" controls />
                    </video>
                    <br />
                    <button style={styles.button} onClick={() => handleDownload(viewVideo)}>Download</button>
                </>)}
            <div style={{
                display: 'flex',
                justifyContent: 'space-evenly'
            }}>
                {fileFilter && fileFilter.map((file, index) => {
                    const recordInfo = record.find((item) => item.record === file);
                    const user = users.find((user) => user._id === recordInfo.idMember);
                    const topic = topics.find((topic) => topic._id === recordInfo.idTopic);
                    console.log(user)
                    return (
                        <div key={index}>
                            <video id={index} width="200" controls>
                                <source src={`${SERVER_URL}/uploads/${file}`} type="video/mp4"  controls/>
                            </video>
                            <button onClick={() => handleViewVideo(file)}>Xem video</button>
                            <button onClick={() => handleDownload(file)}>Tải xuống</button>
                            <div>
                                {recordInfo && (
                                    <>
                                        <div>
                                            <strong>{recordInfo.record}</strong>
                                            <br></br>
                                            Create User: {user ? user.name : 'Unknow'}
                                            <br></br>
                                            Topic: {topic.nameTopicGroup}
                                            <br></br>
                                            <small>{formattedTime.format(new Date(recordInfo.time))}</small>
                                        </div>
                                    </>
                                )}
                                {/* <div>{formattedDuration}</div> */}
                            </div>

                            <br></br>
                        </div>
                    )
                })}
            </div>
        </Box>
    );
};

const styles = {
    container: {
      backgroundImage: `url(${SERVER_URL}/uploads/backgroud1.jpg)`,
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
      fontWeight: 'bold',
      padding: '20px',
      color: 'white'
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

export default ConferenceRecordScreen;
