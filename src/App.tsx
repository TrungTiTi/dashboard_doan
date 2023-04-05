import React from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout/Layout';
import { Route, Router, Routes } from 'react-router-dom';
import AddEditCategory from './pages/AddEditCategory/AddEditCategory';
import AddEditProduct from './pages/AddEditProduct/AddEditProduct';
import AddEditListCate from './pages/AddEditListCate/AddEditListCate';
import SignIn from './pages/SignInAndSignUp/SignIn';
import SignUp from './pages/SignInAndSignUp/SignUp';
import PrivateRoute from './routes/PrivateRoute';
import UserTable from './pages/User/User';
import OrderTable from './commons/TableData/OrderTable';
import OrderManagement from './pages/OrderManagement/OrderManagement';


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
      <Route path='/sign-up' element={<SignUp />}>
      </Route>
      <Route 
        path='/type' 
        element={
          <PrivateRoute>
            <Element Children={<AddEditCategory />} className={"nav-cate"}/>
          </PrivateRoute>
        }
      />
      <Route path='/product' element={
        <PrivateRoute>
          <Element Children={<AddEditProduct />} className={"nav-product"} />
        </PrivateRoute>
      } />
      <Route path='/list-cate' element={
        <PrivateRoute>
          <Element Children={<AddEditListCate />} className={"nav-list-cate"} />
        </PrivateRoute>
      }

      />
      <Route path='/user' element={
        <PrivateRoute>
          <Element Children={<UserTable />} className={"nav-user"} />
        </PrivateRoute>
      } />
      <Route path='/order' element={
        <PrivateRoute>
          <Element Children={<OrderManagement />} className={"nav-order"} />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
