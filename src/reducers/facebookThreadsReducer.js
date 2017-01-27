import {
  REQUEST_THREADS,
  RECEIVE_THREADS,
  REQUEST_THREAD_MESSAGES,
  RECEIVE_THREAD_MESSAGES,
} from '../actions/facebookThreadsActions';

const INITIAL_STATE = { threads: [], thread_list: {}, lastUpdated_threads: null, loading_threads: false };

export default function (state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    case REQUEST_THREADS:
      return { ...state, loading_threads: true };
    case RECEIVE_THREADS:
      // todo: validation
      return { ...state,
        loading: false,
        threads: action.threads,
        lastUpdated_threads: action.receivedAt
      };
    case REQUEST_THREAD_MESSAGES:
      return {
        ...state,
        // ...state.threads,
        thread_list: {
          ...state.thread_list,
          [action.thread_id] : {loading: true}
        }
      };
    case RECEIVE_THREAD_MESSAGES:

      return {
        ...state,
        // ...state.threads,
        thread_list: {
          ...state.thread_list,
          [action.thread_id] : {loading: false,
            messages: action.messages,
            lastUpdated: action.receivedAt
          }
        }
      };

    default:
      return state;
  }
}
