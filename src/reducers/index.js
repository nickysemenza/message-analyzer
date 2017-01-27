import { combineReducers } from 'redux';
import facebookThreads from './facebookThreadsReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  facebookThreads,
  routing: routerReducer
});

export default rootReducer;
