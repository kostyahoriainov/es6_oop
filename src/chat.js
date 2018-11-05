import {createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {get} from './http/index';

//Actions
const ONLINE = 'ONLINE';
const OFFLINE = 'OFFLINE';
const CREATE_MESSAGE = 'CREATE_MESSAGE';
const CHANGE_STATUS = 'CHANGE_STATUS';
const READY = '_READY';
const START = '_START';

//состояние для всего приложения
const defaultState = {
    messages: [
        {
            date: new Date(),
            postedBy: 'Jim',
            content: 'Hello Bill i am here'
        },
        {
            date: new Date(),
            postedBy: 'Bill',
            content: 'Hello Jim, have are you?'
        }
    ],
    userStatus: ONLINE,
    api: true
}

//cоздаем отдельные редюсеры для каждого компонента
//сообщения, пользователя, и работы с апи
// всем им передаем отдельные кусочки состояния
const messagesReducer  = (state = defaultState.messages, action) => {
    const {type, payload} = action;
    switch(type) {
        case CREATE_MESSAGE + READY:
            return [...state, {
                date : new Date(),
                content: payload.content,
                postedBy : localStorage['preferences'] ? 
                        JSON.parse(localStorage['preferences']).userName: 'Pete'
            }];
    }
   
    return state;
}
const userStatusReducer = (state = defaultState.userStatus, action) => {
    const {type, payload} = action;
    switch(type) {
        case CHANGE_STATUS:
            return payload.status;
    }
    return state
}

const apiReducer = (state = defaultState.api, action)  => {
    const {type, payload}  = action;
    switch(type) {
        case CREATE_MESSAGE + START:
            return false;
            break;
        case CREATE_MESSAGE + READY:
             return true;    
    }
    return state;
}

//обеденям их с помощью combineReducers из пакета redux
const reducer = combineReducers({
    messages: messagesReducer, 
    userStatus: userStatusReducer,
    api: apiReducer
});

//Создает Redux хранилище которое хранит полное дерево состояния вашего приложения.
//Оно должно быть единственным хранилищем в вашем приложении.
const store = createStore(reducer, {} , applyMiddleware(thunk, logger));
//разместил хранилище в windiw в туду можно было сделать так же
window.store = store;




//Action functions
const changeStatusAction = status  => ({
    type: CHANGE_STATUS,
    payload: {status}
})

const createMessageAction = content  => (dispatch)  => {
    dispatch({
        type: CREATE_MESSAGE + START
    })    
    get('/api/v1', function(){
        dispatch({
            type: CREATE_MESSAGE + READY,
            payload: {content}
       })
    })
   

}


document.forms.newMessage.addEventListener('submit', e => {
    e.preventDefault();
    const content  = e.target.newMessage.value;
    store.dispatch(createMessageAction(content));
    e.target.newMessage.value = '';
}, false)

document.forms.selectStatus.status.addEventListener('change', ({target}) => {
    store.dispatch(changeStatusAction(target.value))
}, false)


const render = () => {
    const {messages, userStatus, api} = store.getState();
    document.getElementById('messages').innerHTML = 
        messages.sort( (a, b) => b.date  - a.date)
            .map(m => `<div>
                ${m.content}, <i>Posted By</i> <b>${m.postedBy}</b> 
            </div>`).join('');

            document.forms.newMessage.fields.disabled  =  (userStatus === OFFLINE || api === false);      

}

render();
store.subscribe(render);



