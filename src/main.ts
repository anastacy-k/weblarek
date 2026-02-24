import './scss/styles.scss';
import { Catalog } from './components/base/models/Catalog';
import { Communication } from './components/base/Communication';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data'; // оставляем для сравнения

const testModel = new Catalog();
testModel.setItems(apiProducts.items);
console.log(`Массив товаров из каталога (тестовые данные): `, testModel.getItems());
console.log(`Количество товаров: ${testModel.getItems().length}`);

const baseApi = new Api(API_URL);
const communication = new Communication(baseApi);
const productsModel = new Catalog();

async function loadProductsFromServer() {
    try {
        const products = await communication.getProductList();
        
        productsModel.setItems(products);
        
        console.log('Товары в модели:', productsModel.getItems());
        console.log(`Количество: ${productsModel.getItems().length}`);
    } catch (error) {
        console.error('Ошибка при загрузке товаров с сервера:', error);
    }
}

loadProductsFromServer();