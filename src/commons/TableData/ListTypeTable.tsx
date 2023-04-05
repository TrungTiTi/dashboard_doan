import { Checkbox, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import ListCateDialog from '../Dialog/ListCateDialog/ListCateDialog';
import { useUserStore } from '../../stores/UserStore';

interface ICategory {
    row: any;
    handleClick: (e: any, id: string) => void;
    isItemSelected: any;
    labelId: string;
    setLoading?: (e: boolean) => void;
}
const ListTypeTable = (props: ICategory) => {
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
                sx={{
                    height: '100px'
                }}
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
                {row.name}
                </TableCell>
                {/* <TableCell align="right" sx={{width: 100}}>{row.cateId}</TableCell> */}
                <TableCell align="right" height='100px'>{row.description}</TableCell>
                <TableCell align="right" height='100px'>{row.condition}</TableCell>
                <TableCell align="right" height='100px'>{row.case}</TableCell>
                <TableCell align="right" height='100px'>{row.paymentMethod}</TableCell>
                <TableCell align="right" height='100px'>{row.detailTitle}</TableCell>
            </TableRow>
            <ListCateDialog
                open={openEditDialog}
                setOpen={setOpenEditDialog}
                isEdit={true}
                data={row}
                setLoading={setLoading}
            >
            </ListCateDialog>
        </>
    )
}

export default ListTypeTable;