import {
    IApi,
    IProduct,
    IOrder,
    IOrderResult,
    IProductsResponse
} from '../../types';

export class Communication {
    _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    async getProductList(): Promise<IProduct[]> {
        try {
            const response = await this._api.get<IProductsResponse>('/product/');
            return response.items;
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            throw error;
        }
    }

    async postOrder(orderData: IOrder): Promise<IOrderResult> {
        try {
            const response = await this._api.post<IOrderResult>('/order/', orderData);
            return response;
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw error;
        }
    }
}
