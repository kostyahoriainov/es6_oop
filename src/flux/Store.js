/*Store -> имеет свойства this.__listeners = [],
         this.state = this.getInitialState();
- в его конструктор передается объект класса Dispatcher, и в dispatcher
регистрируется  метод  __onDispatch() объекта Store - то есть слушатель,
 который будет вызываться при изменениях.

И теперь, когда в обработчиках событий view будет вызываться  dispatch,
 то запуститься метод  __onDispatch(action)  и ему будет
в  аргументе передан соответствующий action.
Метод __onDispatch(action)  должен быть переопределен в subclasses

В классе Store  также есть
- метод addListener который регистрирует слушатели
- метод getInitialState который должен быть переопределен в subclasses
- метод  __emitChange()  который запускает зарегестрированные слушатели и передает ему __state
*/
export class Store {
    constructor(dispatcher) {
        this.__listeners = [];
        this.__state = this.getInitialState();
        // регестрация метода 
        dispatcher.register(this.__onDispatch.bind(this));
    }

    // слушатель, который будет вызываеться при измененниях
    __onDispatch() {
        throw new Error('getInitialState method must be override in subclasses')
    }

    addListener(listener) {
        this.__listeners.push(listener)
    }

    __emitChange(){
        this.__listeners.forEach(l => l(this.__state));
    }

    getState() {
        return this.__state;
    }
    
    getInitialState() {
        throw new Error('getInitialState method must be override in subclasses')
    }
}

