import './scss/styles.scss';
import { IBuyer } from './types';
import { Api } from './components/base/Api';
import { 
    API_URL,
    cardCatalogTemplate,
    CDN_URL
} from './utils/constants';
import { apiProducts } from './utils/data';
import { 
    ensureElement,
    cloneTemplate
} from './utils/utils';
import { Catalog } from './components/base/models/Catalog';
import { Basket } from './components/base/models/Basket';
import { Buyer } from './components/base/models/Buyer';
import { Communication } from './components/base/Communication';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/card/CardCatalog';

const testCatalogModel = new Catalog();
console.log('--- Каталог товаров ---')
testCatalogModel.setItems(apiProducts.items);
console.log(`Массив товаров из каталога (тестовые данные): `, testCatalogModel.getItems());
console.log(`Количество товаров: ${testCatalogModel.getItems().length}`)
console.log('Товар найденный по id:', testCatalogModel.getItemById(testCatalogModel.getItems()[0].id))
testCatalogModel.setSelectedItem(apiProducts.items[1])
console.log('Товар, выбранный для подробного отображения: ', testCatalogModel.getSelectedItem())

const testBasketModel = new Basket();
console.log('--- Корзина товаров ---')
testBasketModel.addItem(apiProducts.items[2])
testBasketModel.addItem(apiProducts.items[3])
console.log(`Количество товаров добавленных в корзину: ${testBasketModel.getCount()}`)
console.log('Массив товаров в корзине: ', testBasketModel.getItems())
console.log(`Общая стоимость товаров в корзине: ${testBasketModel.getTotal()}`)
console.log('Наличие товара в корзине по идентификатору: ', testBasketModel.hasItem(apiProducts.items[1].id))
testBasketModel.removeItem(testBasketModel.getItems()[0])
console.log(`Количество товаров в корзине после удаления одного товара: ${testBasketModel.getCount()}`)
testBasketModel.clear()
console.log('Массив товаров после полного очищения корзины: ', testBasketModel.getItems())

const testBuyerModel = new Buyer();
console.log('--- Данные покупателя ---')
const fullData: Partial<IBuyer> = {
    payment: 'card',
    email: 'test@example.com',
    phone: '+71234567890',
    address: 'ул. Ленина, д. 10'
}
testBuyerModel.setData(fullData)
console.log('Получение данных после их установления: ', testBuyerModel.getData())
console.log('Валидация данных после их установления: ', testBuyerModel.validate())
testBuyerModel.clear()
console.log('Попытка получить данные покупателя после их очистки: ', testBuyerModel.getData())
console.log('Валидация данных после их очистки: ', testBuyerModel.validate())


const baseApi = new Api(API_URL);
const communication = new Communication(baseApi);
const events = new EventEmitter();
const productsModel = new Catalog();
const galleryElement = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(galleryElement);

function getItemCards() {
  return productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return card.render({
        ...item,
        image: `${CDN_URL}${item.image}`,
      });
  });
}

async function loadProductsFromServer() {
  try {
    const products = await communication.getProductList();
    productsModel.setItems(products);
    gallery.render({ catalog: getItemCards() });
  } catch (error) {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  }
}

loadProductsFromServer();

// async function loadProductsFromServer() {
//     try {
//         const products = await communication.getProductList();
        
//         productsModel.setItems(products);

//         console.log('Товары в модели:', productsModel.getItems());
//         console.log(`Количество: ${productsModel.getItems().length}`);
//     } catch (error) {
//         console.error('Ошибка при загрузке товаров с сервера:', error);
//     }
// }

// communication
//     .getProductList()
//     .then((data) => {
//         productsModel.setItems(data.item)
//     })
//     .catch((err) => {console.error(err)})
