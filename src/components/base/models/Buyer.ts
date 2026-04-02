import { 
    IBuyer,
    TPayment,
    ValidationErrors
} from "../../../types";
import { IEvents } from "../Events";

export class Buyer {
    private payment: TPayment = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(private events?: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        let changed = false;

        if (data.payment !== undefined && data.payment !== this.payment) {
            this.payment = data.payment;
            changed = true;
        }
        if (data.email !== undefined && data.email !== this.email) {
            this.email = data.email;
            changed = true;
        }
        if (data.phone !== undefined && data.phone !== this.phone) {
            this.phone = data.phone;
            changed = true;
        }
        if (data.address !== undefined && data.address !== this.address) {
            this.address = data.address;
            changed = true;
        }

        if (changed) {
            this.events?.emit('buyer:changed', this.getData());
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        const hadData = Boolean(this.payment || this.email || this.phone || this.address);
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';

        if (hadData) {
            this.events?.emit('buyer:changed', this.getData());
        }
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this.address || this.address.trim() === '') {
            errors.address = 'Введите адрес доставки';
        }

        if (!this.email || this.email.trim() === '') {
            errors.email = 'Укажите email';
        }

        if (!this.phone || this.phone.trim() === '') {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}