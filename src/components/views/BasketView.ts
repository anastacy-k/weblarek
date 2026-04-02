import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class BasketView extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected totalElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);

        if(actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            const emptyElement = document.createElement('li');
            emptyElement.textContent = 'Корзина пуста';
            this.listElement.replaceChildren(emptyElement);
            return;
        }

        this.listElement.replaceChildren(...items);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set selected(value: string[]) {
        this.buttonElement.disabled = value.length === 0;
    }
}