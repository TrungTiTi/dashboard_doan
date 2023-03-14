import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TYPE_TABLE } from '../../commons/Constant';
import ListCateDialog from '../../commons/Dialog/ListCateDialog/ListCateDialog';
import TableData from '../../commons/TableData/TableData';
import { useListCateStore } from '../../stores/ListCateStore';
import './AddEditListCate.css';

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
      id: 'title',
      numeric: true,
      disablePadding: false,
      label: 'Title',
    },
    {
      id: 'id',
      numeric: true,
      disablePadding: false,
      label: 'Id',
    },
  ]      

  const listCateStore= useListCateStore();

  React.useEffect(() => {
    listCateStore.getListCates();
  }, [listCateStore.listCateData.length]);

  React.useEffect(() => {
    setListCate(listCateStore.listCateData);
  }, [listCateStore.listCateData]);
console.log('55555', listCateStore.listCateData)
  return (
    <div className='table-dashboard'>
      <Button onClick={() => setOpenDialog(true)}>Add</Button>
      <div className='table-db-container'>
        <TableData
          rows={listCateStore.listCateData || []}
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