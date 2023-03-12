import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TYPE_TABLE } from '../../commons/Constant';
import DialogModel from '../../commons/Dialog/Dialog';
import ProductDialog from '../../commons/ProductDialog/ProductDialog';
import TableData from '../../commons/TableData/TableData';
import { useProductStore } from '../../stores/Product';

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

const AddEditProduct = () => {
    const headCells: any[] = [
        {
          id: 'name',
          numeric: false,
          disablePadding: true,
          label: 'Name',
        },
        {
          id: 'title',
          numeric: true,
          disablePadding: false,
          label: 'Title',
        },
        {
          id: 'image',
          numeric: true,
          disablePadding: false,
          label: 'Image',
        },
        {
          id: 'id',
          numeric: true,
          disablePadding: false,
          label: 'Id',
        },
      ]      
  
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const productStore= useProductStore();
  const [productData, setProductData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);

  React.useEffect(() => {
    productStore.getProducts();
  }, [openDialog]);

  React.useEffect(() => {
    setProductData(productStore.productData);
  }, [productStore.productData]);

  console.log('productData', productData)

  return (
    <div className='table-dashboard'>
      <Button onClick={() => setOpenDialog(true)}>Add</Button>
      <div className='table-db-container'>
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

export default AddEditProduct;