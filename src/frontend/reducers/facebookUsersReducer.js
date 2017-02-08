import {
  REQUEST_USERS,
  RECEIVE_USERS,
  REQUEST_USER_THREADS,
  RECEIVE_USER_THREADS
} from '../actions/facebookUsersActions';

const INITIAL_STATE = { users: null, user_threads: {}, lastUpdated_users: null, loading_users: false };

export default function (state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    case REQUEST_USERS:
      return { ...state, loading_users: true };
    case RECEIVE_USERS:
      return { ...state,
        loading_users: false,
        users: action.users,
        lastUpdated_users: action.receivedAt
      };

    case REQUEST_USER_THREADS:
      return {
        ...state,
        user_threads: {
          ...state.user_threads,
          [action.user_id] : {...state.user_threads[action.user_id],loading: true}
        }
      };
    case RECEIVE_USER_THREADS:

      return {
        ...state,
        user_threads: {
          ...state.user_threads,
          [action.user_id] : {
            ...state.user_threads[action.user_id],
            loading: false,
            threads: action.threads,
            lastUpdated: action.receivedAt
          }
        }
      };



    default:
      return state;
  }
}
