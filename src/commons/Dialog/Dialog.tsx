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
import './Dialog.css';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, addDoc, getDoc, query, where, limit } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { CircularProgress } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import _ from 'lodash';

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

interface ICategory {
  id?: string;
  name?: string;
  image?: any;
  title?: string
}

const DialogModel: React.FC<IDialog> = (props) => {
    const {
        open,
        setOpen = () => {},
        type,
        loading,
        setLoading = () => {},
        isEdit,
        data
    } = props;
  const [imagePreview, setImagePreview] = React.useState<any>(null);
  // const [preview, setPreview] = React.useState<any>();
  // const [categoryTitle, setCategoryTitle] = React.useState<string>('');
  const [categoryName, setCategoryName] = React.useState<string>('');
  const [category, setCategory] = React.useState<ICategory>({
    image: undefined,
    title: '',
    name: ''
  });

  const handleClose = () => {
    setOpen(false);
  };

  const FormCategory = () => {

  };

  React.useEffect(() => {
    if (isEdit && data) {
      handleChangeData(data);
      setCategoryName(data.name);
    }
  }, [isEdit, data]);

  const handleChangeData = (value: any) => {
    setCategory({
      image: value?.image,
      title: value?.title,
      name: value?.name,
      id: value?.id
    })
  }

  React.useEffect(() => {
    if(!imagePreview){
        // setPreview(undefined)
        if (isEdit) return;
        setCategory({...category, image: undefined})
        return
    }
    const objectUrl:any = URL?.createObjectURL(imagePreview);
    // setPreview(objectUrl);
    setCategory({...category, image: objectUrl})

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  },[imagePreview])

  const handleChooseImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
        setImagePreview(undefined)
        return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setImagePreview(e.target.files[0]);
  };

  const handleAddType = async () => {
    setLoading(true);
    try {
      if (isEdit && data.image === category.image) {
        await updateDoc(doc(db, "category", data.id), {
          name: category.name,
          title: category.title,
        })
      } else {
      const storageRef = ref(storage, `Files/${imagePreview.name}`)
            const uploadTask = uploadBytesResumable(storageRef, imagePreview)
        uploadTask.on("state_changed", (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log('prog', prog)
        }, (err) => {}, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
              const newFood = isEdit ? await updateDoc(doc(db, "category", data.id), {
                    name: category.name,
                    title: category.title,
                    image: url
                }) : await addDoc(collection(db, "category"), {
                  name: category.name,
                  title: category.title,
                  image: url
              })

            })
          }
        );
      }
    } catch (error) {
      
    }
    setLoading(false);
    setOpen(false);
    onResetData();

  };

  const onCheckForm = () => {

    if (!category.name || !category.title || !category.image) {
      return true;
    }
    if (isEdit && _.isEqual(category, data)) {
      return true;
    }
    return false;
  };

  const onResetData = () => {
    // setCategoryName('');
    // setCategoryTitle('');
    setCategory({...category, name: '', title: ''})
    setImagePreview(null);
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
          {/* <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText> */}
          <div className='dg-left-content'>
            {
              category.image ? 
              <div className='img-preview'>
                <CancelIcon onClick={() => setCategory({...category, image: null})}/>
                <img className='' src={category.image} />
              </div> :
              <div className='text__line'>
                  <span>Image</span>
                  <TextField id="outlined-basic" type='file' style={{width: '50%'}} onChange={handleChooseImg} required />
              </div>
            }
          </div>
          <div className='dg-right-content'>
            <span>Category Name</span> <br></br>
            <TextField id="outlined-categoryName" onChange={(e) => setCategory({...category, name: e.target.value})} value={category?.name} />
            <div style={{height: '10px'}}></div>
            <span>Categry Title</span> <br></br>
            <TextField id="outlined-basic" onChange={(e) => setCategory({...category, title: e.target.value})} value={category?.title} />
          </div>
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

export default DialogModel