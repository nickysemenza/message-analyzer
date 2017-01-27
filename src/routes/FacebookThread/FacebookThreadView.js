import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// let PieChart = require("react-chartjs").Pie;
import { Pie } from 'react-chartjs-2';

export default class FacebookThreadView extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {

    const randomColorGenerator = function () {
      return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
    };



    const threadObj = this.props.thread ? this.props.thread[this.props.thread_id] : null;
    let messages = threadObj && threadObj.messages ? threadObj.messages : [];


    let counts = threadObj && threadObj.stats ? threadObj.stats.counts : {};
    let bg = [];
    for (let i = 1; i <= Object.keys(counts).length; i++) {
      bg.push(randomColorGenerator());
    }
    const data = {
      labels: Object.keys(counts),
      datasets: [{data: Object.values(counts), backgroundColor: bg}]
    };
    console.log(data);
    return (<div>
        <h1>Viewing thread {this.props.thread_id}</h1>z
        {messages.length}
        <button onClick={this.props.loadData}>Reload Data</button>

        <div><pre>{JSON.stringify(threadObj ? threadObj.stats : [] , null, 2) }</pre></div>
        {/*<PieChart data={counts} width="600" height="250"/>*/}
        <Pie
          data={data}
        />

        <BootstrapTable data={messages} striped={true} hover={true} pagination>
          <TableHeaderColumn dataField="id" width="40" isKey={true} dataSort={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="thread_id" width="250" dataSort={true}>Thread ID</TableHeaderColumn>
          <TableHeaderColumn dataField="sender_name" dataSort={true}>Sender Name</TableHeaderColumn>
          <TableHeaderColumn dataField="body" width="400" dataSort={true}>Message</TableHeaderColumn>
          <TableHeaderColumn dataField="raw" width="400" dataSort={true}>Raw</TableHeaderColumn>
        </BootstrapTable>

    </div>
    );
  }
}
