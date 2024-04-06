import React, { useState, useRef } from 'react';
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
import { onConference } from '../../store/Slice/roomSlice'
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const Input = ({ fetchData, replyMess, clearReplyMess }) => {
    const [text, setText] = useState('');
    const [cookies] = useCookies(['user']);
    const [file, setFile] = useState(null);
    const [typeOfFile, setTypeOfFile] = useState(null);
    const idTopic = useSelector((state) => state.group.topic);
    const idGroup = useSelector((state) => state.group.group);
    const inputRef = useRef(null);
    const socket = socketId; 
    const [openSTT, setOpenSTT] = useState(false);
    const dispatch = useDispatch();
    const handleSend = async () => {
        let messageFormat = {};
        if (text !== '' || file) {
            const messageContent = text.trim();

            if (!messageContent && !file) {
                return;
            }

            messageFormat = {
                senderUser: cookies.user._id,
                receiverGroup: idTopic,
                receiverChannel: idGroup,
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
        socket.emit('Message', messageFormat);
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
            await add(formData, 'upload');
            console.log('File uploaded successfully');
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
                {/* <DialogActions>
                <Button type="submit" onClick={setText}>Join</Button>
              </DialogActions> */}
            </Dialog>
        )
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
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto'
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
                <IconButton onClick={() => dispatch(onConference())}>
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

export default Input;



// <div style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
//     <Speech />
//     <TextField
//         type="text"
//         inputRef={inputRef}
//         onChange={() => setText(inputRef.current.value)}
//         value={text}
//         style={{
//             flexGrow: 1
//         }}

//         InputProps={{
//             style: { color: 'white' },
//             startAdornment: file && (
//                 <InputAdornment position="start">
//                     {(['jpg', 'png'].includes(typeOfFile)) ? (
//                         <img src={URL.createObjectURL(file)} alt="Image" width="50" />
//                     ) : (
//                         <video width="50" controls>
//                             <source src={URL.createObjectURL(file)} type="video/mp4" />
//                         </video>
//                     )}
//                 </InputAdornment>
//             )
//         }}
//     />
//     <input
//         accept="image/*,video/*"
//         id="icon-button-file"
//         type="file"
//         onChange={handleFileChange}
//         style={{ display: 'none' }}
//     />
//     <label htmlFor="icon-button-file" style={{ alignSelf: 'center', cursor: 'pointer', width: '24px', display: 'ruby' }}>
//         <div aria-label="upload picture" component="span" style={{ padding: '0px', marginLeft: '10px', width: '24px' }}>
//             <PhotoCamera style={{
//                 backgroundColor: '#2A3439',
//                 color: 'white',
//                 padding: '10px 20px',
//                 height: '29px',
//                 borderRadius: '10px',
//             }} />
//         </div>
//     </label>
//     <div onClick={handleSend} style={{
//         backgroundColor: '#2A3439',
//         color: 'white',
//         padding: '10px 20px',
//         marginLeft: '10px',
//         borderRadius: '10px',
//         alignSelf: 'center',
//         width: '24px',
//         height: '29px',
//         cursor: 'pointer',
//         display: 'ruby'
//     }}><SendIcon /></div>

//     {!replyMess && <div onClick={() => navigate('/conference')} style={{
//         marginLeft: '10px',
//         backgroundColor: '#2A3439',
//         color: 'white',
//         padding: '10px 20px',
//         borderRadius: '10px',
//         width: '24px',
//         height: '29px',
//         alignSelf: 'center',
//         cursor: 'pointer',
//         display: 'ruby'
//     }}><VideoCameraFrontIcon /></div>}
//     <div onClick={handleOpenSTT} style={{
//         marginLeft: '10px',
//         backgroundColor: '#2A3439',
//         color: 'white',
//         padding: '10px 20px',
//         borderRadius: '10px',
//         alignSelf: 'center',
//         width: '24px',
//         height: '29px',
//         cursor: 'pointer',
//         display: 'ruby'
//     }}><MicIcon /></div>
// </div>