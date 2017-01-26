import { combineReducers } from 'redux';
import threads from './threadsReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  threads,
  routing: routerReducer
});

export default rootReducer;
