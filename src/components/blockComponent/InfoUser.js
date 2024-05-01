import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { get } from '../../services/apiCustomer';
import * as ENV from '../../env';
import { Tooltip, Button } from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;

export default function InfoUser({ id }) {
    const [user, setUser] = useState(null);
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5s
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await get('users');
                setUser(res.find(user => user._id === id));
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
            {user && (
                <>
                    <img
                        src={`${SERVER_URL}/uploads/${user.avatar || 'user.png'}`}
                        alt="Avatar"
                        style={{
                            width: '60px',
                            height: '60px',
                            marginRight: '15px',
                            borderRadius: '20px'
                        }}
                    />
                    <Typography variant="subtitle1" color="black">
                        {user.name}
                        <div></div>
                        ID: {user._id}
                        <CopyToClipboard text={user._id} onCopy={handleCopy}>
                            <Tooltip title={copied ? "Copied!" : "Copy ID"}>
                                <Button size="small" style={{ marginLeft: "4px", minWidth: 0 }}>
                                    <FileCopy sx={{ color: 'grey', fontSize: '20px' }} />
                                </Button>
                            </Tooltip>
                        </CopyToClipboard>
                    </Typography>
                </>
            )}
        </Box>
    );
}
