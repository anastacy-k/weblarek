import { IProduct } from '../../../types';

export class Catalog {
    _items: IProduct[]
    _selectedItem: IProduct | null;

    constructor(products: IProduct[] = [], selectedProduct: IProduct | null = null) {
        this._items = products || [];
        this._selectedItem = selectedProduct;
    }

    setItems(items: IProduct[]): void {
        this._items = items;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItemById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedItem(product: IProduct): void {
        this._selectedItem = product;
    }

    getSelectedItem(): IProduct | null {
        return this._selectedItem;
    }
}
