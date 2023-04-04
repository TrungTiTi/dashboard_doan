import Button from '@mui/material/Button';
import React, {useState} from 'react';
import './Layout.css';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import BallotIcon from '@mui/icons-material/Ballot';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ILayout, NAV_CLASS_NAME } from '../../Constant';

const listLayout = [
    {
        link: '/type',
        label: 'Category',
        icon: <CategoryIcon />,
        className: NAV_CLASS_NAME.CATEGORY
    },
    {
        link: '/product',
        label: 'Product',
        icon: <InventoryIcon />,
        className: NAV_CLASS_NAME.PRODUCT
    },
    {
        link: '/list-cate',
        label: 'List Category',
        icon: <BallotIcon />,
        className: NAV_CLASS_NAME.LISTCATE
    },
    {
        link: '/user',
        label: 'User',
        icon: <BallotIcon />,
        className: NAV_CLASS_NAME.USER
    },
];

const Layout: React.FC<ILayout> = (props) => {
    const {className} = props;
    const [nameCurrent, setNameCurrent] = useState<string>();

    const handleSetClassName = (value: string) => {
        if (value === className) {
            return value;
        }
        return '';
    }

    return (
        <div className='layout'>
            <div className='layout-title'>
                <div className='layout-title-header'>
                    <img />
                    <h3>BERRY</h3>
                </div>
                {
                    listLayout.map((item) => {
                        return (
                            <div className={'dashboard-content'}>
                                <a href={item.link} className={`a-content ${handleSetClassName(item.className)}`}>
                                    {item.icon}
                                    <span>
                                        {item.label}
                                    </span>
                                </a>
                            </div>
                        );
                    })
                }
            </div>
            <div className='layout-footer layout-title'>
                <div className={'dashboard-content'}>
                    <a href='/' className='a-content'>
                        <SystemUpdateAltIcon />
                        <span>LOG OUT</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Layout;