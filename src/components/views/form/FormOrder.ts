import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { 
  TPayment,
  IFormOrder
} from "../../../types";
import { Form } from "./Form";

export class FormOrder extends Form<IFormOrder> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order:payment', { payment: 'card' as TPayment });
    });
    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:payment', { payment: 'cash' as TPayment });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:change', { address: this.addressInput.value });
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit', {
        payment: this.payment,
        address: this.addressInput.value.trim(),
      });
    });
  }

  set payment(value: TPayment) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set errors(value: string) {
    super.errors = value;
  }

  set valid(value: boolean) {
    super.valid = value;
  }
}