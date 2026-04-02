import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected closeButton: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  constructor(container: HTMLElement, actions?: { onClick: () => void }) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);

    if(actions?.onClick) {
      this.closeButton.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}