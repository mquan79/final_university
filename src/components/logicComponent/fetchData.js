import { get } from '../../services/apiCustomer';
import {
    setUser,
    setGroup,
    setTopic,
    setMember,
    setMessage,
    setUploadImage, 
    setFriend
} from '../../store/Slice/dataSlice';
import { useDispatch } from 'react-redux'
const fetchData = async (endpoint, setter, dispatch) => {
    try {
        const result = await get(endpoint);
        dispatch(setter(result));
    } catch (e) {
        console.error(e);
    }
};

export const useDataFetching = () => {
    const dispatch = useDispatch();

    const fetchUser = () => fetchData('users', setUser, dispatch);
    const fetchGroup = () => fetchData('groups', setGroup, dispatch);
    const fetchTopic = () => fetchData('topicgroups', setTopic, dispatch);
    const fetchMember = () => fetchData('groupmembers', setMember, dispatch);
    const fetchMessage = () => fetchData('messages', setMessage, dispatch);
    const fetchUploadImage = () => fetchData('groupmembermessages', setUploadImage, dispatch);
    const fetchFriend = () => fetchData('friends', setFriend, dispatch);

    return {
        fetchUser,
        fetchGroup,
        fetchTopic,
        fetchMember,
        fetchMessage,
        fetchUploadImage,
        fetchFriend
    };
};
