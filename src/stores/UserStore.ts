import React from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import { db, auth } from "../firebase";
import {
    collection,
    getDocs,
    addDoc,
    doc,
    onSnapshot,
    setDoc,
  } from "firebase/firestore";

export class UserStore {
    loading = true;
    userListData: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    getListUser = async () => {
        try {
            this.loading = false;
            const data = await getDocs(collection(db, "user"));
            const userList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            this.userListData = userList;
            this.loading = true;
        } catch (error) {
            
        }
    };
    
}

export const userStore = new UserStore();
export const storeContext = React.createContext(userStore);
export const useUserStore = () => React.useContext(storeContext);