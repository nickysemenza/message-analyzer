import { expect } from 'chai';
import * as ActionTypes from '../actions/facebookThreadsActions';
import reducer from './facebookUsersReducer';

describe('Reducers::facebookUsersReducer', () => {
  const getInitialState = () => {
    return { users: null, user_threads: {}, lastUpdated_users: null, loading_users: false };
  };
  it('should set initial state by default', () => {
    const action = { type: 'unknown' };
    const expected = getInitialState();

    expect(reducer(undefined, action)).to.deep.equal(expected); // Notice use of deep because it's a nested object
    // expect(reducer(undefined, action)).to.equal(expected); // Fails. Not deeply equal
  });
});
