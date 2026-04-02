import { categoryMap } from "../utils/constants";

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'card' | 'cash' | '';
export type ValidationErrors = {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}
export type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, 'image' | 'category'>

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IFormContacts {
    email: string;
    phone: string;
}

export interface IFormOrder {
    payment: TPayment;
    address: string;
    errors: string;
    valid: boolean;
}

