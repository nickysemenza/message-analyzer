import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchThreadMessages, queueThreadDownload } from '../../actions/facebookThreadsActions';
import FacebookThreadView from './FacebookThreadView';

function mapStateToProps (state) {
  return {
    thread: state.facebookThreads.thread_list
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  // console.log(ownProps);
  return {
  loadData: () => {
    dispatch(fetchThreadMessages(ownProps.thread_id));
  },
  queueThreadDownload: () => {
    dispatch(queueThreadDownload(ownProps.thread_id));
  },
  thread_id: ownProps.thread_id
};};

export default connect(mapStateToProps, mapDispatchToProps)(FacebookThreadView);
