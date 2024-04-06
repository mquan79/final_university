import socketIOClient from 'socket.io-client';
import * as ENV from '../../env';

const SERVER_URL = `http://${ENV.env.ipv4}:8080`;
const socket = socketIOClient(SERVER_URL);

export default socket; 
