import {
    IApi,
    IProduct,
    IOrder,
    IOrderResult,
    IProductsResponse
} from '../../types';

export class Communication {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProductList(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<IProductsResponse>('/product/');
            return response.items;
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            throw error;
        }
    }

    async postOrder(orderData: IOrder): Promise<IOrderResult> {
        try {
            const response = await this.api.post<IOrderResult>('/order/', orderData);
            return response;
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw error;
        }
    }
}
