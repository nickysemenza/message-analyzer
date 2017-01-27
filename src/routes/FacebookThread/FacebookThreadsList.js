import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Router, Route, Link, browserHistory } from 'react-router';

export default class FacebookThreadsList extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  colFormatter = (cell, row) => {
    return (
      <Link to={`/facebook/threads/${cell}/view`}>
        {cell}
      </Link>
    )
  }
  render () {
    let threadList = this.props.threads.threads ? this.props.threads.threads : [];

    return (<div>
        <button onClick={this.props.loadData}>Reload Data</button>
        <hr/>
        <BootstrapTable data={threadList} striped={true} hover={true} pagination>
          <TableHeaderColumn dataField="id" width='60' isKey={true} dataSort={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="thread_id" width='170' dataFormat={ this.colFormatter } dataSort={true}>Thread ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort={true}>Thread Name</TableHeaderColumn>
          <TableHeaderColumn dataField="message_count" width='150' dataSort={true}># Messages</TableHeaderColumn>
          <TableHeaderColumn dataField="downloaded_message_count" width='150' dataSort={true}># Downloaded</TableHeaderColumn>
          <TableHeaderColumn dataField="num_participants" width='100' dataSort={true}># People</TableHeaderColumn>
        </BootstrapTable>


    </div>
    );
  }
}
