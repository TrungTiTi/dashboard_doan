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
    getDoc,
  } from "firebase/firestore";

export class UserStore {
    loading = true;
    userListData: any[] = [];
    currentUser: any = {};
    constructor() {
        makeAutoObservable(this);
    }

    getListUser = async () => {
        try {
            this.loading = false;
            const data = await getDocs(collection(db, "users"));
            const userList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            const userFound = userList.filter((item) => item.id !== this.currentUser?.uid);
            this.userListData = userFound;
            this.loading = true;
        } catch (error) {
            
        }
    };

    getUser = async (id: string) => {
        try {
            const data = await getDoc(doc(db, 'users', id));
            if(data.exists()){
                this.currentUser = {...data.data(), uid: id};
                console.log('currentUser', this.currentUser)
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}

export const userStore = new UserStore();
export const storeContext = React.createContext(userStore);
export const useUserStore = () => React.useContext(storeContext);