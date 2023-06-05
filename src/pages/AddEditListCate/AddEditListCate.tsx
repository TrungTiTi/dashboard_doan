import { Button, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TYPE_TABLE } from '../../Constant';
import ListCateDialog from '../../commons/Dialog/ListCateDialog/ListCateDialog';
import TableData from '../../commons/TableData/TableData';
import { useListCateStore } from '../../stores/ListCateStore';
import './AddEditListCate.css';
import { useUserStore } from '../../stores/UserStore';

interface Data {
  name: string,
  title: string,
  id: string,
}

function createData(
  name: string,
  title: string,
  id: string,
): Data {
  return {
    name,
    title,
    id,
  };
}

const AddEditListCate = () => {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [listCate, setListCate] = React.useState<any>([]);
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
      id: 'description',
      numeric: true,
      disablePadding: false,
      label: 'description',
    },
    {
      id: 'condition',
      numeric: true,
      disablePadding: false,
      label: 'condition',
    },
    {
      id: 'case',
      numeric: true,
      disablePadding: false,
      label: 'case',
    },
    {
      id: 'paymentMethod',
      numeric: true,
      disablePadding: false,
      label: 'paymentMethod',
    },
    {
      id: 'detailTitle',
      numeric: true,
      disablePadding: false,
      label: 'detailTitle',
    },
    
  ]      

  const listCateStore= useListCateStore();
  const userStore = useUserStore();

  React.useEffect(() => {
    listCateStore.getListCates();
  }, [listCateStore.listCateData.length]);

  React.useEffect(() => {
    setListCate(listCateStore.listCateData);
  }, [listCateStore.listCateData]);

  const handleSearch = (e: any) => {
    const searchValue = e.target?.value || '';
    const currentData = listCateStore.listCateData.length ? listCateStore.listCateData.filter((item) => item.name.toUpperCase().includes(searchValue.toUpperCase())) : [];

    setListCate(currentData);
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
          rows={listCate || []}
          headCells={headCells}
          setIsEdit={setIsEdit}
          typeTable={TYPE_TABLE.LISTCATE}
        >
        </TableData>
      </div>
      <ListCateDialog
        open={openDialog}
        setOpen={setOpenDialog}
        setLoading={setLoading}
        loading={loading}
        isEdit={isEdit}
      >
      </ListCateDialog>
    </div>
  );
}

export default observer(AddEditListCate);