import { IProduct } from "../../../types";

export class Basket {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
        }
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter(i => i.id !== item.id);
    }

    clear(): void {
        this.items = [];
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}