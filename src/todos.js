import {Dispatcher, ReduceStore} from './flux';
import {generate as id} from 'shortid';

const CREATE_TASK_ACTION = 'CREATE_TASK_ACTION';
const SHOW_COMPLETED_ACTION = 'SHOW_COMPLETED_ACTION';
const COMPLETE_TASK_ACTION = 'COMPLETE_TASK_ACTION';

const createTaskAction = (task) => ({
    type: CREATE_TASK_ACTION,
    payload: {task}
})

const showCompletedAction = (show) => ({
    type: SHOW_COMPLETED_ACTION,
    payload: {show}
})

const completeTaskAction = (id, completed) => ({
    type: COMPLETE_TASK_ACTION,
    payload: {id , completed}
})

const todoDispatcher = new Dispatcher();

class TaskStore extends ReduceStore{
    getInitialState() {
        return {
            tasks: [
                {
                    id: id(),
                    content: 'first task',
                    completed: false
                },
                {
                    id: id(),
                    content: 'second task',
                    completed: false
                },                {
                    id: id(),
                    content: 'third task',
                    completed: false
                },
            ],
            showComplete: false
        }
    }

    reduce(state, action) {
        const {type, payload} = action;
        let newState;
        switch(type) {
            case CREATE_TASK_ACTION:
                newState = {...state, tasks: [...state.tasks]};
                newState.tasks.push({
                    id: id(),
                    content: payload.task,
                    completed: false
                })
                return newState
            case SHOW_COMPLETED_ACTION:
                return {...state, showComplete: payload.show}
            case COMPLETE_TASK_ACTION:
                newState = {...state, tasks: [...state.tasks]};
                const idx = newState.tasks.findIndex(t => t.id === payload.id);
                newState.tasks[idx] = {...state.tasks[idx], completed: payload.completed}
                return newState
        }
        return state
    }
}

const taskStore = new TaskStore(todoDispatcher);


const TaskComponent = ({content, completed, id}) => {
    return `<section>
        <label for="${id}">${content}</label>
        <input type="checkbox" name="taskCompleteCheck" id="${id}" data-taskid="${id}" ${completed ? 'checked': ''}>
    </section>`;
}

var undoBtn = document.forms.undo;
var undoBtnText = undoBtn.firstElementChild.innerHTML;
const render = () => {
    const tasksSection = document.getElementById('tasks');
    const {tasks, showComplete} = taskStore.getState();
    
    const rendered = tasks
        .filter(task => showComplete ? true : !task.completed)
        .map(TaskComponent)
        .join('');
    tasksSection.innerHTML = rendered;

    document.getElementById('showComplete').checked = showComplete;

    document.getElementsByName('taskCompleteCheck').forEach(item => {
        item.addEventListener('change', ({target}) => {
            const id = target.dataset.taskid;
            const checked = target.checked;
            todoDispatcher.dispatch(completeTaskAction(id, checked))
        })
    })

    if (taskStore.isHistory()) {
            undoBtn.firstElementChild.disabled = false;
            undoBtn.firstElementChild.innerHTML = undoBtnText + " - " + taskStore.__history.length;
        } else {
            undoBtn.firstElementChild.disabled = true;
            undoBtn.firstElementChild.innerHTML = undoBtnText;
        }

}

document.forms.newTask.addEventListener('submit', e => {
    e.preventDefault();
    let val = e.target.newTaskName.value;
    if(val) {
        todoDispatcher.dispatch(createTaskAction(val));
        e.target.newTaskName.value = ''
    }
}, false)

document.getElementById('showComplete').addEventListener('change', ({target}) => {
    const showCompleted = target.checked;
    todoDispatcher.dispatch(showCompletedAction(showCompleted))    
})
undoBtn.addEventListener('submit', e => {
    e.preventDefault();
    taskStore.revert();
}, false)

taskStore.addListener(render)

render();