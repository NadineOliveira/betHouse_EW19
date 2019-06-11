import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const inititalState = {};



const store = createStore(
    rootReducer,
    inititalState,
    applyMiddleware(thunk)
    //compose(applyMiddleware(thunk), 
    //     window.__REDUX_DEVTOOLS_EXTENSION__&& window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;