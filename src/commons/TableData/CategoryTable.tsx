import { Checkbox, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import DialogModel from '../Dialog/Dialog';

interface ICategory {
    row: any;
    handleClick: (e: any, id: string) => void;
    isItemSelected: any;
    labelId: string;
    setLoading?: (e: boolean) => void;
}
const CategoryTable = (props: ICategory) => {
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
                <TableCell align="right">{row.title}</TableCell>
                {
                row?.image &&
                <TableCell align="right">
                    <img style={{width: 50, height: 50}} src={row.image} />
                </TableCell>
                }
                <TableCell align="right">{row.id}</TableCell>
            </TableRow>
            <DialogModel
                open={openEditDialog}
                setOpen={setOpenEditDialog}
                isEdit={true}
                data={row}
                setLoading={setLoading}
            >
            </DialogModel>
        </>
    )
}

export default CategoryTable;