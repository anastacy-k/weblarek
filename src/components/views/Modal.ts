import { ensureElement } from "../../utils/utils";
import { IModal } from "../../types";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this.contentElement.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.innerHTML = '';
    this.events.emit('modal:close');
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}