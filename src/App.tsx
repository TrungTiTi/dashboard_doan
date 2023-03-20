import React from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout/Layout';
import { Route, Router, Routes } from 'react-router-dom';
import AddEditCategory from './pages/AddEditCategory/AddEditCategory';
import AddEditProduct from './pages/AddEditProduct/AddEditProduct';
import AddEditListCate from './pages/AddEditListCate/AddEditListCate';


const Element = ({Children}: any) => {
  return (
    <div className='dashboard'>
      <Layout />
      <div className='container'>
        {Children}
      </div>
    </div>
    
  )
}

const Test = () => {
  return (
    <div>
      Input
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path='' element={<Element Children={<Test />}/>}>
      </Route>
      <Route path='/type' element={<Element Children={<AddEditCategory />} />} />
      <Route path='/product' element={<Element Children={<AddEditProduct />} />} />
      <Route path='/list-cate' element={<Element Children={<AddEditListCate />} />} />
    </Routes>
  );
}

export default App;
