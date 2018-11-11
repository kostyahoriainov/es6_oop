import {createStore, combineReducers} from 'redux';
import {generate  as id} from 'shortid';
import {data} from './data';


//события что должны быть
const SELECT_STATUS = 'SELECT_STATUS';
const ADD_PLAYER = 'ADD_PLAYER';

const playersReducer = (state = data.players, action)  => {
    //TODO описать редюсер для игрока
    const {type, payload} = action;
    switch(type) {
        case ADD_PLAYER:
            return [...state, {
                id: id(),
                name: payload.name,
                result: 0,
                status: 3
            }];
    }
    return state;
}

const statusReducer = (state = data.statuses, action) => {
    const {type, payload} = action;
    switch(type) {
        case SELECT_STATUS:
            return payload
    }
    return state
}

const reducer = combineReducers({
    players: playersReducer,
    selectStatus: statusReducer
});

const store = createStore(reducer);
window.store = store;

const selectStatusAction = selectStatus => ({
    type: SELECT_STATUS,
    payload: {selectStatus}
})

const  addPlayerAction = name => ({
    type: ADD_PLAYER,
    payload: {name}
})

//TODO отрисовывать табличку по колонкам, так же отрисовывать option в селектах
//TODO добавить обработку событий на субмит формы addPlayer и изменения чекбокса 'status-select'

const getStatus = (id) => {
    switch(id) {
        case 1:
            return 'pro'
        case 2:
            return 'beginer'
        case 3:
            return 'amateur'
    }
    return id
}

const render = () => {
    //TODO написать свой render()
    const {players, selectStatus} = store.getState();
    let id = 0;
    document.getElementById('results').innerHTML = players
        .map(p => {
            let title = getStatus(p.status);
            return `<tr ${selectStatus.selectStatus === p.status ? 'class="table-info"' : ''}>
            <td>${id++}</td>
            <td>${p.name}</td>
            <td>${p.result}</td>
            <td>${title}</td>
        </tr>`})
        .join('');

    if (selectStatus.length > 1) {
        document.getElementById('status-select').innerHTML = selectStatus
            .map(s => `<option value="${s.id}">
                ${s.title}</option>`)
            .join('')
    }
}

document.forms.addPlayer.addEventListener('submit', e => {
    e.preventDefault();
    const val = document.getElementById('addPlayer').value;
    if (val) {
        store.dispatch(addPlayerAction(val));
        document.getElementById('addPlayer').value = '';
    }
}, false)

document.getElementById('status-select').addEventListener('change', ({target}) => {
    let val = target.value;
    let valInt = parseInt(val);
    store.dispatch(selectStatusAction(valInt));
})

render();
store.subscribe(render);