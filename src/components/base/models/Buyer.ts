import { 
    IBuyer,
    TPayment,
    ValidationErrors
} from "../../../types";

export class Buyer {
    _payment: TPayment | '';
    _email: string;
    _phone: string;
    _address: string;

    constructor(data?: Partial<IBuyer>) {
        this._payment = data?.payment || '';
        this._email = data?.email || '';
        this._phone = data?.phone || '';
        this._address = data?.address || '';
    }

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.address !== undefined) this._address = data.address;
    }

    getData(): IBuyer {
        return {
            payment: this._payment as TPayment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clear(): void {
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this._address || this._address.trim() === '') {
            errors.address = 'Введите адрес доставки';
        }

        if (!this._email || this._email.trim() === '') {
            errors.email = 'Укажите email';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this._email)) {
                errors.email = 'Укажите корректный email';
            }
        }

        if (!this._phone || this._phone.trim() === '') {
            errors.phone = 'Укажите телефон';
        } else {
            const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
            if (!phoneRegex.test(this._phone.replace(/\s/g, ''))) {
                errors.phone = 'Укажите корректный телефон';
            }
        }

        return errors;
    }
}