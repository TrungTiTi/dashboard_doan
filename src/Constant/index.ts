export enum TYPE_TABLE {
    CATEGORY = 'category',
    PRODUCT = 'product',
    LISTCATE = 'listCate',
    ORDER_MANAGEMENT = 'orderManagement'
}

export enum TEXT_ERROR {
    EXISTED = 'Name is existed'
}

export enum NAV_CLASS_NAME {
    CATEGORY = 'nav-cate',
    PRODUCT = 'nav-product',
    LISTCATE= 'nav-list-cate',
    USER = 'user',
    ORDER = 'order'
}

export interface ILayout {
    className: string;
}

export type FormValues= {
    firstName?: string,
    lastName?: string,
    email: string,
    password: string,
}