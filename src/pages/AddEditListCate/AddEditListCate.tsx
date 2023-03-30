import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TYPE_TABLE } from '../../Constant';
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
      id: 'cateId',
      numeric: true,
      disablePadding: false,
      label: 'Cate Id',
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

  React.useEffect(() => {
    listCateStore.getListCates();
  }, [listCateStore.listCateData.length]);

  React.useEffect(() => {
    setListCate(listCateStore.listCateData);
  }, [listCateStore.listCateData]);

  return (
    <div className='table-dashboard'>
      <div className='table-db-container'>
      <Button onClick={() => setOpenDialog(true)}>Add</Button>
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