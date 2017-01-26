import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchThreads } from '../../actions/threadsActions';
import FacebookThreadsList from './FacebookThreadsList';

function mapStateToProps (state) {
  return {
    threads: state.threads
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: () => {
    dispatch(fetchThreads());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FacebookThreadsList);
