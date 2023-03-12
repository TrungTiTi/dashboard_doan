import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import './ConfirmDialog.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

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
    setSelected?: (e: any) => void;
}

interface ICategory {
  id?: string;
  name?: string;
  image?: any;
  title?: string
}

const ConfirmDialog: React.FC<IDialog> = (props) => {
    const {
        open,
        setOpen = () => {},
        type,
        loading,
        setLoading = () => {},
        isEdit,
        data,
        setSelected = () => {}
    } = props;
  
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
      setLoading(true);
      try {
          if (data.length) {
              const dataMap = data.map((idCate: string) => {
                  return deleteDoc(doc(db, "category", idCate))
              })
              const res = await Promise.all(dataMap);
              if (res) {
                setSelected([]);
              }
          }
      } catch (error) {
          
      }
      setLoading(false);
      setOpen(false);
    }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth={true}
        className='confirm-dialog'
      >
        <DialogTitle>{"Confirm Dialog"}</DialogTitle>
        <DialogContent className='dialog-content'>
          <DeleteIcon className='ic-delete' />
        </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDelete}>Save</Button>
          </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;