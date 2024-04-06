import React from 'react';
import { Provider } from 'react-redux';
import Navigation from './Navigation'
import store from './store/store';
import { SnackbarProvider } from 'notistack';
import Notification from './components/logicComponent/Notification';
import LoginNotification from './components/logicComponent/LoginNotification';
import CallNotication from './components/logicComponent/CallNotication';
const App = () => {
  return (
    <Provider store={store} >
      <SnackbarProvider maxSnack={1} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
        <CallNotication />
      </SnackbarProvider>
      <SnackbarProvider maxSnack={1} anchorOrigin={{ horizontal: 'center', vertical: 'center' }}>
        <LoginNotification />
      </SnackbarProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Notification />
      </SnackbarProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
        <Navigation />
      </SnackbarProvider>
    </Provider>
  );
};

export default App;