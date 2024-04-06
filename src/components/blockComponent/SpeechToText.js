import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Typography, Button } from '@mui/material';
import * as ENV from '../../env';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`
const SpeechToText = ({ setText, close }) => {
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const startListening = () => {
      SpeechRecognition.startListening({ language: 'vi-VN' });
    };

    startListening();

    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  const handleSend = () => {
    setText(transcript);
    resetTranscript();
    close();
  };

  return (
    <div style={{ textAlignLast: 'center' }}>
      <h1 style={styles.header}>Speech To Text</h1>
      <Typography style={{margin: '20px', fontSize: '30px', fontWeight: 'bold', color: '#084387'}}>{transcript}...</Typography>
      <Button style={styles.button} variant="contained" onClick={handleSend}>Send</Button>
    </div>
  );
};

const styles = {

  button: {
    // backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat',
    // backgroundPosition: 'center',
    fontWeight: 'bold'
  },

  header: {
    // backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
    // backgroundSize: 'cover',
    // backgroundRepeat: 'none',
    // WebkitBackgroundClip: 'text',
    // backgroundClip: 'text',
    // color: 'transparent',
    fontWeight: 'bolder'
  }

};

export default SpeechToText;
