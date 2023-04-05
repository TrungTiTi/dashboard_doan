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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// import './Dialog.css';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, addDoc, getDoc, query, where, limit } from 'firebase/firestore';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { CircularProgress } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import _ from 'lodash';
import { TEXT_ERROR } from '../../Constant';
import { useNavigate } from 'react-router-dom';
import { getDatabase, set, update , ref} from 'firebase/database';

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

const UserDialog: React.FC<IDialog> = (props) => {
    const {
        open,
        setOpen = () => {},
        loading,
        setLoading = () => {},
        isEdit,
        data
    } = props;
    console.log('89979797979', data);

  const [isPermissionChoose, setIsPermissionChoose] = React.useState<boolean>(false);
  React.useEffect(() => {
    if(data?.id) {
      setIsPermissionChoose(data.isPermission);
    }
  },[data])

  const handleClose = () => {

    setOpen(false);
    setIsPermissionChoose(data?.isPermission)
  };

  const handleAddType = async () => {
    
    setLoading(true);
    let res: any = null;
    const dbF = getDatabase();
    try {

        res = await updateDoc(doc(db, "users", data.id), {
            isPermission: isPermissionChoose
        });

        await update(ref(dbF, 'users/' + data.id), {
          isPermission: isPermissionChoose
        });
        console.log('88484848')
      
    } catch (error) {
      console.log('err', error)
    }
    
    setLoading(false);
    setOpen(false);
  };

  const onCheckForm = () => {
    if (_.isEqual(data?.isPermission, isPermissionChoose)) {
      return true;
    }
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueR = (e.target as HTMLInputElement).value;

    if (valueR == "true") {
        setIsPermissionChoose(true);
    } else {
        setIsPermissionChoose(false);
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth={true}
        className='dialog-model'
      >
        <DialogTitle>{"Update Role User"}</DialogTitle>
        <DialogContent className='dialog-content'>
            <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={isPermissionChoose}
                    onChange={handleChange}
                >
                    <FormControlLabel value={true} control={<Radio />} label="Permission" />
                    <FormControlLabel value={false} control={<Radio />} label="Unpermission" />
                </RadioGroup>
            </FormControl>
        </DialogContent>
        {loading ? <CircularProgress color="secondary" /> :
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddType} disabled={onCheckForm()}>Save</Button>
          </DialogActions>
        }
        
      </Dialog>
    </div>
  );
}

export default UserDialog;