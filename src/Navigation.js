import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import HomeScreen from './screens/HomeScreen';
import ConferenceRoom from './screens/ConferenceRoom';
import TestScreen from './screens/TestScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ConferrenceRecordScreen from './screens/ConferrenceRecordScreen';
import RoomChatScreen from './screens/RoomChatScreen';
import ColorScreen from './screens/ColorScreen';
import SettingScreen from './screens/SettingScreen';
import SpeechToText from './components/blockComponent/SpeechToText';
import CallVideo from './screens/CallVideo'
import Header from './components/blockComponent/Header';
import NotFoundPage from './screens/NotFoundPage'
import FetchData from './FetchData';
const Navigation = () => {
    const [cookies, removeCookie] = useCookies(['user']);
    return (
        <Router>
            <div>
                {cookies.user ? (
                    <>
                        <Header/>
                        <FetchData />
                        <Routes>
                            <Route path="/" element={<HomeScreen />} />
                            <Route path="/login" element={<Navigate to="/" />} />
                            <Route path='/register' element={<Navigate to="/" />} />
                            <Route path="/conference" element={<ConferenceRoom />} />
                            <Route path="/test" element={<TestScreen />} />
                            <Route path='/room' element={<RoomChatScreen />} />
                            <Route path="/color" element={<ColorScreen />} />
                            <Route path="/setting" element={<SettingScreen />} />
                            <Route path="/call" element={<CallVideo />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </>
                ) : (
                    <>
                        <Routes>
                            <Route path="/login" element={<LoginScreen />} />
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path='/register' element={<RegisterScreen />} />
                            <Route path="/test" element={<TestScreen />} />
                            <Route path="/color" element={<ColorScreen />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </>
                )}

            </div>
        </Router>
    );
};

export default Navigation;
