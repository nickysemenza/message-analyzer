import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class FacebookThreadsList extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {
    let threadList = this.props.threads.threads ? this.props.threads.threads : []

    let table = this.props.threads.threads ?
      threadList.map(thread=><div style={{ backgroundColor: 'grey', padding: '10px' }} key={thread.id}>{thread.thread_id}<br/>{thread.name}<hr/></div>)
      : '';
    return (<div>
        <button onClick={this.props.loadData}>Reload Data</button>
        <hr/>
        <BootstrapTable data={threadList} striped={true} hover={true}>
          <TableHeaderColumn dataField="id" width='60' isKey={true} dataSort={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="thread_id" width='170' dataSort={true}>Thread ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort={true}>Thread Name</TableHeaderColumn>
          <TableHeaderColumn dataField="message_count" width='150' dataSort={true}># Messages</TableHeaderColumn>
          <TableHeaderColumn dataField="downloaded_message_count" width='150' dataSort={true}># Downloaded</TableHeaderColumn>
          <TableHeaderColumn dataField="num_participants" width='100' dataSort={true}># People</TableHeaderColumn>
        </BootstrapTable>


    </div>
    );
  }
}
