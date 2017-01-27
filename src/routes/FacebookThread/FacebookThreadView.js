import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class FacebookThreadView extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {
    const threadObj = this.props.thread ? this.props.thread[this.props.thread_id] : null;
    let messages = threadObj && threadObj.messages ? threadObj.messages : [];

    return (<div>
        <h1>Viewing thread {this.props.thread_id}</h1>z
        {messages.length}
        <button onClick={this.props.loadData}>Reload Data</button>

        <BootstrapTable data={messages} striped={true} hover={true} pagination>
          <TableHeaderColumn dataField="id" width='40' isKey={true} dataSort={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="thread_id" width='250' dataSort={true}>Thread ID</TableHeaderColumn>
          <TableHeaderColumn dataField="sender_name" dataSort={true}>Sender Name</TableHeaderColumn>
          <TableHeaderColumn dataField="body" width='400' dataSort={true}>Message</TableHeaderColumn>
          <TableHeaderColumn dataField="raw" width='400' dataSort={true}>Raw</TableHeaderColumn>
        </BootstrapTable>

    </div>
    );
  }
}
