import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import { get } from '../../services/apiCustomer';
import { useCookies } from 'react-cookie';
import * as ENV from '../../env';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`
export default function InfoUser({ }) {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [cookies, removeCookie] = useCookies(['user']);

    const fetchData = async () => {
        try {
            const res = await get('users');
            setUsers(res)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    const user = users.find((user) => user._id === cookies.user._id)
    console.log(user)
    return (
        <Card sx={{
            display: 'flex',
            height: '60px',
            alignItems: 'center',
            paddingLeft: '15px',
            paddingRight: '10px',
            backgroundColor: '#0F171B',
            justifyContent: 'space-between',
            alignSelf: 'center'
        }}>
            {user && (
                <>
                    <CardMedia
                        component="img"
                        sx={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '90px',
                            padding: '0px',
                        }}
                        image={`${SERVER_URL}/uploads/${user.avatar ? user.avatar : 'user.png'}` }
                        alt="Avatar"
                    />
                    <Box sx={{ padding: '0px' }}>
                        <CardContent sx={{ paddingBottom: '0px', alignItems: 'center', }}>
                            <Typography variant="subtitle1" color="white" component="div" style={{ padding: '0px' }}>
                                {user.name}
                                <SettingsIcon style={{ cursor: 'pointer', marginLeft: '25px' }} onClick={() => navigate('/setting')} />
                            </Typography>

                        </CardContent>
                    </Box>
                </>
            )}

        </Card>
    );
}
