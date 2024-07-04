import EventEmitter from './EventEmitter';

export default class EventListener extends EventEmitter {
    constructor() {
        super();
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    addKeyboardListeners() {
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('keydown', this.handleKeyDown);
    }

    removeKeyboardListeners() {
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyUp(event) {
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's'];
        if (arrowKeys.includes(event.key)) {
            this.trigger('arrowKeyUp', [event]);
        }
    }

    handleKeyDown(event) {
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's'];
        if (arrowKeys.includes(event.key)) {
            this.trigger('arrowKeyDown', [event]);
        }
    }
}
