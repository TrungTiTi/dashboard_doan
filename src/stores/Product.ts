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

export class ProductStore {
    loading = true;
    productData: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    getProducts = async () => {
        try {
            this.loading = false;
            const data = await getDocs(collection(db, "product"));
            const productList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            this.productData = productList;
            this.loading = true;
        } catch (error) {
            
        }
    };
    
}

export const productStore = new ProductStore();
export const storeContext = React.createContext(productStore);
export const useProductStore = () => React.useContext(storeContext);