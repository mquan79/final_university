import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as ENV from '../../env';
import DialogUser from './DialogUser';
import socket from '../logicComponent/socketId'
import { useDataFetching } from '../logicComponent/fetchData'
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

const ListUserGroup = () => {
    const [member, setMember] = useState([]);
    const [user, setUser] = useState([]);
    const [cookies, setCookie] = useCookies(['user']);
    const members = useSelector((state) => state.data.member);
    const users = useSelector((state) => state.data.user);
    const idGroup = useSelector((state) => state.group.group);
    const [open, setOpen] = useState(false);
    const [idView, setIdView] = useState(null);
    const { fetchMember } = useDataFetching()
    useEffect(() => {
        socket.on('Fetch member', fetchMember)
    }, [])

    useEffect(() => {
        if (members && idGroup && cookies) {
            const member = members.filter(e => e.idGroup === idGroup);
            const memberNotMe = member.filter(e => e.idMember !== cookies.user._id);
            setMember(memberNotMe);
        }
    }, [members, idGroup, cookies]);

    useEffect(() => {
        if (users) {
            setUser(users);
        }
    }, [users]);

    const getUserById = (id) => {
        return user.find(e => e._id === id);
    };

    const handleViewUser = (id) => {
        setIdView(id);
        setOpen(true);
    };

    return (
        <div style={{
            marginTop: '40px',
            height: '80vh',
            overflowY: 'auto',
            padding: '10px',
        }}>
            <DialogUser open={open} handleClose={() => setOpen(false)} id={idView}/>
            {member.map((user) => (
                <div key={user._id}
                     onClick={() => handleViewUser(user.idMember)}
                     style={{
                         display: 'flex',
                         alignItems: 'center',
                         marginBottom: '10px',
                         cursor: 'pointer',
                         padding: '10px',
                         borderRadius: '5px',
                         backgroundColor: 'white', // Màu nền
                         transition: 'background-color 0.3s ease', // Hiệu ứng hover
                         ':hover': {
                             backgroundColor: '#e0e0e0', // Màu nền khi hover
                         }
                     }}>
                    <img
                        src={`${SERVER_URL}/uploads/${getUserById(user.idMember).avatar ? getUserById(user.idMember).avatar : 'user.png'}`}
                        alt="User Avatar"
                        width="40"
                        height="40"
                        style={{ borderRadius: "50%", marginRight: "8px" }}
                    />
                    <span>{getUserById(user.idMember).name}</span>
                </div>
            ))}
        </div>
    );
};

export default ListUserGroup;
