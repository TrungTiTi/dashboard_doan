import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TYPE_TABLE } from '../../Constant';
import DialogModel from '../../commons/Dialog/Dialog';
import ProductDialog from '../../commons/ProductDialog/ProductDialog';
import TableData from '../../commons/TableData/TableData';
import { useProductStore } from '../../stores/Product';
import { useUserStore } from '../../stores/UserStore';
import { useOrderStore } from '../../stores/OrderStore';

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

const OrderManagement = () => {
    const headCells: any[] = [
        {
          id: 'ownName',
          numeric: false,
          disablePadding: true,
          label: 'ownName',
        },
        {
          id: 'address',
          numeric: true,
          disablePadding: false,
          label: 'Address',
        },
        {
          id: 'price',
          numeric: true,
          disablePadding: false,
          label: 'Price',
        },
        {
          id: 'email',
          numeric: true,
          disablePadding: false,
          label: 'Email',
        },
        {
          id: 'licensePlate',
          numeric: true,
          disablePadding: false,
          label: 'License Plate',
        },
        {
          id: 'type',
          numeric: true,
          disablePadding: false,
          label: 'Type',
        },
      ]      
  
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const orderStore= useOrderStore();
  const [order, setOrder] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const userStore = useUserStore();

  React.useEffect(() => {
    orderStore.getOrders();
  }, [openDialog, loading]);

  React.useEffect(() => {
    setOrder(orderStore.orderData);
  }, [orderStore.orderData]);

  return (
    <div className='table-dashboard'>
      <div className='table-db-container'>
        <TableData
          rows={order || []}
          headCells={headCells}
          setIsEdit={setIsEdit}
          typeTable={TYPE_TABLE.ORDER_MANAGEMENT}
        >
        </TableData>
      </div>
      
    </div>
  );
}

export default observer(OrderManagement);