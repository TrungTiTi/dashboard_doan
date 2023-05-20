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

export class OrderStore {
    loading = true;
    orderData: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    getOrders = async () => {
        try {
            this.loading = false;
            const data = await getDocs(collection(db, "order"));
            const orderList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            this.orderData = orderList;
            this.loading = true;
        } catch (error) {
            
        }
    };
    
}

export const orderStore = new OrderStore();
export const storeContext = React.createContext(orderStore);
export const useOrderStore = () => React.useContext(storeContext);