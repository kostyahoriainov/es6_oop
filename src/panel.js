import {Dispatcher,Store} from './flux'

// dispatcher
const panelDispatcher = new Dispatcher();

document.querySelector("#userNameInput").addEventListener('input', ({
    target
}) => {
    const name = target.value;
    panelDispatcher.dispatch(userNameUpdate(name))
})

document.fontSizeForm.fontSize.forEach(item => {
    item.addEventListener('change', ({
        target
    }) => {
        const size = target.value;
        panelDispatcher.dispatch(fontSizeUpdate(size));
    }, false)
})

panelDispatcher.register((action) => {
    console.log(action)
})

//store 

class PanelStore extends Store {
    getInitialState() {
        return localStorage['preference'] 
        ? JSON.parse(localStorage['preference']) 
        : {
            userName: 'Jim',
            fonSize: 'small'
        }
    }

    __onDispatch(action) {
        const {
            type,
            payload
        } = action;

        switch (type) {
            case UPDATE_USERANME:
                this.__state.username = payload;
                this.__emitChange();
                break;
            case UPDATE_FONTSIZE:
                this.__state.fontSize = payload;
                this.__emitChange();
                break;
        }
    }
}

const panelStore = new PanelStore(panelDispatcher);

panelStore.addListener(state => {
    console.log("current state is", state);
})

//Actions 
/*Action -> в обработчиках событий view, action передаются в dispatch() как вызов
функций (action  creators)
Action creators -  это простая функция которая возвращает объект
     {type: ..., value: ...}
И в методе  __onDispatch() объекта Store с помощью switch
анализируется type  и соответственно меняется __state объекта
Store и запускается метод __emitChange().*/
const UPDATE_USERANME = 'UPDATE_USERANME';
const UPDATE_FONTSIZE = 'UPDATE_FONTSIZE';

const userNameUpdate = name => ({
    type: UPDATE_USERANME,
    payload: name
});

const fontSizeUpdate = size => ({
    type: UPDATE_FONTSIZE,
    payload: size
});

/*
В view пишем функцию render которая принимает state и применяет его значения
к DOM элементам.
В view с помощью store.addListener регистрирутся слушатель
   state => render(state), который  будет запускать функцию render
   (см. метод __emitChange() класса Store )
   */
panelStore.addListener(state => {
    render(state);
    localStorage['preference'] = JSON.stringify(state);
})

const render = ({
    username,
    fontSize
}) => {
    document.getElementById('userName').innerHTML = username;
    document.getElementById('content-page').style.fontSize = fontSize === 'small' ? '16px' : '24px';
}

render(panelStore.getState());