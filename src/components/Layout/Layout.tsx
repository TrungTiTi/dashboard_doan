import Button from '@mui/material/Button';
import React, {useState} from 'react';
import './Layout.css';
import AllInboxIcon from '@mui/icons-material/AllInbox';

const Layout: React.FC = () => {
    return (
        <div className='layout'>
            <div className='layout-title'>
                <div className='layout-title-header'>
                    <img />
                    <h3>BERRY</h3>
                </div>
                <div className='dashboard-content'>
                    <a href='/type' className='a-content'>
                        <AllInboxIcon />
                        <span>
                            Category
                        </span>
                    </a>
                </div>
                <div className='dashboard-content'>
                    <a href='/product' className='a-content'>
                        <AllInboxIcon />
                        <span>
                            Product
                        </span>
                    </a>
                </div>
                <div className='dashboard-content'>
                    <a href='/list-cate' className='a-content'>
                        <AllInboxIcon />
                        <span>
                            List Category
                        </span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Layout;