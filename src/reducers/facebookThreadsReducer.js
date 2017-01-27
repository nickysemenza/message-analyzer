import {
  REQUEST_THREADS,
  RECEIVE_THREADS
} from '../actions/facebookThreadsActions';

const INITIAL_STATE = { threads: null, lastUpdated: null, loading: false };

export default function (state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    case REQUEST_THREADS:
      return { ...state, loading: true };
    case RECEIVE_THREADS:
      // todo: validation
      return { ...state,
        loading: false,
        threads: action.threads,
        lastUpdated: action.receivedAt
      };
    default:
      return state;
  }
}
