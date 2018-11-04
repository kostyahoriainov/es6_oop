import {generate as id} from 'shortid';

export  const data = {
    players: [
        {id: id(), name: "Bill", result:  77, status: 1},
        {id: id(), name: "Pete", result:  40, status: 2},
        {id: id(), name: "Ashley", result:  12, status: 3},
        {id: id(), name: "Tom", result:  87, status: 1},
        {id: id(), name: "Barbara", result:  33, status: 2},
        {id: id(), name: "Sasha", result:  7, status: 3},
        {id: id(), name: "Greg", result:  76, status: 1},
        {id: id(), name: "Pete", result:  45, status: 2},
        {id: id(), name: "Jim", result:  17, status: 3},
        {id: id(), name: "Nicole", result:  20, status: 3}
    ],
    statuses: [
        {id:1, title: 'pro'},
        {id:2, title: 'beginer'},
        {id:3, title: 'amateur'}
    ]
};