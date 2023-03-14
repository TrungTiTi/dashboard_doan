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
import '../Dialog/Dialog.css';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, addDoc, getDoc, query, where, limit } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextareaAutosize } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import _, { cloneDeep } from 'lodash';
import { useListCateStore } from '../../stores/ListCateStore';
import { useCategoryStore } from '../../stores/Category';

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

interface IProduct {
  id?: string;
  name?: string;
  image?: any;
  desscription?: string;
  price?: number;
  condition?: string;
  case?: string;
  paymentMethod?: string;
  cateId?: string;
  listCateId?: string;
}

const ProductDialog: React.FC<IDialog> = (props) => {
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
  const [categoryName, setCategoryName] = React.useState<string>('');
  const [product, setProduct] = React.useState<IProduct>({
    image: [],
    name: '',
    desscription: '',
    price: 0,
    condition: '',
    case: '',
    paymentMethod: '',
    listCateId: '',
    cateId: ''
  });
  const [listCateSelect, setListCateSelect] = React.useState<any[]>([]);
  const [imgArr, setImgArr] = React.useState<any>([]);
  const listCateStore = useListCateStore();
  const categoryStore = useCategoryStore();

  const handleClose = () => {
    setOpen(false);
    onResetData()
    // setProduct({...product, image: []});
  };

  React.useEffect(() => {
    console.log('111111')
    categoryStore.getCates();
    listCateStore.getListCates();
  }, [])

  React.useEffect(() => {
    if (isEdit && data) {
      handleChangeData(data);
      setCategoryName(data.name);
    }
  }, [isEdit, data]);

  const handleChangeData = (value: any) => {
    // setProduct({
    //     titleContent: value?.titleContent,
    //     desscription: value?.desscription,
    //     price: value?.price,
    //     condition: value?.condition,
    //     case: value?.case,
    //     paymentMethod: value?.paymentMethod,
    //     image: value?.image,
    //     title: value?.title,
    //     name: value?.name,
    //     id: value?.id
    // })
  }

  React.useEffect(() => {
    if(!imagePreview){
        // setPreview(undefined)
        if (isEdit) return;
        setProduct({...product, image: []})
        return
    }

    const objectUrl:any = imagePreview.map((item: any) => {
        return URL?.createObjectURL(item);
    })
    // setPreview(objectUrl);
    setProduct({...product, image: objectUrl})

    // // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  },[imagePreview])

  const handleChooseImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
        setImagePreview(undefined)
        return;
    }
    let fileImg = [];
    for (let i = 0; i < e.target.files.length; i++) {
        fileImg.push(e.target.files[i]);
    }

    setImagePreview(fileImg);
  };

  const handleAddType = async () => {
    setLoading(true);
    try {
      if (isEdit && data.image === product.image) {
        await updateDoc(doc(db, "product", data.id), {
            name: product.name,
            desscription: product?.desscription,
            price: product?.price,
            condition: product?.condition,
            case: product?.case,
            paymentMethod: product?.paymentMethod,
            cateId: product.cateId,
            listCateId: product.listCateId
        })
      } else {
        imagePreview.map((image: any) => {
          const storageRef = ref(storage, `Files/${image.name}`)
          const uploadTask = uploadBytesResumable(storageRef, image)
          uploadTask.on("state_changed", (snapshot) => {
            }, (err) => {}, () => {
              getDownloadURL(uploadTask.snapshot.ref)
              .then(async(url) => {
                if (isEdit) {
                  await updateDoc(doc(db, "product", data.id), {
                    name: product.name,
                    desscription: product?.desscription,
                    price: product?.price,
                    condition: product?.condition,
                    case: product?.case,
                    paymentMethod: product?.paymentMethod,
                    image: product?.image,
                    cateId: product.cateId,
                    listCateId: product.listCateId
                  })
                } else {
                  await addDoc(collection(db, "product"), {
                    name: product.name,
                    desscription: product?.desscription,
                    price: product?.price,
                    condition: product?.condition,
                    case: product?.case,
                    paymentMethod: product?.paymentMethod,
                    image: product?.image,
                    cateId: product.cateId,
                    listCateId: product.listCateId
                 })
                }
              })
            }
          );
        })

      // }
      }
    } catch (error) {
      
    }
    setLoading(false);
    // setOpen(false);

  };

  const onCheckForm = () => {

    if (!product.name || !product.cateId || !product.image.length || !product.listCateId) {
      return true;
    }
    if (isEdit && _.isEqual(product, data)) {
      return true;
    }
    return false;
  };

  const onResetData = () => {
    setProduct({...product, name: '', listCateId: '', cateId: '', })
    setImagePreview(null);
    setImgArr([]);
  }

  const handleRemoveImg = (file: any, index: number) => {
    const fileClone = product.image.filter((item: any) => item !== file)
    // fileClone.slice(index + 1, 1);
    setProduct({...product, image: fileClone});
  }

  const handleSelectCategory = (e: SelectChangeEvent) => {
    setProduct({...product, cateId: e.target.value});
    const listCateR: any[] = listCateStore.listCateData.filter((item) => item.cateId === e.target.value);
    setListCateSelect(listCateR);
  };

  const handleSelectCateInCategory = (e: SelectChangeEvent) => {
    setProduct({...product, listCateId: e.target.value});
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth={true}
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent className='dialog-content'>
          <div className='dg-left-content'>
            {
              product.image.length ? 
              product.image.map ((item: any, index: number) => {
                return (
                    <div className='img-preview'>
                        <CancelIcon onClick={() => handleRemoveImg(item, index)}/>
                        <img className='' src={item} />
                    </div>
                )
              }) :
              <div className='text__line'>
                  <span>Image</span>
                  <input type='file' style={{width: '50%'}} onChange={handleChooseImg} required multiple/>
              </div>
            }
            <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">Select Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={product.cateId}
                label="name"
                onChange={handleSelectCategory}
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
            <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">Select Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="select-list-cate"
                value={product.listCateId}
                label="Select Type"
                onChange={handleSelectCateInCategory}
              >
                {
                  listCateSelect.length &&  listCateSelect.map((item) => {
                    return (
                      <MenuItem value={item.id}>{item.name}</MenuItem>
                    )
                  })
                }
                
              </Select>
            </FormControl>
          </div>
          <div className='dg-right-content'>
            <div>
                <span>Product Name</span> <br></br>
                <TextField id="outlined-categoryName" onChange={(e) => setProduct({...product, name: e.target.value})} value={product?.name} />
            </div>
            <div>
                <span>Desscription</span> <br></br>
                <TextareaAutosize 
                  minRows={10}
                  onChange={(e) => setProduct({...product, desscription: e.target.value})} 
                  value={product?.desscription} 
                />
                {/* <TextField id="outlined-basic" onChange={(e) => setProduct({...product, desscription: e.target.value})} value={product?.desscription} /> */}
            </div>
            <div>
                <span>Price</span> <br></br>
                <TextField id="outlined-basic" type={'number'} onChange={(e) => setProduct({...product, price: +(e.target.value)})} value={product?.price} />
            </div>
            <div>
                <span>Condition</span> <br></br>
                <TextField id="outlined-basic" onChange={(e) => setProduct({...product, condition: e.target.value})} value={product?.condition} />
            </div>
            <div>
                <span>Case</span> <br></br>
                <TextField id="outlined-basic" onChange={(e) => setProduct({...product, case: e.target.value})} value={product?.case} />
            </div>
            <div>
                <span>Payment Method</span> <br></br>
                <TextField id="outlined-basic" onChange={(e) => setProduct({...product, paymentMethod: e.target.value})} value={product?.paymentMethod} />
            </div>
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

export default ProductDialog;