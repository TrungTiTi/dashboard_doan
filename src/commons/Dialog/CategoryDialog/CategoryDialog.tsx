import DialogContent from "@mui/material/DialogContent/DialogContent"
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from "@mui/material/TextField/TextField";

const CategoryDialog = (props: any) => {

    const {
        category,
        setCategory = () => {},
        handleChooseImg = () => {}
    } = props;

    return (
        <DialogContent className='dialog-content'>
          {/* <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText> */}
          <div className='dg-left-content'>
            {
              category.image ? 
              <div className='img-preview'>
                <CancelIcon onClick={() => setCategory({...category, image: null})}/>
                <img className='' src={category.image} />
              </div> :
              <div className='text__line'>
                  <span>Image</span>
                  <TextField id="outlined-basic" type='file' style={{width: '50%'}} onChange={handleChooseImg} required />
              </div>
            }
          </div>
          <div className='dg-right-content'>
            <span>Category Name</span> <br></br>
            <TextField id="outlined-categoryName" onChange={(e) => setCategory({...category, name: e.target.value})} value={category?.name} />
            <div style={{height: '10px'}}></div>
            <span>Categry Title</span> <br></br>
            <TextField id="outlined-basic" onChange={(e) => setCategory({...category, title: e.target.value})} value={category?.title} />
          </div>
        </DialogContent>
    )
}

export default CategoryDialog;