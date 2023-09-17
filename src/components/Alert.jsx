import { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Alerting({message,severity,setAlert}) {


    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert({message:''});
        }, 3000);

        return () => {
        clearTimeout(timer);
        };
    }, [setAlert]);

  return (
    <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message?true:false}
    >
        <Alert severity={severity} onClose={() => setAlert({message:''})}>{message}</Alert>

    </Snackbar>
  );
}