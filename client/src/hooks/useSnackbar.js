import React, { useState }from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

export function useSnackbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');

  const showMessage = () => setIsVisible(true);
  const hideMessage= () => setIsVisible(false);

  const getAlertMessage = (variant, message) => {
      setVariant(variant);
      setMessage(message);
      showMessage();
  };

 const AlertMessage = () => {
  return(
    <Snackbar open={isVisible} autoHideDuration={2000} onClose={hideMessage}>
      <Alert onClose={hideMessage} severity={variant}>
        {message}
      </Alert>
    </Snackbar>
  )
 }

  return { AlertMessage, isVisible, getAlertMessage };
}