import React, { useEffect, useState } from 'react';
import * as ENV from '../env';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import socket from '../components/logicComponent/socketId'
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const TestScreen = () => {
  const gridSize = 10;
  const [cookies, setCookie] = useCookies(['user']);
  const [squares, setSquares] = useState([]);
  const [initCompleted, setInitCompleted] = useState(false);
  const [position, setPosition] = useState({ row: 9, column: 4 });
  const users = useSelector((state) => state.data.user)
  const userVirtual = []
  useEffect(() => {
    socket.emit('Join Virtual', { id: cookies.user._id, row: position.row, column: position.column})

    socket.on('Join Virtual', (data) => {
      console.log(data)
      userVirtual.push(data)
      console.log(userVirtual)
    })

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          socket.emit('Move', { id: cookies.user._id, row: position.row - 1, column: position.column})
          setPosition(prevPosition => ({ row: prevPosition.row - 1, column: prevPosition.column }));
          break;
        case 'ArrowDown':
          socket.emit('Move', { id: cookies.user._id, row: position.row + 1, column: position.column})
          setPosition(prevPosition => ({ row: prevPosition.row + 1, column: prevPosition.column }));
          break;
        case 'ArrowLeft':
          socket.emit('Move', { id: cookies.user._id, row: position.row, column: position.column - 1})
          setPosition(prevPosition => ({ row: prevPosition.row, column: prevPosition.column - 1 }));
          break;
        case 'ArrowRight':
          socket.emit('Move', { id: cookies.user._id, row: position.row, column: position.column + 1})
          setPosition(prevPosition => ({ row: prevPosition.row, column: prevPosition.column + 1 }));
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const User = (id) => {
    const user = users && users.find(e => e._id === id)
    return <div style={{
      width: '80%',
      height: '80%',
      borderRadius: '10px',
      backgroundImage: `url(${SERVER_URL}/uploads/${user ? user.avatar : 'user.png'})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}>
    </div>
  }

  useEffect(() => {
    if (initCompleted) {
      const newSquares = [];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (i === position.row && j === position.column) {
            newSquares.push(
              <div
                key={`${i}-${j}`}
                id={`${i}-${j}`}
                style={{
                  width: '9.5%',
                  height: '10%',
                  border: '1px solid black',
                  float: 'left',
                }}
              >
                <div style={{
                  width: '80%',
                  height: '80%',
                  backgroundImage: `url(${SERVER_URL}/uploads/${cookies.user ? cookies.user.avatar : 'user.png'})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}>
                </div>
              </div>
            );
          } else {
            newSquares.push(
              <div
                key={`${i}-${j}`}
                id={`${i}-${j}`}
                style={{
                  width: '9.5%',
                  height: '10%',
                  border: '1px solid black',
                  float: 'left',
                }}
              />
            );
          }
        }
      }
      setSquares(newSquares);
    }
  }, [initCompleted, position]);

  const init = () => {
    setInitCompleted(true);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div style={styles.container}>
      <div style={{ height: '100vh' }}></div>
      <div style={{ height: '100vh', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {squares}
      </div>
      <div style={{ height: '100vh' }}></div>
    </div>
  );
};

const styles = {
  container: {
    backgroundImage: `url(${SERVER_URL}/uploads/map.jpg)`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'grid',
    overflow: 'hidden',
    gridTemplateColumns: '2fr 10fr 2fr'
  },
  user: {
    width: '80%',
    height: '80%',
    borderRadius: '10px',
    backgroundImage: `url(${SERVER_URL}/uploads/user.png)`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }
};

export default TestScreen;
