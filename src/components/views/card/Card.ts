import { ensureElement } from "../../../utils/utils";
import { ICardActions } from "../../../types";
import { Component } from "../../base/Component";

export class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, protected actions?: ICardActions) {
    super(container);
    
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this.priceElement) {
      if (value === null) {
        this.priceElement.textContent = 'Бесценно';
      } else {
        this.priceElement.textContent = `${value} синапсов`;
      }
    }
  }
}