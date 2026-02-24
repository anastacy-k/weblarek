import { IProduct } from "../../../types";

export class Basket {
    _items: IProduct[];

    constructor(items?: IProduct[]) {
        this._items = items || [];
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this._items.push(item);
        }
    }

    removeItem(item: IProduct): void {
        this._items = this._items.filter(i => i.id !== item.id);
    }

    clear(): void {
        this._items = [];
    }

    getTotal(): number {
        return this._items.reduce((sum, item) => {
            return sum + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    isEmpty(): boolean {
        return this._items.length === 0;
    }
}