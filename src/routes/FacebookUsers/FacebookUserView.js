import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FacebookThreadsList from '../FacebookThread/FacebookThreadsList';
export default class FacebookUserView extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {
    const threads = this.props.user_threads ? this.props.user_threads[this.props.user_id] : null;


    return (<div>
        <h1>Viewing facebook user {this.props.user_id}</h1>
        <h2>{threads.threads.length} threads</h2>
        <FacebookThreadsList threads={threads}/>
        <div><pre>{JSON.stringify(threads ? threads : [] , null, 2) }</pre></div>
       derp

    </div>
    );
  }
}
