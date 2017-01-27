import { combineReducers } from 'redux';
import facebookThreads from './facebookThreadsReducer';
import facebookUsers from './facebookUsersReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  facebookThreads,
  facebookUsers,
  routing: routerReducer
});

export default rootReducer;
