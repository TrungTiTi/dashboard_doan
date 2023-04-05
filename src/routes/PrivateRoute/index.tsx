import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Navigate, Route, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/UserStore";
import { getDatabase, ref, onValue} from "firebase/database";
import _ from "lodash";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";

const PrivateRoute: React.FC <{children: any}> = ({ children}) => {

  const userStore = useUserStore();
  const user = localStorage.getItem("user") || '';
  const userStorage = user ? JSON.parse(user || '') : '';
  const [userRealtime, setUsetRealTime] = React.useState<any>({});
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (userStorage?.uid) {
      userStore.getUser(userStorage?.uid);
      const db = getDatabase();
      const starCountRef = ref(db, 'users/' + userStorage.uid);
      onValue(starCountRef, (snapshot) => {
        setUsetRealTime({});
        const data = snapshot.val();
        if (data !== null) {
          if (userStore.currentUser) {
            handleReload(userStore.currentUser.isPermission, data.isPermission);
          }
          setUsetRealTime(data);
        }
      });

    }
  }, []);
console.log(656565);

  const handleReload = (oldPermission: boolean, newPermission: boolean) => {
    if(oldPermission !== newPermission) {
      console.log('1599', oldPermission, newPermission, userStorage, userStore.currentUser);
      
      setOpen(true);
    }
  }

  const handleClose = () => {
    // if (userStorage?.uid) {
    //   userStore.getUser(userStorage.uid);
    // }
    localStorage.clear();
    setOpen(false);
    navigate('/');
  }

  React.useEffect(() => {
    userStore.test = userRealtime;
  }, [userRealtime])
  //  const user = userStore.currentUser;
  return user ? 
  <>
  {children}
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  </>
   : <Navigate to="/" />
};

export default observer(PrivateRoute);