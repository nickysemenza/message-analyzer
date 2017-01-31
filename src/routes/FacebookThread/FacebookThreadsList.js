import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Router, Route, Link, browserHistory } from 'react-router';

export default class FacebookThreadsList extends Component {
  componentDidMount () {
    if(this.props.loadData)
      this.props.loadData();
  }
  colFormatter = (cell, row) => {
    return (
      <Link to={`/facebook/threads/${cell}/view`}>
        {cell}
      </Link>
    );
  };
  render () {
    let threadList = this.props.threads.threads ? this.props.threads.threads : [];

    const options = {
      sizePerPageList: [
        {text: '100', value: 100},
        {text: '500', value: 500},
        {text: 'all', value: threadList.length}
        ], // you can change the dropdown list for size per page
      sizePerPage: 100  // which size per page you want to locate as default
      // pageStartIndex: 0, // where to start counting the pages
      // paginationSize: 3,  // the pagination bar size.
      // prePage: 'Prev', // Previous page button text
      // nextPage: 'Next', // Next page button text
      // firstPage: 'First', // First page button text
      // lastPage: 'Last', // Last page button text
      // paginationShowsTotal: this.renderShowsTotal  // Accept bool or function
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
    };

    return (<div>
        <button onClick={this.props.loadData}>Reload Data</button>
        <button onClick={this.props.queueDownload}>Queue Thread List Download</button>
        <hr/>
        <BootstrapTable data={threadList} striped={true} hover={true} pagination options={options}>
          <TableHeaderColumn dataField="id" width="60" isKey={true} dataSort={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="thread_id" width="170" dataFormat={this.colFormatter} dataSort={true}>Thread ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort={true}>Thread Name</TableHeaderColumn>
          <TableHeaderColumn dataField="message_count" width="150" dataSort={true}># Messages</TableHeaderColumn>
          <TableHeaderColumn dataField="downloaded_message_count" width="150" dataSort={true}># Downloaded</TableHeaderColumn>
          <TableHeaderColumn dataField="num_participants" width="100" dataSort={true}># People</TableHeaderColumn>
        </BootstrapTable>


    </div>
    );
  }
}
