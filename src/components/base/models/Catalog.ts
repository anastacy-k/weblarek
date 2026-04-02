import { IProduct } from '../../../types';
import { IEvents } from '../Events';

export class Catalog {
    private items: IProduct[] = []
    private selectedItem: IProduct | null = null;

    constructor(private events?: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events?.emit('catalog:changed', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedItem(product: IProduct | null): void {
        this.selectedItem = product;
        this.events?.emit('catalog:selected', { item: this.selectedItem });
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}
