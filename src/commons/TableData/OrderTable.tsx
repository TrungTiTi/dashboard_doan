import { Checkbox, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import ProductDialog from '../ProductDialog/ProductDialog';
import { useUserStore } from '../../stores/UserStore';
import OrderDialog from '../Dialog/OrderDialog';

interface ICategory {
    row: any;
    handleClick: (e: any, id: string) => void;
    isItemSelected: any;
    labelId: string;
    setLoading?: (e: boolean) => void;
}
const OrderTable = (props: ICategory) => {
    const {
        row,
        handleClick = () => {},
        isItemSelected,
        labelId,
        setLoading = () => {}
    } = props;

    const [openEditDialog, setOpenEditDialog] = React.useState<boolean>(false);
    const userStore = useUserStore();

    const handleShowEditDialog = () => {
        if (userStore.currentUser?.isPermission) {
            setOpenEditDialog(true);
        }
    };

    const handleClickRow = (event: any) => {
        if (userStore.currentUser?.isPermission) {
            handleClick(event, row.id)
        }
    }
    console.log(222, row);
    
    return (
        <>
            <TableRow
                hover
                onClick={(event) => handleClickRow(event)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                selected={isItemSelected}
            >
                <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                    'aria-labelledby': labelId,
                    }}
                />
                </TableCell>
                <TableCell
                component="th"
                id={labelId}
                scope="row"
                padding="none"
                onClick={() => handleShowEditDialog()}
                >
                {row?.ownName}
                </TableCell>
                <TableCell align="right">{row?.price}</TableCell>
                <TableCell align="right">{row?.address}</TableCell>
                <TableCell align="right">{row?.email}</TableCell>
                <TableCell align="right">
                    {row?.licensePlate}
                </TableCell>
                <TableCell align="right">
                    {row?.type}
                </TableCell>
                <TableCell align="right">
                    {row?.status}
                </TableCell>
            </TableRow>
            <OrderDialog 
                open={openEditDialog}
                setOpen={setOpenEditDialog}
                isEdit={true}
                data={row}
                setLoading={setLoading}
            >
            </OrderDialog>
        </>
    )
}

export default OrderTable;