import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TYPE_TABLE } from '../../commons/Constant';
import DialogModel from '../../commons/Dialog/Dialog';
import TableData from '../../commons/TableData/TableData';
import { useCategoryStore } from '../../stores/Category';
import './AddEditCategory.css';

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

const AddEditCategory = () => {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [categoryData, setCategoryData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
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

  const categoryStore= useCategoryStore();

  React.useEffect(() => {
    categoryStore.getCates();
  }, [openDialog]);

  React.useEffect(() => {
    setCategoryData(categoryStore.categoryData);
  }, [categoryStore.categoryData]);

  return (
    <div className='table-dashboard'>
      <Button onClick={() => setOpenDialog(true)}>Add</Button>
      <div className='table-db-container'>
        <TableData
          rows={categoryData || []}
          headCells={headCells}
          setIsEdit={setIsEdit}
          typeTable={TYPE_TABLE.CATEGORY}
        >
        </TableData>
      </div>
      <DialogModel
        open={openDialog}
        setOpen={setOpenDialog}
        setLoading={setLoading}
        loading={loading}
        isEdit={isEdit}
      >
      </DialogModel>
    </div>
  );
}

export default AddEditCategory;