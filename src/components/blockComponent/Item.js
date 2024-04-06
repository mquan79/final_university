import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
export const ItemGroup = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    width: 70,
    height: 70,
    margin: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export const ItemTopic = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

