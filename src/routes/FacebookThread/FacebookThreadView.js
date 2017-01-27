import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import NVD3Chart from 'react-nvd3';
export default class FacebookThreadView extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {

    const threadObj = this.props.thread ? this.props.thread[this.props.thread_id] : null;
    let messages = threadObj && threadObj.messages ? threadObj.messages : [];
    let counts = threadObj && threadObj.stats ? threadObj.stats.counts : {};

    let data1 = [];
    for(let c in counts) {
      data1.push({key: c, y:counts[c]});
    }

    return (<div>
        <h1>Viewing thread {this.props.thread_id}</h1>z
        {messages.length}
        <button onClick={this.props.loadData}>Reload Data</button>

        <div><pre>{JSON.stringify(threadObj ? threadObj.stats : [] , null, 2) }</pre></div>

        <NVD3Chart
          tooltip={false}
          id="chart"
          width={900}
          height={700}
          type="pieChart"
          datum={data1}
          x="key"
          y="y"
        />

        <BootstrapTable data={messages} striped={true} hover={true} pagination>
          <TableHeaderColumn dataField="id" width="40" isKey={true} dataSort={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="thread_id" width="200" dataSort={true}>Thread ID</TableHeaderColumn>
          <TableHeaderColumn dataField="sender_name" width="250" dataSort={true}>Sender Name</TableHeaderColumn>
          <TableHeaderColumn dataField="body" width="400" dataSort={true}>Message</TableHeaderColumn>
          <TableHeaderColumn dataField="raw" width="400" dataSort={true}>Raw</TableHeaderColumn>
        </BootstrapTable>

    </div>
    );
  }
}
