import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export class Form<T extends object> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}