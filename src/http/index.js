import {generate as id} from 'shortid';

export  function get(url, cb) {
    setTimeout(function(){
        cb(id());
    }, 2000)
}