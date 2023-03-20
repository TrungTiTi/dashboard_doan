import { Checkbox, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import ListCateDialog from '../Dialog/ListCateDialog/ListCateDialog';

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

    const handleShowEditDialog = () => {
        setOpenEditDialog(true);
    };

    return (
        <>
            <TableRow
                hover
                onClick={(event) => handleClick(event, row.id)}
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
                {row.name}
                </TableCell>
                <TableCell align="right">{row.cateId}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.condition}</TableCell>
                <TableCell align="right">{row.case}</TableCell>
                <TableCell align="right">{row.paymentMethod}</TableCell>
                <TableCell align="right">{row.detailTitle}</TableCell>
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