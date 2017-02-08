import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FacebookThreadsList from '../FacebookThread/FacebookThreadsList';
export default class FacebookUserView extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {
    const threads = this.props.user_threads ? this.props.user_threads[this.props.user_id] : null;
    const numThreads = threads && threads.threads ? threads.threads.length : 0;

    return (<div>
        <h1>Viewing facebook user {this.props.user_id}</h1>
        <h2>{numThreads} threads</h2>
        <FacebookThreadsList threads={threads} loadData={this.props.loadData}/>
        <div><pre>{JSON.stringify(threads ? threads : [] , null, 2) }</pre></div>
       derp

    </div>
    );
  }
}
