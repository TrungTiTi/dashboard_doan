import { Checkbox, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import ProductDialog from '../ProductDialog/ProductDialog';
import { useUserStore } from '../../stores/UserStore';

interface ICategory {
    row: any;
    handleClick: (e: any, id: string) => void;
    isItemSelected: any;
    labelId: string;
    setLoading?: (e: boolean) => void;
}
const ProductTable = (props: ICategory) => {
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
                {row?.name}
                </TableCell>
                {/* <TableCell align="right">{row?.title}</TableCell> */}
                {
                row?.imageContent &&
                <TableCell align="right">
                    <img style={{width: 50, height: 50}} src={row?.imageContent} />
                </TableCell>
                }
                {
                    row?.image &&
                    <TableCell align="right">
                         <img style={{width: 50, height: 50}} src={row.image} />
                    </TableCell>
                }
                {/* <TableCell align="right">{row?.title}</TableCell> */}
                <TableCell align="right">{row?.price}</TableCell>
                <TableCell align="right">{row?.cateId}</TableCell>
                <TableCell align="right">{row?.listCateId}</TableCell>
                <TableCell align="right">
                    {
                        row?.youtubeLink &&
                        <iframe width={200} height={100} src={row?.youtubeLink}></iframe>
                    }
                </TableCell>
            </TableRow>
            <ProductDialog
                open={openEditDialog}
                setOpen={setOpenEditDialog}
                isEdit={openEditDialog}
                data={row}
                setLoading={setLoading}
            >

            </ProductDialog>
        </>
    )
}

export default ProductTable;