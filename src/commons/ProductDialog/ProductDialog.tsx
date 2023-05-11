import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import TextField from "@mui/material/TextField";
import "../Dialog/Dialog.css";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  addDoc,
  getDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  LinearProgress,
  LinearProgressProps,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import _, { cloneDeep } from "lodash";
import { useListCateStore } from "../../stores/ListCateStore";
import { useCategoryStore } from "../../stores/Category";
import { observer } from "mobx-react-lite";
import { useProductStore } from "../../stores/Product";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

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
  price?: number;
  cateId?: string;
  listCateId?: string;
  youtubeLink?: string;
  instructFile? : string;
}

const ProductDialog: React.FC<IDialog> = (props) => {
  const {
    open,
    setOpen = () => {},
    type,
    loading,
    setLoading = () => {},
    isEdit,
    data,
  } = props;
  const [imagePreview, setImagePreview] = React.useState<any>(null);
  const [product, setProduct] = React.useState<IProduct>({
    image: [],
    name: "",
    price: 0,
    listCateId: "",
    cateId: "",
    youtubeLink: "",
    instructFile: ""
  });
  const [listCateSelect, setListCateSelect] = React.useState<any[]>([]);
  const listCateStore = useListCateStore();
  const categoryStore = useCategoryStore();
  const productStore = useProductStore();
  const [pdfFile, setPdfFile] = React.useState<any>();
  const [progress, setProgress] = React.useState<number>(0);
  const [urlF, setUrlF] = React.useState<string>("");

  const handleClose = () => {
    setOpen(false);
    onResetData();
  };

  React.useEffect(() => {
    return productStore.onResetUrl();
  }, []);

  React.useEffect(() => {
    categoryStore.getCates();
    listCateStore.getListCates();
  }, []);

  React.useEffect(() => {
    if (isEdit && data) {
      handleGetDataWhenEdit(data);
    }
  }, [isEdit, data]);

  React.useEffect(() => {
    setUrlF(productStore.urlFile);
  }, [productStore.urlFile]);

  const handleGetDataWhenEdit = (value: any) => {
    const cateIdWhenEdit = value.cateId || null;
    setProduct({
      listCateId: value?.listCateId,
      cateId: value?.cateId,
      price: value?.price,
      image: [value?.image],
      name: value?.name,
      id: value?.id,
      youtubeLink: value?.youtubeLink || "",
      instructFile: value?.instructFile || ""
    });
    if (cateIdWhenEdit) {
      const listCateR: any[] = listCateStore.listCateData.filter(
        (item) => item.cateId === cateIdWhenEdit
      );
      setListCateSelect(listCateStore.listCateData);
    }
  };

  React.useEffect(() => {
    if (!imagePreview) {
      // setPreview(undefined)
      if (isEdit) return;
      setProduct({ ...product, image: [] });
      return;
    }

    const objectUrl: any = imagePreview.map((item: any) => {
      return URL?.createObjectURL(item);
    });
    // setPreview(objectUrl);
    setProduct({ ...product, image: objectUrl });

    // // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [imagePreview]);

  const handleChooseImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImagePreview(undefined);
      return;
    }
    let fileImg = [];
    for (let i = 0; i < e.target.files.length; i++) {
      fileImg.push(e.target.files[i]);
    }
    setImagePreview(fileImg);
  };

  const handlePutProduct = (item: IProduct, url: string, urlFile: string) => {
    return {
      name: item.name,
      price: item?.price,
      image: url,
      cateId: item.cateId,
      listCateId: item.listCateId,
      youtubeLink: item?.youtubeLink || "",
      instructFile: urlFile ? urlFile : "",
    };
  };
  // get url file;

  const handleAddProduct = async () => {
    setLoading(true);
    try {
      if (isEdit && data.image === product.image[0]) {
        
        await updateDoc(doc(db, "product", data.id), {
          name: product.name,
          price: product?.price,
          cateId: product.cateId,
          listCateId: product.listCateId,
          youtubeLink: product?.youtubeLink || "",
          instructFile: product?.instructFile || ""
        });
        setLoading(false);
      setOpen(false);
        onResetData();
      } else {
        imagePreview.map((image: any) => {
          const storageRef = ref(storage, `Files/${image.name}`);
          const uploadTask = uploadBytesResumable(storageRef, image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (err) => {},
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                const resElse = isEdit
                  ? await updateDoc(
                      doc(db, "product", data.id),
                      handlePutProduct(product, url, urlF)
                    )
                  : await addDoc(
                      collection(db, "product"),
                      handlePutProduct(product, url, urlF)
                    );
                if (resElse) {
                  setLoading(false);
                  setOpen(false);
                  onResetData();
                }
              });
            }
          );
        });
      }
    } catch (error) {
      setLoading(false);
      setOpen(false);
      onResetData();
    } finally {
      
      productStore.getProducts();
    }
  };

  const onCheckForm = () => {
    if (
      !product.name ||
      !product.cateId ||
      !product.image.length ||
      !product.listCateId
    ) {
      return true;
    }
    if (isEdit && _.isEqual(product, data)) {
      return true;
    }
    return false;
  };

  const onResetData = () => {
    setProduct({
      ...product,
      name: "",
      listCateId: "",
      cateId: "",
      youtubeLink: "",
    });
    setImagePreview(null);
    setPdfFile([]);
  };

  const handleRemoveImg = (file: any, index: number) => {
    const fileClone = product.image.filter((item: any) => item !== file);
    // fileClone.slice(index + 1, 1);
    setProduct({ ...product, image: fileClone });
  };

  const handleSelectCategory = (e: SelectChangeEvent) => {
    setProduct({ ...product, cateId: e.target.value });
    const listCateR: any[] = listCateStore.listCateData.filter(
      (item) => item.cateId === e.target.value
    );
    setListCateSelect(listCateR);
  };

  const handleSelectCateInCategory = (e: SelectChangeEvent) => {
    setProduct({ ...product, listCateId: e.target.value });
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
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent className="dialog-content">
          <div className="dg-left-content">
            {product.image?.length ? (
              product.image.map((item: any, index: number) => {
                return (
                  <div className="img-preview">
                    <CancelIcon onClick={() => handleRemoveImg(item, index)} />
                    <img className="" src={item} />
                  </div>
                );
              })
            ) : (
              <div className="text__line">
                <span>Image</span>
                <input
                  type="file"
                  style={{ width: "50%" }}
                  onChange={handleChooseImg}
                  required
                  multiple
                />
              </div>
            )}
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Select Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={product.cateId}
                label="name"
                onChange={handleSelectCategory}
              >
                {categoryStore.categoryData &&
                  categoryStore.categoryData.map((item) => {
                    return <MenuItem value={item.id}>{item.name}</MenuItem>;
                  })}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Select Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="select-list-cate"
                value={product.listCateId}
                label="Select Type"
                onChange={handleSelectCateInCategory}
              >
                {listCateSelect.length
                  ? listCateSelect.map((item) => {
                      return <MenuItem value={item.id}>{item.name}</MenuItem>;
                    })
                  : null}
              </Select>
            </FormControl>
            {
              !product?.instructFile && 
              <div className="text__line">
                <span>File</span>
                <input
                  type="file"
                  style={{ width: "50%" }}
                  onChange={(e: any) => {
                    productStore.getUrlFile(e?.target?.files[0]);
                  }}
                />
            </div>
            }
            
            {productStore.progFile && (
              <LinearProgressWithLabel value={productStore.progFile} />
            )}
          </div>
          <div className="dg-right-content">
            <div>
              <span>Product Name</span> <br></br>
              <TextField
                id="outlined-categoryName"
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                value={product?.name}
              />
            </div>
            <div>
              <span>Price</span> <br></br>
              <TextField
                id="outlined-basic"
                type={"number"}
                onChange={(e) =>
                  setProduct({ ...product, price: +e.target.value })
                }
                value={product?.price}
              />
            </div>
            <div>
              <span>Video Link</span> <br></br>
              <TextField
                id="outlined-basic"
                type={"text"}
                onChange={(e) =>
                  setProduct({ ...product, youtubeLink: e.target.value })
                }
                value={product?.youtubeLink}
              />
            </div>
            {product.youtubeLink && (
              <iframe
                width={220}
                height={220}
                src={product.youtubeLink}
              ></iframe>
            )}
          </div>
        </DialogContent>
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddProduct} disabled={onCheckForm()}>
              Save
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default observer(ProductDialog);
