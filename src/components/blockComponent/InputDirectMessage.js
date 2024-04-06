import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { add } from '../../services/apiCustomer';
import { useSelector } from 'react-redux';
import socketId from '../logicComponent/socketId'; 
import * as ENV from '../../env';
import SpeechToText from './SpeechToText';
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton, InputAdornment, Dialog, DialogContent } from '@mui/material';
import { PhotoCamera, Send as SendIcon, VideoCameraFront as VideoCameraFrontIcon, Mic as MicIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { onCall, setRoomCall } from '../../store/Slice/roomSlice';
import { useSnackbar } from 'notistack';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const InputDirectMessage = ({ fetchData, replyMess, clearReplyMess }) => {
    const [text, setText] = useState('');
    const [cookies] = useCookies(['user']);
    const [file, setFile] = useState(null);
    const [typeOfFile, setTypeOfFile] = useState(null);
    const idChatRoom = useSelector((state) => state.room.room);
    const inputRef = useRef(null);
    const socket = socketId; 
    const [openSTT, setOpenSTT] = useState(false);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const handleSend = async () => {
        let messageFormat = {};
        if (text !== '' || file) {
            const messageContent = text.trim();

            if (!messageContent && !file) {
                return;
            }

            messageFormat = {
                senderUser: cookies.user._id,
                receiverUser: idChatRoom,
                content: messageContent,
                file: file ? `${Date.now()}.${typeOfFile}` : null,
                time: new Date(),
                replyMessageId: replyMess?._id,
            };

            if (file) {
                handleUpload();
            }

            await add(messageFormat, 'messages');
        }

        fetchData();
        setText('');
        clearReplyMess();
        setFile(null);
        socket.emit('Message direct', messageFormat);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        setTypeOfFile(fileExtension);
    
        if (!['jpg', 'png', 'mp4'].includes(fileExtension)) {
            alert('Vui lòng chọn file ảnh hoặc video!!!');
            setFile(null);
            setTypeOfFile(null);
        }
    };
    

    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected');
            return;
        }

        const fileName = `${Date.now()}.${typeOfFile}`;

        const formData = new FormData();
        formData.append('file', file, fileName);

        try {
            const result = await add(formData, 'upload');
            console.log(result);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };
    const handleOpenSTT = () => {
        setOpenSTT(true);
    };

    const handleCloseSTT = () => {
        setOpenSTT(false);
    };
    const Speech = () => {
        return (
            <Dialog
                open={openSTT}
                onClose={handleCloseSTT}
            >
                <CloseIcon
                    style={{
                        cursor: 'pointer',
                        alignSelf: 'end',
                        margin: '10px',
                        transition: 'transform 0.8s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'rotate(360deg)'; // Thay đổi transform để xoay icon
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'none'; // Trở lại trạng thái ban đầu khi chuột rời khỏi icon
                    }}
                    onClick={handleCloseSTT}
                />
                <DialogContent>
                    <SpeechToText setText={setText} close={handleCloseSTT} />
                </DialogContent>
            </Dialog>
        )
    }

    useEffect(() => {
        socket.on('No Call', handleCalling);
        socket.on('Online Call', handleUserOnlingCalling);
        return () => {
            socket.off('No Call', handleCalling);
            socket.off('Online Call', handleUserOnlingCalling);
        };
    }, []);

    const handleCalling = (data) => {
        console.log(data)
        if(data.idRoom === `${cookies.user._id}-${idChatRoom}`){
            dispatch(onCall())
            dispatch(setRoomCall(`${cookies.user._id}-${idChatRoom}`))
        }

    }

    const handleUserOnlingCalling = (data) => {
        if(data.idRoom === `${cookies.user._id}-${idChatRoom}`){
            console.log(data)
            enqueueSnackbar('Gọi thất bại vì người dùng đang ở trong cuộc gọi khác!!!', { variant: 'error', autoHideDuration: 1000 });
        }
    }

    const handleCall = () => {
        socket.emit('Call Video', {user: idChatRoom, idRoom: `${cookies.user._id}-${idChatRoom}`})
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingBottom: '20px' }}>
            <Speech />
            <TextField
                type="text"
                inputRef={inputRef}
                onChange={() => setText(inputRef.current.value)}
                value={text}
                style={{
                    flexGrow: 1,
                    wordWrap: 'break-word', 
                    whiteSpace: 'pre-wrap'
                }}

                InputProps={{
                    style: { color: 'white' },
                    startAdornment: file && (
                        <InputAdornment position="start">
                            {(['jpg', 'png'].includes(typeOfFile)) ? (
                                <img src={URL.createObjectURL(file)} alt="Image" width="50" />
                            ) : (
                                <video width="50" controls>
                                    <source src={URL.createObjectURL(file)} type="video/mp4" />
                                </video>
                            )}
                        </InputAdornment>
                    )
                }}
            />
            <input
                accept="image/*,video/*"
                id="icon-button-file"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <label htmlFor="icon-button-file">
                <IconButton component="span">
                    <PhotoCamera style={{ color: 'white' }} />
                </IconButton>
            </label>
            <IconButton onClick={handleSend}>
                <SendIcon style={{ color: 'white' }} />
            </IconButton>
            {!replyMess && (
                <IconButton onClick={handleCall}>
                    <VideoCameraFrontIcon style={{ color: 'white' }} />
                </IconButton>
            )}
            <IconButton onClick={handleOpenSTT}>
                <MicIcon style={{ color: 'white' }} />
            </IconButton>
            {replyMess && <div onClick={clearReplyMess}><CloseIcon /></div>}
        </div>
    );
};



export default InputDirectMessage;


