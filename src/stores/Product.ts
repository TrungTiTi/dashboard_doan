import React from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { db, auth, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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
  urlFile: string = "";
  progFile: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  getProducts = async () => {
    try {
      this.loading = false;
      const data = await getDocs(collection(db, "product"));
      const productList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      this.productData = productList;
      this.loading = true;
    } catch (error) {}
  };

  getUrlFile = async (file: any) => {
    const storageRef = ref(storage, `Folder/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.progFile = prog;
      },
      (err) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          this.urlFile = url;
        });
      }
    );
  };

  onResetUrl = () => {
    this.urlFile = "";
  };

  onResetProgress = () => {
    this.progFile = 0;
  }
}

export const productStore = new ProductStore();
export const storeContext = React.createContext(productStore);
export const useProductStore = () => React.useContext(storeContext);
