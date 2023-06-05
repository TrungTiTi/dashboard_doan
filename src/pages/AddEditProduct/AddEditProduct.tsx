import { Button, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TYPE_TABLE } from '../../Constant';
import DialogModel from '../../commons/Dialog/Dialog';
import ProductDialog from '../../commons/ProductDialog/ProductDialog';
import TableData from '../../commons/TableData/TableData';
import { useProductStore } from '../../stores/Product';
import { useUserStore } from '../../stores/UserStore';

interface Data {
  name: string,
  title: string,
  image: string,
  id: string,
}

function createData(
  name: string,
  title: string,
  image: string,
  id: string,
): Data {
  return {
    name,
    title,
    image,
    id,
  };
}

const headCells: any[] = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'image',
      numeric: true,
      disablePadding: false,
      label: 'Image',
    },
    {
      id: 'price',
      numeric: true,
      disablePadding: false,
      label: 'Price',
    },
    {
      id: 'cateId',
      numeric: true,
      disablePadding: false,
      label: 'Cate Id',
    },
    {
      id: 'listCateId',
      numeric: true,
      disablePadding: false,
      label: 'List Cate Id',
    },
    {
      id: 'youtube',
      numeric: true,
      disablePadding: false,
      label: 'Youtube Link',
    },
    {
      id: 'instructFile',
      numeric: true,
      disablePadding: false,
      label: 'File Link',
    },
  ];

const AddEditProduct = () => {
  
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const productStore= useProductStore();
  const [productData, setProductData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const userStore = useUserStore();

  React.useEffect(() => {
    productStore.getProducts();
  }, [openDialog, loading]);

  React.useEffect(() => {
    setProductData(productStore.productData);
  }, [productStore.productData]);

  const handleSearch = (e: any) => {
    const searchValue = e.target?.value || '';
  
    const currentData = productStore.productData.length ? productStore.productData.filter((item) => item.name.toUpperCase().includes(searchValue.toUpperCase())) : [];

    setProductData(currentData);
  };

  return (
    <div className='table-dashboard'>
      <div className='table-db-container'>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={() => setOpenDialog(true)} disabled={!userStore.currentUser?.isPermission}>Add</Button>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <label>Search</label>
            <TextField placeholder='Search name' onChange={(e) => handleSearch(e)}></TextField>
          </div>
        </div>
        <TableData
          rows={productData || []}
          headCells={headCells}
          setIsEdit={setIsEdit}
          typeTable={TYPE_TABLE.PRODUCT}
        >
        </TableData>
      </div>
      <ProductDialog
        open={openDialog}
        setOpen={setOpenDialog}
        setLoading={setLoading}
        loading={loading}
        isEdit={isEdit}
      >
      </ProductDialog>
    </div>
  );
}

export default observer(AddEditProduct);