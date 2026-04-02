import { ensureElement } from "../../../utils/utils";
import { IFormContacts } from "../../../types";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";


export class FormContacts extends Form<IFormContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts:change', { email: this.emailInput.value });
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:change', { phone: this.phoneInput.value });
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contacts:submit', {
        email: this.emailInput.value.trim(),
        phone: this.phoneInput.value.trim(),
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}