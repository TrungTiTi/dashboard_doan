import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import React from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface IToast {
    open: boolean,
    type: AlertColor | undefined,
    text: string,
    handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const Toast = (props: IToast) => {
    const {open, type, text, handleClose} = props;
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
            {text}
            </Alert>
        </Snackbar>
    )
};

export default Toast;