import './scss/styles.scss';
import { IBuyer, IOrder, IProduct, TPayment, ValidationErrors } from './types';
import { Api } from './components/base/Api';
import { 
    API_URL,
    CDN_URL,
    basketTemplate,
    cardBasketTemplate,
    cardCatalogTemplate,
    cardPreviewTemplate,
    contactsTemplate,
    orderTemplate,
    successTemplate
} from './utils/constants';
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
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { CardPreview } from './components/views/card/CardPreview';
import { BasketView } from './components/views/BasketView';
import { CardBasket } from './components/views/card/CardBasket';
import { FormOrder } from './components/views/form/FormOrder';
import { FormContacts } from './components/views/form/FormContacts';
import { Success } from './components/views/Success';

const baseApi = new Api(API_URL);
const communication = new Communication(baseApi);
const events = new EventEmitter();
const productsModel = new Catalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const galleryElement = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(galleryElement);
const modalElement = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalElement, events);
const orderForm = new FormOrder(cloneTemplate(orderTemplate), events);
const contactsForm = new FormContacts(cloneTemplate(contactsTemplate), events);

header.render({ counter: 0 });

function buildCatalogCards(): HTMLElement[] {
  return productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: events.trigger('card:select', { id: item.id }),
    });

    return card.render({
      ...item,
      image: `${CDN_URL}${item.image}`,
    });
  });
}

function buildBasketCards(): HTMLElement[] {
  return basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: events.trigger('basket:item-delete', { id: item.id }),
    });

    return card.render({
      index: index + 1,
      title: item.title,
      price: item.price ?? 0,
    });
  });
}

function getOrderErrors(errors: ValidationErrors): string {
  return [errors.payment, errors.address].filter(Boolean).join('; ');
}

function getContactsErrors(errors: ValidationErrors): string {
  return [errors.email, errors.phone].filter(Boolean).join('; ');
}

function renderCatalog(): void {
  gallery.render({ catalog: buildCatalogCards() });
}

function openPreviewModal(item: IProduct): void {
  const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: events.trigger('preview:toggle-basket', { id: item.id }),
  });

  const inBasket = basketModel.hasItem(item.id);
  const buttonText = item.price === null
    ? 'Недоступно'
    : (inBasket ? 'Удалить из корзины' : 'Купить');

  modal.render({
    content: preview.render({
      ...item,
      image: `${CDN_URL}${item.image}`,
      buttonText,
    }),
  });
}

function openBasketModal(): void {
  const basketView = new BasketView(cloneTemplate(basketTemplate), {
    onClick: events.trigger('order:open'),
  });

  modal.render({
    content: basketView.render({
      items: buildBasketCards(),
      total: basketModel.getTotal(),
      selected: basketModel.getItems().map((item) => item.id),
    }),
  });
}

function buildOrderFormContent(): HTMLElement {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
  const hasOrderInput = Boolean(buyerData.payment || buyerData.address.trim());

  return orderForm.render({
    payment: buyerData.payment,
    address: buyerData.address,
    valid: !errors.payment && !errors.address,
    errors: hasOrderInput ? getOrderErrors(errors) : '',
  });
}

function buildContactsFormContent(): HTMLElement {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
  const hasContactsInput = Boolean(buyerData.email.trim() || buyerData.phone.trim());

  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = hasContactsInput ? getContactsErrors(errors) : '';

  return contactsForm.render();
}

function openOrderModal(): void {
  modal.render({ content: buildOrderFormContent() });
}

function openContactsModal(): void {
  modal.render({ content: buildContactsFormContent() });
}

function openSuccessModal(total: number): void {
  const success = new Success(cloneTemplate(successTemplate), {
    onClick: events.trigger('success:close'),
  });

  modal.render({
    content: success.render({ total }),
  });
}

events.on<{ items: IProduct[] }>('catalog:changed', () => {
  renderCatalog();
});

events.on<{ item: IProduct | null }>('catalog:selected', ({ item }) => {
  if (item) {
    openPreviewModal(item);
  }
});

events.on<{ items: IProduct[] }>('basket:changed', () => {
  header.counter = basketModel.getCount();

  if (modalElement.classList.contains('modal_active') && Boolean(modalElement.querySelector('.basket'))) {
    openBasketModal();
  }
});

events.on<IBuyer>('buyer:changed', () => {
  buildOrderFormContent();
  buildContactsFormContent();
});

events.on<{ id: string }>('card:select', ({ id }) => {
  productsModel.setSelectedItem(productsModel.getItemById(id) ?? null);
});

events.on<{ id: string }>('basket:item-add', ({ id }) => {
  const item = productsModel.getItemById(id);
  if (item) {
    basketModel.addItem(item);
  }
});

events.on<{ id: string }>('preview:toggle-basket', ({ id }) => {
  const item = productsModel.getItemById(id);
  if (!item || item.price === null) {
    return;
  }

  if (basketModel.hasItem(id)) {
    basketModel.removeItem(item);
  } else {
    basketModel.addItem(item);
  }
  openPreviewModal(item);
});

events.on<{ id: string }>('basket:item-delete', ({ id }) => {
  const item = basketModel.getItems().find((basketItem) => basketItem.id === id);
  if (item) {
    basketModel.removeItem(item);
  }
});

events.on<object>('basket:open', () => {
  openBasketModal();
});

events.on<object>('order:open', () => {
  openOrderModal();
});

events.on<{ payment: TPayment }>('order:payment', ({ payment }) => {
  buyerModel.setData({ payment });
});

events.on<{ address: string }>('order:change', ({ address }) => {
  buyerModel.setData({ address });
});

events.on<{ payment: TPayment; address: string }>('order:submit', ({ payment, address }) => {
  buyerModel.setData({ payment, address });
  const errors = buyerModel.validate();

  if (!errors.payment && !errors.address) {
    openContactsModal();
  }
});

events.on<{ email?: string; phone?: string }>('contacts:change', ({ email, phone }) => {
  buyerModel.setData({
    ...(email !== undefined ? { email } : {}),
    ...(phone !== undefined ? { phone } : {}),
  });
});

events.on<{ email: string; phone: string }>('contacts:submit', async ({ email, phone }) => {
  buyerModel.setData({ email, phone });
  const errors = buyerModel.validate();

  if (errors.payment || errors.address || errors.email || errors.phone) {
    return;
  }

  const order: IOrder = {
    ...buyerModel.getData(),
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotal(),
  };

  try {
    const result = await communication.postOrder(order);
    openSuccessModal(result.total);
    basketModel.clear();
    buyerModel.clear();
    productsModel.setSelectedItem(null);
  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
  }
});

events.on<object>('success:close', () => {
  modal.close();
});

events.on<object>('modal:open', () => {
  document.body.classList.add('page_locked');
});

events.on<object>('modal:close', () => {
  document.body.classList.remove('page_locked');
  productsModel.setSelectedItem(null);
});

async function loadProductsFromServer() {
  try {
    const products = await communication.getProductList();
    productsModel.setItems(products);
  } catch (error) {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  }
}

loadProductsFromServer();
