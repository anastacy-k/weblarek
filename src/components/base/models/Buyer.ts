import { 
    IBuyer,
    TPayment,
    ValidationErrors
} from "../../../types";

export class Buyer {
    private payment: TPayment = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
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
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
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