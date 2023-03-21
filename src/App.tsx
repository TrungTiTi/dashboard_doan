import React from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout/Layout';
import { Route, Router, Routes } from 'react-router-dom';
import AddEditCategory from './pages/AddEditCategory/AddEditCategory';
import AddEditProduct from './pages/AddEditProduct/AddEditProduct';
import AddEditListCate from './pages/AddEditListCate/AddEditListCate';
import SignIn from './pages/SignInAndSignUp/SignIn';


const Element = ({Children, className}: any) => {
  return (
    <div className='dashboard'>
    
      <Layout className={className} />
      <div className='container'>
        {Children}
      </div>
    </div>
    
  )
}

function App() {
  return (
    <Routes>
      <Route path='' element={<SignIn />}>
      </Route>
      <Route path='/type' element={<Element Children={<AddEditCategory />} className={"nav-cate"}/>} />
      <Route path='/product' element={<Element Children={<AddEditProduct />} className={"nav-product"} />} />
      <Route path='/list-cate' element={<Element Children={<AddEditListCate />} className={"nav-list-cate"} />} />
    </Routes>
  );
}

export default App;
