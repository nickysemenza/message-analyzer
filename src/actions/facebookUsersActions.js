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
