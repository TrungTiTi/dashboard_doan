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
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextareaAutosize } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import _ from 'lodash';
import { useCategoryStore } from '../../../stores/Category';
import { useListCateStore } from '../../../stores/ListCateStore';

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

interface IListCate {
  id?: string;
  name?: string;
  cateId?: string;
  description: string;
  condition: string;
  case: string;
  paymentMethod: string;
  detailTitle?: string;

}

const LIST_CATE_DEFAULT = {
  cateId: '',
  name: '',
  description: '',
  condition: '',
  case: '',
  paymentMethod: '',
  detailTitle: ''
}

const ListCateDialog: React.FC<IDialog> = (props) => {
    const {
        open,
        setOpen = () => {},
        type,
        loading,
        setLoading = () => {},
        isEdit,
        data
    } = props;
  const [categoryName, setCategoryName] = React.useState<string>('');
  const [listCate, setListCate] = React.useState<IListCate>({...LIST_CATE_DEFAULT});
  // const []
  const categoryStore = useCategoryStore();
  const listCateStore = useListCateStore();
  const [isNameExist, setIsNameExist] = React.useState<boolean>(false);

  React.useEffect(() => {
    categoryStore.getCates();
  }, []);

  const handleClose = () => {
    onResetData();
    setOpen(false);
  };

  React.useEffect(() => {
    if (isEdit && data) {
      handleChangeData(data);
      setCategoryName(data.name);
    }
  }, [isEdit, data]);

  const handleChangeData = (value: any) => {
    setListCate({
      cateId: value?.cateId,
      name: value?.name,
      id: value?.id,
      description: value?.description,
      condition: value?.condition,
      case: value?.case,
      paymentMethod: value?.paymentMethod,
      detailTitle: value?.detailTitle || ''
    })
  }

  const handlePutListCate = (item: any) => {
    return {
      name: item.name,
      cateId: item.cateId,
      description: item.description,
      condition: item.condition,
      case: item.case,
      paymentMethod: item.paymentMethod,
      detailTitle: item.detailTitle
    }
  }

  const handleAddType = async () => {
    if (listCateStore.listCateData.length && listCate.name) {
      const listCateFound: any = listCateStore.listCateData.filter((item) => item.cateId === listCate.cateId);
      console.log('listCateFound', listCateFound)
      if (listCateFound[0].name.toUpperCase() === listCate.name.toUpperCase()) {
        setIsNameExist(true);
        return;
      }
    }
    setLoading(true);
    try {
        const newFood = isEdit ? await updateDoc(doc(db, "listCate", data.id), handlePutListCate(listCate)) 
        : await addDoc(collection(db, "listCate"), handlePutListCate(listCate))
      listCateStore.getListCates();
    } catch (error) {
      
    }
    setLoading(false);
    setOpen(false);
    onResetData();

  };

  const onCheckForm = () => {

    if (!listCate.name || !listCate.cateId) {
      return true;
    }
    if (isEdit && _.isEqual(listCate, data)) {
      return true;
    }
    return false;
  };

  const onResetData = () => {
    setListCate({...LIST_CATE_DEFAULT})
  }

  const handleSelectCate = (e: SelectChangeEvent) => {
    setListCate({...listCate, cateId: e.target.value})
  };

  const handleChange = (value: any, field: string) => {
    setListCate({...listCate, [field]: value})
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
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent className='dialog-content'>
          
          <div className='dg-left-content'>
          <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">Select Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={listCate.cateId}
              label="name"
              onChange={handleSelectCate}
            >
              {
                categoryStore.categoryData && categoryStore.categoryData.map((item) => {
                  return (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  )
                })
              }
              
            </Select>
          </FormControl>
          </div>
          <div className='dg-right-content'>
            <span>listCate Name</span> <br></br>
            <TextField id="outlined-categoryName" 
              onChange={(e) => 
                {
                  setIsNameExist(false);
                  handleChange(e.target.value, 'name')
                }} 
              value={listCate?.name} 
              error={isNameExist}
            />
            <div>
              <span>Detail title</span> <br></br>
              <TextField id="outlined-categoryName" 
                onChange={(e) => handleChange(e.target.value, 'detailTitle')}
                value={listCate?.detailTitle} 
              />
            </div>
            <div>
                <span>Desscription</span> <br></br>
                <TextareaAutosize 
                  minRows={10}
                  onChange={(e) => handleChange(e.target.value, 'description')} 
                  value={listCate?.description} 
                />
            </div>
            <div>
                <span>Condition</span> <br></br>
                <TextareaAutosize 
                  minRows={10}
                  onChange={(e) => handleChange(e.target.value, 'condition')}
                  value={listCate?.condition} 
                />
            </div>
            <div>
                <span>Case</span> <br></br>
                <TextareaAutosize 
                  minRows={10}
                  onChange={(e) => handleChange(e.target.value, 'case')}
                  value={listCate?.case}
                />
            </div>
            <div>
                <span>payment Method</span> <br></br>
                <TextareaAutosize 
                  minRows={10}
                  onChange={(e) => handleChange(e.target.value, 'paymentMethod')}
                  value={listCate?.paymentMethod}
                />
            </div>
          </div>
        </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddType} disabled={onCheckForm()}>Save</Button>
          </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListCateDialog