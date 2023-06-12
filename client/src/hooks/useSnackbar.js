import React from 'react';

export function useSnackbar() {
  const [isActive, setIsActive] = React.useState(false);
  const [message, setMessage] = React.useState();
  
  React.useEffect(() => {
    if (isActive === true) {
      setTimeout(() => {
        setIsActive(false);
      }, 3000);
    }
  }, [isActive]);

  const openSnackBar = (type, message) => {
    setMessage(message)
    setIsActive(true);
  }

  return { isActive, message, openSnackBar }
}