import { Store } from "./Store";

export class ReduceStore extends Store{
    constructor(dispatcher) {
        super(dispatcher);
        this.__history = [];
    }    

    reduce(state, action) {
        throw new Error('reduce must be overidden in subclasses')
    }

    __onDispatch(action) {
        const newState = this.reduce(this.__state, action);
        if (newState !== this.__state) {
            this.__history.push(this.__state);
            this.__state = newState;
            this.__emitChange();
        }
    }
    isHistory(){
        return this.__history.length > 0;
    }

    revert() {
        if (this.isHistory()) {
            this.__state = this.__history.pop();
            this.__emitChange();
        }
    }
}