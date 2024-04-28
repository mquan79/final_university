import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import InfoUser from './InfoUser';

const DialogQRCode = ({ open, handleClose, id }) => {
  const [cookies] = useCookies(['user']);
  const friends = useSelector((state) => state.data.friend);
  const [stateFriend, setStateFriend] = useState(null);

  useEffect(() => {
    if (friends && cookies && id) {
      const stateWait = friends.find(e => e.idUser1 === id && e.idUser2 === cookies.user?._id && e.status === 'wait');
      const stateFriend = friends.find(e => (e.idUser1 === id && e.idUser2 === cookies.user?._id || e.idUser2 === id && e.idUser1 === cookies.user?._id) && e.status === 'friend');
      const stateNotWait = friends.find(e => e.idUser2 === id && e.idUser1 === cookies.user?._id && e.status === 'wait');
      if (stateWait) {
        setStateFriend('wait');
      } else if (stateFriend) {
        setStateFriend('friend');
      } else if (stateNotWait) {
        setStateFriend('waiting');
      } else {
        setStateFriend('no');
      }
    }
  }, [friends, cookies, id]);

  const handleFriendAction = () => {
    // Xử lý hành động khi nhấn nút tùy thuộc vào stateFriend
    // Ví dụ: Gửi yêu cầu kết bạn, chấp nhận yêu cầu kết bạn, hủy yêu cầu kết bạn, vv.
  };

  const renderFriendButton = () => {
    switch (stateFriend) {
      case 'wait':
        return (
          <>
            <Button onClick={handleFriendAction}>Chấp nhận</Button>
            <Button onClick={handleFriendAction}>Hủy lời mời</Button>
          </>
        );
      case 'friend':
        return <Button disabled>Đã kết bạn</Button>;
      case 'waiting':
        return <Button onClick={handleFriendAction}>Hủy lời mời</Button>;
      case 'no':
        return <Button onClick={handleFriendAction}>Gửi lời mời</Button>;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        onClick={handleClose}
      />
      <DialogContent style={{
        padding: '40px'
      }}>
        <InfoUser id={id} />
        {renderFriendButton()}
      </DialogContent>
    </Dialog>
  );
}

export default DialogQRCode;
