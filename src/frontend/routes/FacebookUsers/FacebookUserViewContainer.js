import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserThreads } from '../../actions/facebookUsersActions';
import FacebookUserView from './FacebookUserView';

function mapStateToProps (state) {
  return {
    user_threads: state.facebookUsers.user_threads
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  // console.log(ownProps);
  return {
  loadData: () => {
    dispatch(fetchUserThreads(ownProps.user_id));
  },
  user_id: ownProps.user_id
};};

export default connect(mapStateToProps, mapDispatchToProps)(FacebookUserView);
