import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import DehazeIcon from '@mui/icons-material/Dehaze';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useSelector } from 'react-redux'
import { updated, deleted } from '../../services/apiCustomer'
import { useDataFetching } from '../logicComponent/fetchData';
import { useSnackbar } from 'notistack';
import socket from '../logicComponent/socketId';
import SettingsIcon from '@mui/icons-material/Settings';
import { Tooltip } from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import CopyToClipboard from 'react-copy-to-clipboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DialogQRCode from './DialogQRCode';
import DialogUser from './DialogUser';
import HomeIcon from '@mui/icons-material/Home';
import * as ENV from '../../env';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`;
export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [friendOpen, setFriendOpen] = React.useState(null)
  const [notificationsOpen, setNotificationsOpen] = React.useState(null)
  const [listAdd, setListAddFriend] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [idView, setIdView] = React.useState(null)
  const [openUser, setOpenUser] = React.useState(false)
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(['user']);
  const isMenuOpen = Boolean(anchorEl);
  const isFriendOpen = Boolean(friendOpen)
  const isNotificationsOpen = Boolean(notificationsOpen)
  const friends = useSelector((state) => state.data.friend)
  const users = useSelector((state) => state.data.user)
  const friendFilter = friends && friends.filter((item) => item.idUser2 === cookies.user._id && item.status === 'wait')
  const { fetchFriend } = useDataFetching();
  const { enqueueSnackbar } = useSnackbar();
  console.log(users)
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const getUserById = (id) => {
    if (users) {
      var userFilter = users.find((i) => i._id === id)
    }

    return userFilter
  }


  const handleFriendOpen = (event) => {
    setFriendOpen(event.currentTarget);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsOpen(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleFriendClose = () => {
    setFriendOpen(null);
  };

  const handleNotificationsClose = () => {
    setNotificationsOpen(null);
  };


  const handleAddFriend = async (user) => {
    const updateData = {
      ...user,
      status: 'friend'
    }
    try {
      await updated(user._id, updateData, 'friends')
      socket.emit('Add friend', updateData)
      fetchFriend();
    } catch (e) {
      console.error(e)
    }
    console.log(updateData)
  }

  const handleNoAddFriend = async (user) => {
    try {
      await deleted(user._id, 'friends')
      fetchFriend();
    } catch (e) {
      console.error(e)
    }
  }

  const handleNotiFriend = (data) => {
    console.log(data)
    if (users) {
      console.log(users)
      if (data && data.length > 0 && cookies.user) {
        const filterList = data.filter(e => e.idUser1 === cookies.user._id);
        setListAddFriend(filterList);
        const lastItem = filterList[filterList.length - 1];
        console.log(getUserById(lastItem.idUser2) && getUserById(lastItem.idUser2))
        enqueueSnackbar(`${getUserById(lastItem.idUser2)}`, { variant: 'common', autoHideDuration: 1000 });
        fetchFriend();
      }
    }
  }

  const InfoUser = () => {
    const [copied, setCopied] = React.useState(false);
  
    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5s
    };

    const handleGoToSetting = () => {
      navigate('/setting')
      window.location.reload();
    }
  
    return (
      <div onClick={handleGoToSetting} style={{ display: "flex", alignItems: "center", padding: '10px', cursor: 'pointer' }}>
        <div>
          <img
            src={`${SERVER_URL}/uploads/${cookies.user.avatar ? cookies.user.avatar : 'user.png'}`}
            alt="User Avatar"
            width="50"
            height="50"
            style={{ borderRadius: "50%", marginRight: "8px" }}
          />
        </div>
        <div style={{ marginLeft: "8px" }}>
          <div style={{ fontWeight: "bold" }}>{cookies.user.name}</div>
          <div>
            {cookies.user._id}
            <CopyToClipboard text={cookies.user._id} onCopy={handleCopy}>
              <Tooltip title={copied ? "Copied!" : "Copy ID"}>
                <Button size="small" style={{ marginLeft: "4px", minWidth: 0 }}>
                  <FileCopy sx={{ color: 'grey', fontSize: '20px' }}/>
                </Button>
              </Tooltip>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    socket.on('Add friend', handleNotiFriend);
    return () => socket.off('Add friend', handleNotiFriend);
  }, []);

  const logout = () => {
    socket.emit('Logout', cookies.user)
    removeCookie('user', null);
    navigate('/login')
    window.location.reload();
  };

  const handleGoToSetting = () => {
    navigate('/setting')
    window.location.reload();
  }

  const handleViewUser = (id) => {
    setIdView(id)
    setOpenUser(true);
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <QRCodeGenerator value={cookies.user._id} /> */}
      <InfoUser />
      <MenuItem onClick={() => navigate('/')}><HomeIcon style={{ color: 'black', marginRight: '20px' }} /> Trang chủ</MenuItem>
      <MenuItem onClick={() => setOpen(true)}><QrCodeScannerIcon style={{ color: 'black', marginRight: '20px' }} /> Đăng nhập mã QR</MenuItem>
      <MenuItem onClick={handleGoToSetting}><SettingsIcon style={{ color: 'black', marginRight: '20px' }} /> Cài đặt</MenuItem>
      <MenuItem onClick={logout}><LogoutIcon style={{ color: 'black', marginRight: '20px' }} /> Đăng xuất</MenuItem>
    </Menu>
  );
  const friend = 'primary-search-account-menu';
  const renderFriend = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={friend}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isFriendOpen}
      onClose={handleFriendClose}
    >
      {friendFilter && friendFilter.map((user, index) => (
        <MenuItem key={index} style={{ padding: '20px'}} onClick={() => handleViewUser(getUserById(user.idUser1)._id)}>
          <img
            src={`${SERVER_URL}/uploads/${getUserById(user.idUser1).avatar ? getUserById(user.idUser1).avatar : 'user.png'}`}
            alt="User Avatar"
            width="40"
            height="40"
            style={{ borderRadius: "45px", marginRight: "8px" }}
          /><strong style={{marginRight: '100px'}}>{getUserById(user.idUser1).name}</strong>
          <IconButton onClick={() => handleAddFriend(user)}><PersonAddIcon style={{ color: '#0950CD' }} /></IconButton>
          <IconButton onClick={() => handleNoAddFriend(user)}><CancelIcon style={{ color: '#d32f2f' }} /></IconButton>
        </MenuItem>
      ))}
    </Menu>
  );

  const notifications = 'primary-search-notifications-menu';
  const renderNotifications = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={notifications}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsOpen}
      onClose={handleNotificationsClose}
    >
      {listAdd && listAdd.map((user, index) => (
        <MenuItem key={index} style={{ padding: '20px'}} onClick={() => handleViewUser(getUserById(user.idUser2)._id)}>          
        <img
          src={`${SERVER_URL}/uploads/${getUserById(user.idUser2).avatar ? getUserById(user.idUser2).avatar : 'user.png'}`}
          alt="User Avatar"
          width="40"
          height="40"
          style={{ borderRadius: "45px", marginRight: "8px" }}
        />{getUserById(user.idUser2).name} đã đồng ý kết bạn</MenuItem>
      ))}
    </Menu>
  );


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{
        position: 'fixed',
        backgroundColor: 'transparent',
        boxShadow: 'none'
      }}>
        <DialogQRCode open={open} handleClose={() => setOpen(false)}/>
        <DialogUser open={openUser} handleClose={() => setOpenUser(false)} id={idView}/>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton aria-controls={notifications} size="large" color="inherit" onClick={handleNotificationsOpen}>
              <Badge badgeContent={listAdd ? listAdd.length : 0} color="error">
                <MailIcon sx={{ color: '#0950CD'}}/>
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-controls={friend}
              color="inherit"
              onClick={handleFriendOpen}
            >
              <Badge badgeContent={friendFilter ? friendFilter.length : 0} color="error">
                <PersonAddIcon sx={{ color: '#0950CD'}}/>
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <DehazeIcon sx={{ color: '#0950CD'}}/>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {listAdd && listAdd.length !== 0 && renderNotifications}
      {friendFilter && friendFilter.length !== 0 && renderFriend}
    </Box>
  );
}
