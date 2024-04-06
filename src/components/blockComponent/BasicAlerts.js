import * as React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';

function BasicAlerts({ callback, variant, text }) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (variant) => () => {
    enqueueSnackbar(text, { variant, autoHideDuration: 1000 });
    callback();
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickVariant(variant)}>Show success snackbar</Button>
    </React.Fragment>
  );
}

export default function IntegrationNotistack({callback, variant, text}) {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
      <BasicAlerts callback={callback} variant={variant} text={text}/>
    </SnackbarProvider>
  );
}