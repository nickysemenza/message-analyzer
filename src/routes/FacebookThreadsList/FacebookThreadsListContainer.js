import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchThreads } from '../../actions/facebookThreadsActions';
import FacebookThreadsList from './FacebookThreadsList';

function mapStateToProps (state) {
  return {
    threads: state.facebookThreads
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: () => {
    dispatch(fetchThreads());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FacebookThreadsList);
