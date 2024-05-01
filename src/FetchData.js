import React, { useEffect } from 'react'
import { get } from './services/apiCustomer'
import { useDispatch } from 'react-redux'
import {
    setUser,
    setGroup,
    setTopic,
    setMember,
    setMessage,
    setUploadImage,
    setFriend
} from './store/Slice/dataSlice'
import socket from './components/logicComponent/socketId'

const FetchData = () => {
    const dispatch = useDispatch();
    const fetchUser = async() => {
        try{
            const result = await get('users');
            dispatch(setUser(result))
        } catch (e) {
         console.error(e)   
        }
    }
    
    const fetchGroup = async() => {
        try{
            const result = await get('groups');
            dispatch(setGroup(result))
        } catch (e) {
         console.error(e)   
        }
    }
    
    const fetchTopic = async() => {
        try{
            const result = await get('topicgroups');
            dispatch(setTopic(result))
        } catch (e) {
         console.error(e)   
        }
    }
    
    const fetchMember = async() => {
        try{
            const result = await get('groupmembers');
            dispatch(setMember(result))
        } catch (e) {
         console.error(e)   
        }
    }
    
    const fetchMessage = async() => {
        try{
            const result = await get('messages');
            dispatch(setMessage(result))
        } catch (e) {
         console.error(e)   
        }
    }
    
    const fetchUploadImage = async() => {
        try{
            const result = await get('groupmembermessages');
            dispatch(setUploadImage(result))
        } catch (e) {
         console.error(e)   
        }
    }
    
    const fetchFriend = async() => {
        try{
            const result = await get('friends');
            dispatch(setFriend(result))
        } catch (e) {
         console.error(e)   
        }
    }

    useEffect(() => {
        socket.on('fetch friend', () => fetchFriend())
        socket.on('Create threads', fetchTopic)
    }, [])

    useEffect(() => {
        fetchUser()
        fetchGroup()
        fetchTopic()
        fetchMember()
        fetchMessage()
        fetchUploadImage()
        fetchFriend()
    }, [])
    return null
}

export default FetchData
