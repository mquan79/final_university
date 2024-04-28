import React, { useState, useEffect, useRef } from 'react';
import { get } from '../services/apiCustomer';
import * as ENV from '../env';
import { Box, TextField, Button } from '@mui/material';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const ConferenceRecordScreen = () => {
    const [files, setFiles] = useState([]);
    const [record, setRecord] = useState([]);
    const [users, setUsers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [viewVideo, setViewVideo] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const messagesStartRef = useRef(null);
    const fileFilter = files.filter((video) => video.startsWith("record_")).reverse();

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

    const handleViewVideo = async (file) => {
        await setViewVideo(null)
        setViewVideo(file);
        if (messagesStartRef.current) {
            messagesStartRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    return (
        <Box style={styles.container} sx={{
            flexGrow: 1,
            overflow: "auto",
            marginLeft: '50px'
        }}>
            <h2 style={{
                color: 'black',
                fontWeight: 'bold',
                marginTop: '20px'
            }}>LIST VIDEO RECORD</h2>
            <TextField
                id="startDate"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="endDate"
                label="End Date"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <div ref={messagesStartRef} style={{ display: 'flex', flexDirection: 'column' }}>
                {viewVideo && (
                    <>
                        <video width="50%" controls style={{ margin: '20px 0', alignSelf: 'center' }}>
                            <source src={`${SERVER_URL}/uploads/${viewVideo}`} type="video/mp4" controls />
                        </video>
                        <br />
                        <button style={{ ...styles.button, backgroundColor: '#084387', alignSelf: 'center' }} onClick={() => handleDownload(viewVideo)}>Download</button>
                    </>
                )}
                {fileFilter && fileFilter.map((file, index) => {
                    const recordInfo = record.find((item) => item.record === file);
                    const user = users.find((user) => user._id === recordInfo.idMember);
                    const topic = topics.find((topic) => topic._id === recordInfo.idTopic);
                    const recordDate = new Date(recordInfo.time);
                    const startDateTime = new Date(startDate).getTime();
                    const endDateTime = new Date(endDate).getTime();
                    if ((startDate && recordDate.getTime() < startDateTime) || (endDate && recordDate.getTime() > endDateTime)) {
                        return null;
                    }
                    return (
                        <div key={index} style={{ margin: '20px', display: 'flex', borderBottom: 'solid 1px grey', padding: '10px' }}>
                            <video width="200" controls>
                                <source src={`${SERVER_URL}/uploads/${file}`} type="video/mp4" controls />
                            </video>
                            <div style={{ marginLeft: '100px'}}>
                                <button style={{ ...styles.button, backgroundColor: '#084387' }} onClick={() => handleViewVideo(file)}>Xem video</button>
                                <button style={{ ...styles.button, backgroundColor: '#084387' }} onClick={() => handleDownload(file)}>Tải xuống</button>
                                <div>
                                    {recordInfo && (
                                        <>
                                            <div>
                                                <strong>{recordInfo.record}</strong>
                                                <br />
                                                Create User: {user ? user.name : ''}
                                                <br />
                                                Topic: {topic ? topic.nameTopicGroup : ''}
                                                <br />
                                                <small>{formattedTime.format(new Date(recordInfo.time))}</small>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Box>
    );
};

const styles = {
    container: {
        height: '100vh',
        maxWidth: '100%',
        overflow: 'auto'
    },
    button: {
        fontWeight: 'bold',
        padding: '10px 20px',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        border: 'none',
        marginRight: '10px',
        backgroundColor: '#0950CD'
    }
};

export default ConferenceRecordScreen;
