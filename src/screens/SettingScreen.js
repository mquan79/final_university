import { Container } from '@mui/material'
import React from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import socket from '../components/logicComponent/socketId'
const SettingScreen = () => {
  const [cookies, removeCookie] = useCookies(['user']);
  const navigate = useNavigate()
  const logout = () => {
    socket.emit('Logout', cookies.user)
    removeCookie('user', null);
    navigate('/login')
    window.location.reload();
  };
  return (
    <Container maxWidth="sm" style={styles.container}>
      <button onClick={() => navigate('/record')}>RECORD</button>
      <button onClick={logout}>Logout</button>
    </Container>
  )
}

const styles = {
  container: {
    height: '100vh',
    maxWidth: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
    //   backgroundImage: `url(${SERVER_URL}/uploads/button.png)`,
    //   backgroundSize: 'cover',
    //   backgroundRepeat: 'no-repeat',
    //   backgroundPosition: 'center',
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
    //   backgroundImage: `url(${SERVER_URL}/uploads/backgroud.jpg)`,
    //   backgroundSize: 'cover',
    //   backgroundRepeat: 'none',
    //   WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    fontWeight: 'bolder'
  }

};

export default SettingScreen