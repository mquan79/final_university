import React, { useState } from 'react';
import InfoUserSetting from '../components/blockComponent/InfoUserSetting'
import ConferenceRecordScreen from './ConferrenceRecordScreen'
import { useCookies } from 'react-cookie'
const ProfileTab = ({ label, selected, onClick }) => {
  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: selected ? '#eee' : '#fff',
        cursor: 'pointer',
        borderBottom: '1px solid #ccc',

      }}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

const ProfileContent = ({ tab }) => {
  const [cookies, removeCookie] = useCookies(['user']);
  if (tab === 'info') {
    return <InfoUserSetting id={cookies.user._id} />;
  } else if (tab === 'settings') {
    return <div>Cài đặt</div>;
  } else if (tab === 'channel') {
    return <div>Channel</div>;
  } else if (tab === 'record') {
    return <ConferenceRecordScreen />;
  }
  return null;
};

const SettingScreen = () => {
  const [selectedTab, setSelectedTab] = useState('info');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'white', height: '100vh' }}>
      <div style={{ width: '200px', borderRight: '1px solid #ccc' }}>
        <div style={{
          marginTop: '50px'
        }}></div>
        <ProfileTab
          label="Thông tin cá nhân"
          selected={selectedTab === 'info'}
          onClick={() => handleTabClick('info')}
        />
        {/* <ProfileTab
          label="Cài đặt"
          selected={selectedTab === 'settings'}
          onClick={() => handleTabClick('settings')}
        /> */}
        {/* <ProfileTab
          label="Danh sách channel"
          selected={selectedTab === 'channel'}
          onClick={() => handleTabClick('channel')}
        /> */}
        <ProfileTab
          label="Video đã lưu"
          selected={selectedTab === 'record'}
          onClick={() => handleTabClick('record')}
        />
      </div>
      <div style={{ flex: 1 }}>
        <ProfileContent tab={selectedTab} />
      </div>
    </div>
  );
};

export default SettingScreen;
