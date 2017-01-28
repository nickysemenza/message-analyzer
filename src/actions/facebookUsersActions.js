// import { API_BASE_URL } from 'config';

export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';

export function fetchUsers () {
  return (dispatch) => {
    dispatch(requestUsers());
    return fetch(`http://localhost:3003/facebook/users`)
    // return fetch(`${API_BASE_URL}/users`)
      .then((response) => response.json())
      .then((json) => dispatch(receiveUsers(json)));
  };
}

function requestUsers () {
  return {
    type: REQUEST_USERS
  };
}

function receiveUsers (json) {
  if ('error' in json) {
    json = null;
  }
  return {
    type: RECEIVE_USERS,
    users: json,
    receivedAt: Date.now()
  };
}

export const REQUEST_USER_THREADS = 'REQUEST_USER_THREADS';
export const RECEIVE_USER_THREADS = 'RECEIVE_USER_THREADS';


export function fetchUserThreads (user_id) {
  return (dispatch) => {
    dispatch(requestUserThreads(user_id));
    return fetch(`http://localhost:3003/facebook/users/${user_id}/threads`)
      .then((response) => response.json())
      .then((json) => dispatch(receiveUserThreads(user_id, json)));
  };
}

function requestUserThreads (user_id) {
  return {
    type: REQUEST_USER_THREADS,
    user_id
  };
}

function receiveUserThreads (user_id, json) {
  if ('error' in json) {
    json = null;
  }
  return {
    type: RECEIVE_USER_THREADS,
    threads: json,
    user_id,
    receivedAt: Date.now()
  };
}
