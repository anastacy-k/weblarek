import { categoryMap } from "../../../utils/constants";
import { CategoryKey } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { ICardActions } from "../../../types";
import { Card } from "./Card";

export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'title' | 'description' | 'price'>

export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if(actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this.buttonElement.disabled = true;
    } else {
      this.buttonElement.disabled = false;
    }
  }
}