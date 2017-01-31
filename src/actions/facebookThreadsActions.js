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


export const REQUEST_THREAD_MESSAGES = 'REQUEST_THREAD_MESSAGES';
export const RECEIVE_THREAD_MESSAGES = 'RECEIVE_THREAD_MESSAGES';

export function fetchThreadMessages (thread_id) {
  return (dispatch) => {
    dispatch(requestThreadMessages(thread_id));
    dispatch(fetchThreadStats(thread_id));
    return fetch(`http://localhost:3003/facebook/threads/${thread_id}/messages`)
      .then((response) => response.json())
      .then((json) => dispatch(receiveThreadMessages(thread_id, json)));
  };
}

function requestThreadMessages (thread_id) {
  return {
    type: REQUEST_THREAD_MESSAGES,
    thread_id
  };
}

function receiveThreadMessages (thread_id, json) {
  if ('error' in json) {
    json = null;
  }
  return {
    type: RECEIVE_THREAD_MESSAGES,
    messages: json,
    thread_id,
    receivedAt: Date.now()
  };
}
export const REQUEST_THREAD_STATS = 'REQUEST_THREAD_STATS';
export const RECEIVE_THREAD_STATS = 'RECEIVE_THREAD_STATS';

export function fetchThreadStats (thread_id) {
  return (dispatch) => {
    dispatch(requestThreadStats(thread_id));
    return fetch(`http://localhost:3003/facebook/threads/${thread_id}/stats`)
      .then((response) => response.json())
      .then((json) => dispatch(receiveThreadStats(thread_id, json)));
  };
}

function requestThreadStats (thread_id) {
  return {
    type: REQUEST_THREAD_STATS,
    thread_id
  };
}

function receiveThreadStats (thread_id, json) {
  if ('error' in json) {
    json = null;
  }
  return {
    type: RECEIVE_THREAD_STATS,
    stats: json,
    thread_id,
    receivedAt: Date.now()
  };
}


export function queueThreadDownload (thread_id) {
  return (dispatch) => {
    // dispatch(requestThreadStats(thread_id));
    return fetch(`http://localhost:3003/facebook/threads/${thread_id}/download`)
      .then((response) => response.json());
      // .then((json) => dispatch(receiveThreadStats(thread_id, json)));
  };
}
