import {Dispatcher, Store} from './flux'


// dispatcher
const panelDispatcher = new Dispatcher();

document.querySelector("#userNameInput").addEventListener('input', ({target}) => {
    const name = target.value;
    panelDispatcher.dispatch(userNameUpdate(name))
})

document.fontSizeForm.fontSize.forEach(item => {
    item.addEventListener('change', ({target}) => {
        const size = target.value;
        panelDispatcher.dispatch(fontSizeUpdate(size));
    }, false)
})

panelDispatcher.register( (action) => {
    console.log(action)
})

//store 

class PanelStore extends Store {
    getInitialState(){
        return localStorage['preference'] 
        ? JSON.parse(localStorage['preference'])
         : {
             username: 'Jim',
             fontSize: 'small'
         }
    }

    __onDispatch(action){
        const {type, payload} = action;

        switch(type) {
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

panelStore.addListener(state => {
    render(state);
    localStorage['preference'] = JSON.stringify(state);
})

const render = ({ username, fontSize }) => {
    document.getElementById('userName').innerHTML = username;
    document.getElementById('content-page').style.fontSize = fontSize === 'small' ? '16px' : '24px';
}

render(panelStore.getState());