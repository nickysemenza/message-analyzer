// import { API_BASE_URL } from 'config';

export const REQUEST_THREADS = 'REQUEST_THREADS';
export const RECEIVE_THREADS = 'RECEIVE_THREADS';

export function fetchThreads () {
  return (dispatch) => {
    dispatch(requestThreads());
    return fetch(`http://localhost:3003/facebook/threads`)
    // return fetch(`${API_BASE_URL}/threads`)
      .then((response) => response.json())
      .then((json) => dispatch(receiveThreads(json)));
  };
}

function requestThreads () {
  return {
    type: REQUEST_THREADS
  };
}

function receiveThreads (json) {
  if ('error' in json) {
    json = null;
  }
  return {
    type: RECEIVE_THREADS,
    threads: json,
    receivedAt: Date.now()
  };
}
