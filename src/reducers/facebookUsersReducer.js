import {
  REQUEST_USERS,
  RECEIVE_USERS
} from '../actions/facebookUsersActions';

const INITIAL_STATE = { users: null, lastUpdated: null, loading: false };

export default function (state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    case REQUEST_USERS:
      return { ...state, loading: true };
    case RECEIVE_USERS:
      return { ...state,
        loading: false,
        users: action.users,
        lastUpdated: action.receivedAt
      };
    default:
      return state;
  }
}
