import { Button, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TYPE_TABLE } from '../../Constant';
import DialogModel from '../../commons/Dialog/Dialog';
import TableData from '../../commons/TableData/TableData';
import { useCategoryStore } from '../../stores/Category';
import './AddEditCategory.css';
import { useUserStore } from '../../stores/UserStore';
import { cloneDeep } from 'lodash';

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
  const userStore = useUserStore();

  React.useEffect(() => {
    userStore.getListUser();
  }, [])

  React.useEffect(() => {
    categoryStore.getCates();
  }, [openDialog]);

  React.useEffect(() => {
    setCategoryData(categoryStore.categoryData);
    
  }, [categoryStore.categoryData, openDialog]);

  const handleSearch = (e: any) => {
    const searchValue = e.target?.value || '';
    const dataClone = cloneDeep(categoryStore.categoryData);
    const currentData = dataClone.length ? dataClone.filter((item) => {
      console.log('item', searchValue.toLowerCase(), item.name.toLowerCase());
      return item.name.toLowerCase().includes(searchValue.toLowerCase())
    }) : [];

    console.log('5555', dataClone.filter((item) => {
      return item.name.toLowerCase().includes(searchValue.toLowerCase())
    }))

    setCategoryData(currentData);
  };

  console.log('categoryData', categoryData);
  

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

export default observer(AddEditCategory);