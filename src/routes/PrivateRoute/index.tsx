import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
import { useUserStore } from "../../stores/UserStore";

const PrivateRoute: React.FC <{children: any}> = ({ children}) => {

    const userStore = useUserStore();
    const user = localStorage.getItem("user");
  //  const user = userStore.currentUser;
  return user ? children : <Navigate to="/" />
};

export default observer(PrivateRoute);