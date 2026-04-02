import { IProduct } from "../../../types";
import { IEvents } from "../Events";

export class Basket {
    private items: IProduct[] = [];

    constructor(private events?: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.events?.emit('basket:changed', { items: this.items });
        }
    }

    removeItem(item: IProduct): void {
        const nextItems = this.items.filter(i => i.id !== item.id);
        if (nextItems.length !== this.items.length) {
            this.items = nextItems;
            this.events?.emit('basket:changed', { items: this.items });
        }
    }

    clear(): void {
        if (this.items.length > 0) {
            this.items = [];
            this.events?.emit('basket:changed', { items: this.items });
        }
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