import React, { useState } from 'react'
import { Container, Grid, Box, TextField, Button, Card, CardActions, CardContent, CardMedia, Typography, DialogContent, DialogActions, Dialog } from '@mui/material';
import * as ENV from '../env';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import { add } from '../services/apiCustomer';
import { useCookies } from 'react-cookie'
import { useSelector } from 'react-redux';
const SERVER_URL = `http://${ENV.env.ipv4}:5000`

const SearchChannel = ({ groups, fetchData, groupMembers }) => {
  const [groupFind, setGroupFind] = useState(null);
  const [urlNameGroup, setUrlNameGroup] = useState('');
  const [cookies, removeCookie] = useCookies(['user']);
  const { enqueueSnackbar } = useSnackbar();
  const users = useSelector((state) => state.data.user)
  const [open, setOpen] = useState(false);
  const [idGroup, setIdGroup] = useState(null)

  const handleSearch = () => {
    if(urlNameGroup === '') {
      enqueueSnackbar('Không tìm thấy channel', { variant: 'error', autoHideDuration: 1000 });
      return;
    }
    const groupFindA = groups.filter((item) => item.nameGroup === urlNameGroup)
    if(groupFindA.length === 0) {
      enqueueSnackbar('Không tìm thấy channel', { variant: 'error', autoHideDuration: 1000 });
      setUrlNameGroup('')
      return;
    }
    setGroupFind(groupFindA)

    setUrlNameGroup('')
  }

  const handleOpen = (id) => {
    setIdGroup(id);
    setOpen(true)
  }

  const handJoinGroup = async () => {
    try {
      await add({
        idGroup: idGroup,
        idMember: cookies.user._id
      }, 'groupmembers')
      fetchData();
      setOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const ComfirmJoin = () => {
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
        <DialogContent>
          Bạn có muốn tham gia Channel này?
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handJoinGroup}>Join</Button>
        </DialogActions>
      </Dialog>
    )
  }

  const Group = ({ group }) => {

    const user = users.find((user) => user._id === group.hostGroup)
    return (
      <Card sx={{ maxWidth: '100%', marginBottom: '15px' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {group.nameGroup && group.nameGroup}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Host: {user.name}
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'end' }}>
          <Button size="medium" onClick={() => handleOpen(group._id)}>Join</Button>
        </CardActions>
      </Card>
    )
  }
  return (
    <Container>
      <ComfirmJoin />
      {groupFind ? (
        <>
          <TextField
            style={styles.input}
            label="Tên channel"
            InputLabelProps={{
              style: { color: '#fbb700', fontWeight: 'bolder' },
            }}
            InputProps={{
              style: { color: '#fbb700', fontWeight: 'bolder' },
            }}
            value={urlNameGroup}
            onChange={(e) => setUrlNameGroup(e.target.value)}
          />
          <Button style={styles.button} onClick={handleSearch}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fbb700'
              e.target.style.color = 'black'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#0950CD'
              e.target.style.color = 'white'

            }}>Search</Button>
          <Box sx={{
            maxHeight: '100vh',
            overflow: "auto",
            scrollbarWidth: 'none', // Ẩn thanh cuộn cho Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Ẩn thanh cuộn cho WebKit browsers (Chrome, Safari, Edge, etc.)
            },
            '-ms-overflow-style': 'none',
          }}>
            {groupFind ? groupFind.map((group) => {
              const member = groupMembers.some((member) => member.idGroup === group._id && member.idMember === cookies.user._id);
              console.log(cookies.user, group, groupMembers)
              return !member && <Group key={group._id} group={group} />;
            }) :
            <div style={{ color: 'black'}}>Không tìm thấy threads nào cả...</div>}
          </Box>
        </>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} style={styles.container}>
              <TextField
                style={styles.input}
                label="Tìm kiếm..."
                InputLabelProps={{
                  style: { color: '#fbb700', fontWeight: 'bolder' },
                }}
                InputProps={{
                  style: { color: '#fbb700', fontWeight: 'bolder' },
                }}
                value={urlNameGroup}
                onChange={(e) => setUrlNameGroup(e.target.value)}
              />
              <Button
                style={styles.button}
                onClick={handleSearch}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fbb700'
                  e.target.style.color = 'black'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0950CD'
                  e.target.style.color = 'white'

                }}
              >Search</Button>
            </Grid>
          </Grid>
        </Box>
      )
      }
    </Container >
  )
}

const styles = {
  container: {
    height: '40vh',
    maxWidth: '100%',
    overflow: 'hidden',
    margin: '20px',
    borderRadius: '20px',
    textAlignLast: 'center'
  },
  input: {
    margin: '5px',
    width: '320px',
    backgroundColor: '#0950CD',
    color: 'white',
    borderRadius: '4px',
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
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#353839',
    height: '56px',
    marginTop: '5px'
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
    fontWeight: 'bolder'
  }

};

export default SearchChannel