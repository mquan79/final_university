import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector} from 'react-redux'
import RecordRTC from 'recordrtc';
import { add } from '../../services/apiCustomer'
import { IconButton } from '@mui/material'
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
const RecordComponent = ({ setIsRecord }) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [screenStream, setScreenStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [screenRecorder, setScreenRecorder] = useState(null);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);
  const idTopic = useSelector((state) => state.group.topic);
  const { enqueueSnackbar } = useSnackbar();
  const startRecordingScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const [audioTrack] = audioStream.getAudioTracks();
      stream.addTrack(audioTrack);

      setScreenStream(stream);
      setIsRecord(true)
      const options = { mimeType: 'video/webm' };
      const recorder = new RecordRTC(stream, options);

      recorder.startRecording();
      setScreenRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error('Error starting screen recording:', error);
    }
  };


  const stopRecordingScreen = () => {
    if (screenRecorder) {
      screenRecorder.stopRecording(() => {
        const blob = screenRecorder.getBlob();
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideoURL(videoUrl);
        setRecording(false);
      });
    }
    setIsRecord(false)
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
  };

  // const downloadRecordedVideo = () => {
  //   if (recordedVideoURL) {
  //     const a = document.createElement('a');
  //     a.href = recordedVideoURL;
  //     a.download = `recorded_video_${Date.now()}.mp4`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   }
  //   setRecordedVideoURL(null)
  // };

  const downloadRecordedVideo = async () => {
    const fileName = `record_${Date.now()}.mp4`;

    const response = await fetch(recordedVideoURL);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, fileName);
    const formUpload = {
      idTopic: idTopic,
      idMember: cookies.user._id,
      record: fileName,
      time: new Date(),
    }
    try {
      await add(formData, 'upload');
      await add(formUpload, 'groupmembermessages');
      enqueueSnackbar('Video được lưu ở phần Record', { variant: 'success', autoHideDuration: 1000 });
    } catch (error) {
      console.error('Error uploading file', error);
    }

    setRecordedVideoURL(null);
  };


  return (
    <div>
      <div>

        {!recording && !recordedVideoURL && (
          <IconButton onClick={startRecordingScreen}>
            <FeaturedVideoIcon style={{ ...styles.button, backgroundColor: '#0950CD' }} />
          </IconButton>
        )}
        {recording && (
          <IconButton onClick={stopRecordingScreen}>
            <CancelPresentationIcon style={{ ...styles.button, backgroundColor: '#0950CD' }} />
          </IconButton>
        )}
        {recordedVideoURL && (
          <IconButton onClick={downloadRecordedVideo}>
            <DownloadIcon style={{ ...styles.button, backgroundColor: '#0950CD' }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

const styles = {
  button: {
    borderRadius: '50%',
    padding: '20px',
    margin: '10px'
  }
}
export default RecordComponent;
