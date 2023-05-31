import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import TextField from '@mui/material/TextField';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, addDoc, getDoc, query, where, limit } from 'firebase/firestore';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextareaAutosize } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import _, { cloneDeep } from 'lodash';
import { useCategoryStore } from '../../../stores/Category';
import { useListCateStore } from '../../../stores/ListCateStore';
import { STATUS, TEXT_ERROR } from '../../Constant';
import Toast from '../../../Utill';
import { getDatabase, set, ref } from 'firebase/database';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IDialog {
    open: boolean;
    setOpen: (e: boolean) => void;
    type?: any;
    children?: any;
    setLoading?: (e: boolean) => void;
    loading?: boolean;
    isEdit?: boolean;
    data?: any;
}

const OrderStatus = [
    {
        label: "Wait",
        value: "Wait",
        type: 1,
        disabled: false
    },
    {
        label: "Pending",
        value: "Pending",
        type: 2,
        disabled: false
    },
    {
        label: "Done",
        value: "Done",
        type: 3,
        disabled: false
    },
    {
        label: "Cancel",
        value: "Cancel",
        type: 1,
        disabled: false
    },

]

const OrderDialog: React.FC<IDialog> = (props) => {
    const {
        open,
        setOpen = () => {},
        type,
        loading,
        setLoading = () => {},
        isEdit,
        data
    } = props;
  // const []
  const dataClone = cloneDeep(data);
  const [status, setStatus] = React.useState(dataClone?.status || "Wait");
  const [listStatus, setListStatus] = React.useState<any[]>([]);

  const [toast, setToast] = React.useState<{success: boolean, show: boolean}>({
    success: false,
    show: false
  });

  React.useEffect(() => {
    // const orderStatusClone = cloneDeep(OrderStatus);
    let orderStatusMap = [];
    switch (data.status) {
        case STATUS.DONE:
        case STATUS.CANCEL:
            orderStatusMap = OrderStatus.map((item) => {
                return {...item, disabled: true}
            });
            setListStatus(orderStatusMap);
            break;
        case STATUS.WAIT:
            orderStatusMap = OrderStatus.map((item) => {
                let itemStatus = false;
                if ([STATUS.WAIT, STATUS.DONE].includes(item.value)) {
                    itemStatus = true;
                }
                return {...item, disabled: itemStatus}
            });
            setListStatus(orderStatusMap)
            break;
        case STATUS.PENDING:
            orderStatusMap = OrderStatus.map((item) => {
                let itemStatus = false;
                if ([STATUS.WAIT, STATUS.PENDING].includes(item.value)) {
                    itemStatus = true;
                }
                return {...item, disabled: itemStatus}
            });
            setListStatus(orderStatusMap);
            break;
    
        default:
            break;
    }
  }, [data?.status]);

  const handleClose = () => {
    setOpen(false);
  };
console.log('ssssssssss');

  const handleSave = async () => {
    try {
        const dbRealtime = getDatabase();
        await set(ref(dbRealtime, `orders/${data.id}`), {
            ...data,
            status: status
        });
        setToast({
            success: true,
            show: true
        });
        handleClose();
    } catch (error) {
        setToast({
            success: false,
            show: true
        });
    }
  };

  const handleSelectStatus = (e: any) => {
    setStatus(e.target.value);
  };

  const onCheckForm = () => {
    if (_.isEqual(status, data.status)) {
        return true;
    }
    return false;
  };

  const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setToast({...toast, show: false});
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth={true}
        className='dialog-model-order'
      >
        <DialogTitle>{"Edit Status Order"}</DialogTitle>
        <DialogContent className='dialog-content'>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">Select Category</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="name"
                onChange={handleSelectStatus}
                >
                {
                   listStatus && listStatus.map((item) => {
                    return (
                        <MenuItem value={item.value} disabled={item.disabled}>{item.label}</MenuItem>
                    )
                    })
                }
                
                </Select>
            </FormControl>
          
        </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={onCheckForm()}>Save</Button>
          </DialogActions>
      </Dialog>
      <Toast 
        open={toast.show}
        type={toast.success ? 'success' : 'error'}
        text={toast.success ? 'Update Success!' : 'Update Fail!'}
        handleClose={handleCloseToast}
      />
    </div>
  );
}

export default OrderDialog;