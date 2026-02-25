import { IProduct } from '../../../types';

export class Catalog {
    private items: IProduct[] = []
    private selectedItem: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedItem(product: IProduct | null): void {
        this.selectedItem = product;
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}
