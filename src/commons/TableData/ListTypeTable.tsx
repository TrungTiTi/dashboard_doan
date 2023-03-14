import { Checkbox, TableCell, TableRow } from '@mui/material';
import * as React from 'react';

interface ICategory {
    row: any;
    handleClick: (e: any, id: string) => void;
    isItemSelected: any;
    labelId: string;
    handleShowEditDialog: (e: any) => void;
}
const ListTypeTable = (props: ICategory) => {
    const {
        row,
        handleClick = () => {},
        isItemSelected,
        labelId,
        handleShowEditDialog = () => {}
    } = props;
    return (
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
            onClick={() => handleShowEditDialog(row)}
            >
            {row.name}
            </TableCell>
            <TableCell align="right">{row.title}</TableCell>
            <TableCell align="right">{row.id}</TableCell>
        </TableRow>
    )
}

export default ListTypeTable;